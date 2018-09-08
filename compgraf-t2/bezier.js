var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pickedPoints = [];




function pickPoint(point){
	if(pickedPoints.length===1){
		pickedPoints[0].interpolateTo(point);
	}else if(pickedPoints.length===2){
		pickedPoints[0].interpolateBetween(pickedPoints[1],point);
	}else if(pickedPoints.length>2){
		pickedPoints[pickedPoints.length-1].interpolateNew(point);
	}
	pickedPoints.push(point);
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
		pickPoint(getPoint(evt));
	}else{
		pickedPoints[pickedPoints.length-1] = getPoint(evt);
	}
    redraw();
}

function redraw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#0000FF";
	for(let i=0;i<pickedPoints.length;i++){
		let pick = pickedPoints[i];
		let next = pickedPoints[i+1];
		if(next){
			drawLine(pick,next);
		}
		drawPoint(pick);
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
function drawPoint(point){
	ctx.beginPath();
	ctx.arc(point.x,point.y,6,0,Math.PI*2,true);
	ctx.fill();
}



function calcSlope(p1,p2){
	return ((p2.y-p1.y)/(p2.x-p1.x));
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
		return calcSlope(this,pt);
	},
	moveTo: function(x,y){
		this.x = x;
		this.y = y;
	}
};

var prot_fullPoint = {
	x:prot_Point.x,
	y:prot_Point.y,
	distanceTo:prot_Point.distanceTo,
	slopeTo:prot_Point.slopeTo,
	moveTo:prot_Point.moveTo,
	l: new class_Point(this.x,this.y),
	r: new class_Point(this.x,this.y),
	interpolateTo:function (pt){
		this.r.moveTo(1/3*(pt.x-this.x),1/3*(pt.y-this.y));
		pt.l.moveTo(2/3*(pt.x-this.x),2/3*(pt.y-this.y));
	},
	interpolateBetween:function(pt1,pt2){
		
	},
	interpolateNew:function(pt){

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
}
class_fullPoint.prototype = prot_fullPoint;

//------------------------------------------------------------