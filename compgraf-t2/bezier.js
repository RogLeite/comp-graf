//const 'linear' = require("linear-solve/gauss-jordan.js");
var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pickedPoints = [];

const linePointRadius = 5;
const handlePointRadius = 4;


//resolução de cada spline
const resolution = 25;
const s_moving = "moving";
const s_selecting = "selecting";
var mode = s_selecting //pode assumir s_selecting ou s_moving




function toggleMode(){
	//alert("Mode Toggled");
	if(mode === s_selecting){
		mode = s_moving;
		if(pickedPoints.length>1){
			pickedPoints.pop();
			redraw(true);
		}
	}else if(mode === s_moving){
		mode = s_selecting;
		pickedPoints.push(new class_fullPoint(0,0));
	}
}
function setMode(s){
	if(s!== s_selecting || s!==s_moving){
		console.log("ERROR: in setMode(s) s is not a valid mode");
	}else{
		mode = s;
	}
}


function pickPoint(point){
	let mouse;
	//retira ponto do mouse
	if(pickedPoints.length!==0){
		mouse = pickedPoints.pop();
	}

	if(pickedPoints.length===1){
		//alert("pickedPoints[0]  = "+pickedPoints[0]);
		pickedPoints[0].interpolateTo(point);
	}else if(pickedPoints.length===2){
		pickedPoints[0].interpolateBetween(pickedPoints[1],point);
	}else if(pickedPoints.length>2){
		pickedPoints[pickedPoints.length-1].interpolateNew(pickedPoints[pickedPoints.length-2],point);
	}/**/
	
	//-----------------------------------------
	pickedPoints.push(point);

	//devolve ponto do mouse
	if(pickedPoints.length!==0){
		pickedPoints.push(mouse);
	}
}

function getPoint(evt,point){
	if(!point){
		let ret = canvas.getBoundingClientRect();
		return new class_fullPoint(evt.clientX-ret.x,evt.clientY-ret.y);
	}else {
		let ret = canvas.getBoundingClientRect();
		let localX = evt.clientX-ret.x, localY = evt.clientY-ret.y;
		point.moveTo(localX,localY);
		if(point.l){
			point.l.moveTo(localX,localY)
		}
		if(point.r){
			point.r.moveTo(localX,localY)
		}
		//return point;
	}
}
function onMouseUp(evt){
	if(mode===s_selecting){
		pickPoint( getPoint(evt));
		redraw(true);
	}else if(mode === s_moving){
		console.log(this+" is in mode === s_moving");
		//redraw(true);
	}
}

function onMouseMove(evt){
	if(mode === s_selecting){
		if (pickedPoints.length === 0 ){
			//pickPoint(getPoint(evt));
			pickedPoints.push(getPoint(evt));
			//alert("pickedPoints[0].moveTo = "+pickedPoints[0].moveTo);
		}else{
			let mousePoint = pickedPoints[pickedPoints.length-1];
			getPoint(evt,mousePoint);
		}
		redraw(true);
	}else if (mode === s_moving){
		//console.log(this+" is in mode === s_moving");
	}
}

function redraw(redrawBezier){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#0000FF";
	let ultimo = pickedPoints.length-1;
	let next = pickedPoints[ultimo];

	//Draw Bezier
	if (mode===s_selecting){
		if(pickedPoints.length>2&& redrawBezier){
			for(let i=0;i<pickedPoints.length-2;i++){//ignora o ponto do mouse
				drawBezierBetween(pickedPoints[i],pickedPoints[i+1]);
			}
		}
	}
	if (mode===s_moving){
		if(pickedPoints.length>2&& redrawBezier){
			for(let i=0;i<pickedPoints.length-1;i++){//ignora o ponto do mouse
				drawBezierBetween(pickedPoints[i],pickedPoints[i+1]);
			}
		}
	}
	//Draw Linha
	if(pickedPoints.length>1&&mode===s_selecting){
		let penultimo = pickedPoints.length-2;
		let pick = pickedPoints[penultimo];
		drawLine(pick,next);
	}

	//Draw Pontos
	let qtdPoints = pickedPoints.length;
	if (mode!==s_selecting&&qtdPoints>0){
		qtdPoints--;
	}
	for (let i=0;i<qtdPoints;i++){
		if(pickedPoints[i].r){
			drawLine(pickedPoints[i],pickedPoints[i].r,2,"#FFFF00");
			drawPoint(pickedPoints[i].r,handlePointRadius,"#00FF00");
			drawPoint(pickedPoints[i].r,handlePointRadius-1.5,"#444444");
			
		}
		if(pickedPoints[i].l){
			drawLine(pickedPoints[i],pickedPoints[i].l,2,"#FFFF00");
			drawPoint(pickedPoints[i].l,handlePointRadius,"#00FF00");
			drawPoint(pickedPoints[i].l,handlePointRadius-1.5,"#444444");
		}
		drawPoint(pickedPoints[i],linePointRadius,"#FFFFFF");
		drawPoint(pickedPoints[i],linePointRadius-0.5,"#1111FF");
	}

}

function drawBezierBetween(p0,p1){
	let P = constructP(p0,p0.r,p1.l,p1);
	let dt = 1/resolution;
	for(let t=0;t<=1;t+=dt){
		drawLine(P(t),P(t+dt));
	}
}

