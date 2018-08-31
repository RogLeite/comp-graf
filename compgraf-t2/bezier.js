var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pickedPoints = [];
function getPoint(evt){
	let ret = canvas.getBoundingClientRect();
	return {
		x: evt.clientX-ret.x,
		y: evt.clientY-ret.y
	};
}
function onMouseUp(evt){
	pickedPoints.push( getPoint(evt));
	redraw();
}

function onMouseMove(evt){
	if (pickedPoints.length === 0 ){
		pickedPoints.push(getPoint(evt));
	}
	pickedPoints[pickedPoints.length-1] = getPoint(evt);
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