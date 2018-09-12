var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pickedPoints = [];
var linear = require("../linear-solve/gauss-jordan.js");



function pickPoint(point){
	let mouse;
	//retira ponto do mouse
	if(pickedPoints.length!==0){
		mouse = pickedPoints.pop();
	}

	if(pickedPoints.length===1){
		alert("pickedPoints[0]  = "+pickedPoints[0]);
		pickedPoints[0].interpolateTo(point);
	}else if(pickedPoints.length===2){
		pickedPoints[0].interpolateBetween(pickedPoints[1],point);
	}/*else if(pickedPoints.length>2){
		pickedPoints[pickedPoints.length-1].interpolateNew(point);
	}*/
	//só para ver se estão sendo desenhados+++
	/*
	point.l.moveBy(-3,0);
	point.r.moveBy(3,0);
	*/
	//-----------------------------------------
	pickedPoints.push(point);

	//devolve ponto do mouse
	if(pickedPoints.length!==0){
		pickedPoints.push(mouse);
	}
}

function getPoint(evt){
	let ret = canvas.getBoundingClientRect();
	return new class_fullPoint(evt.clientX-ret.x,evt.clientY-ret.y);
}
function onMouseUp(evt){
	pickPoint( getPoint(evt));
	redraw();
}

function onMouseMove(evt){
	if (pickedPoints.length === 0 ){
		//pickPoint(getPoint(evt));
		pickedPoints.push(getPoint(evt));
	}else{
		pickedPoints[pickedPoints.length-1] = getPoint(evt);
	}
    redraw();
}

function redraw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#0000FF";
	let ultimo = pickedPoints.length-1;
	let next = pickedPoints[ultimo];

	if(pickedPoints.length>1){
		let penultimo = pickedPoints.length-2;
		let pick = pickedPoints[penultimo];
		drawLine(pick,next);
	}
	for (let i=0;i<pickedPoints.length;i++){
		drawPoint(pickedPoints[i]);
		if(pickedPoints[i].r){
			drawPoint(pickedPoints[i].r,2,"#00FF00");
		}
		if(pickedPoints[i].l){
			drawPoint(pickedPoints[i].l,2,"#00FF00");
		}
	}

}

function drawLine(start,end){
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 2;
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
		return Math.sqrt(Math.pow(pt.x-thix.x,2)+Math.pow(pt.y-this.y,2));
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
	interpolateBetween:function(pt1,pt2){

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
		solX = linear.solve(matrix,[p0.x,p1.x,0,p2.x]);
		//solX => [r0.x,l1.x,r1.x,l2.x]
		

		//resolve componente y
		solY = linear.solve(matrix,[p0.y,p1.y,0,p2.y]);
		//solY => [r0.y,l1.y,r1.y,l2.y]

		p0.r.moveTo(solX[0],solY[0]);
		p1.l.moveTo(solX[1],solY[1]);
		p1.r.moveTo(solX[2],solY[2]);
		p2.l.moveTo(solX[3],solY[3]);

	},
	interpolateNew:function(pt){
		/*
		fonte : http://webserver2.tecgraf.puc-rio.br/~mgattass/cg/2018/03_Bezier.pdf
		página 28
		*/
	}
};

function class_Point(x,y){
	this.x = x;
	this.y = y;
}
class_Point.prototype = prot_Point;

function class_fullPoint(x,y){
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