function drawLine(start,end,width,color){
	let cor = color;
	if(!cor){
		cor = "#FF0000";
	}
	let largura = width;
	if(!largura){
		largura = 3;
	}
	ctx.strokeStyle = cor;
	ctx.lineWidth = largura;
	ctx.lineJoin  = "round";
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}
function drawPoint(point,radius,color){
	ctx.beginPath();
	let rad = radius;
	let cor = color;
	if(!cor){
		cor = "#0000FF";
	}
	if(!rad){
		rad = 6;
	}
	ctx.fillStyle = cor;
	ctx.arc(point.x,point.y,rad,0,Math.PI*2,true);
	ctx.fill();
}



//Points+++++++++++++++++++++++++++++++++++++++++++++++++++++

//protótipos
var prot_Point = {
	x:100,
	y:100,
	distanceTo : function(pt){
		return Math.sqrt(Math.pow(pt.x-this.x,2)+Math.pow(pt.y-this.y,2));
	},
	slopeTo : function(pt){
		return ((pt.y-this.y)/(pt.x-this.x));
	},
	moveTo:function(x,y){
		this.x = x;
		this.y = y;
	},
	moveBy:function(dx,dy){
		this.x+=dx;
		this.y+=dy;
	}
};

var prot_fullPoint = {
	x:prot_Point.x,
	y:prot_Point.y,
	distanceTo:prot_Point.distanceTo,
	slopeTo:prot_Point.slopeTo,
	moveTo:prot_Point.moveTo,
	moveBy:prot_Point.moveBy,
	l: new class_Point(this.x,this.y),
	r: new class_Point(this.x,this.y),
	interpolateTo:function (pt){
		//alert("interpolateTo");

		/*
		fonte : http://webserver2.tecgraf.puc-rio.br/~mgattass/cg/2018/03_Bezier.pdf
		página 26
		*/
		this.r.moveBy(1/3*(pt.x-this.x),1/3*(pt.y-this.y));
		pt.l.moveBy(-1/3*(pt.x-this.x),-1/3*(pt.y-this.y));
	},
	interpolateBetween:function(p1,p2){

		/*
		fonte : http://webserver2.tecgraf.puc-rio.br/~mgattass/cg/2018/03_Bezier.pdf
		página 27
		*/
		let p0 = this;
		let ro = calcRo(p0,p1,p2);
		let matrix = [
			[2,-1,0,0],
			[0,1-ro,ro,0],
			[1,-2,2,-1],
			[0,0,-1,2]
		];
		let solX,solY;
		//Resolve componente x
		solX = solve(matrix,[p0.x,p1.x,0,p2.x]);
		//solX => [r0.x,l1.x,r1.x,l2.x]
		

		//resolve componente y
		solY = solve(matrix,[p0.y,p1.y,0,p2.y]);
		//solY => [r0.y,l1.y,r1.y,l2.y]

		p0.r.moveTo(solX[0],solY[0]);
		p1.l.moveTo(solX[1],solY[1]);
		p1.r.moveTo(solX[2],solY[2]);
		p2.l.moveTo(solX[3],solY[3]);

	},
	interpolateNew:function(lastP,nextP){
		/*
		fonte : http://webserver2.tecgraf.puc-rio.br/~mgattass/cg/2018/03_Bezier.pdf
		página 28
		*/
		let thisP = this;
		let ro = calcRo(lastP,thisP,nextP);
		let matrix = [
			[1-ro,ro,0],
			[-2,2,-1],
			[0,-1,2]
		];
		let solX,solY;
		//Resolve componente x
		solX = solve(matrix,[thisP.x,-(lastP.r.x),nextP.x]);
		//solX => [thisP.l.x,thisP.r.x,nextP.l.x]
		

		//resolve componente y
		solY = solve(matrix,[thisP.y,-(lastP.r.y),nextP.y]);
		//solY => [thisP.l.y,thisP.r.y,nextP.l.y]

		thisP.l.moveTo(solX[0],solY[0]);
		thisP.r.moveTo(solX[1],solY[1]);
		nextP.l.moveTo(solX[2],solY[2]);
	}
};

function class_Point(x,y){
	this.x = x;
	this.y = y;
}
class_Point.prototype = prot_Point;

function class_fullPoint(x,y){
	//alert("called class_fullPoint");
	this.x = x;
	this.y = y;
	this.l = new class_Point(x,y);
	this.r = new class_Point(x,y);
}
class_fullPoint.prototype = prot_fullPoint;

function calcRo(p0,p1,p2){
	return p0.distanceTo(p1)/sumDistances(p0,p1,p2);
}
function sumDistances(p0,p1,p2){
	return p0.distanceTo(p1)+p1.distanceTo(p2);
}
//------------------------------------------------------------


function equation(p0,p1,p2,p3,t){
	return Math.pow(1-t,3)*p0 + 3*t*Math.pow(1-t,2)*p1 + 3*(1-t)*Math.pow(t,2)*p2 + Math.pow(t,3)*p3;
};

//construtor da função P(t) que retorna o ponto na curva de beziér cúbica
function constructP(v0,v1,v2,v3){
	return function(t){
		return new class_Point(
			equation(v0.x,v1.x,v2.x,v3.x,t),
			equation(v0.y,v1.y,v2.y,v3.y,t)
			);
	};
}

function findCollidedPoint(mousePoint){
}
function checkCollision(p0,p1,radius1){
	return p0.distanceTo(p1)<=radius1;
}