
function explosions()
{
	this.expX = new Array();
	this.expY = new Array();
	this.expType = new Array();
	this.expDelay = new Array();
	this.expFramesBeforeEnd = new Array();
	this.nbrExplosions = 0;
}

explosions.prototype.ajout = function (x, y, type, delay) {

	var e=1;
	
	while (e<=this.nbrExplosions && this.expFramesBeforeEnd[e]>0)
		e++;
	
	if (e>this.nbrExplosions)
		this.nbrExplosions++;
	
	this.expX[e] = x;
	this.expY[e] = y;
	this.expType[e] = type;
	this.expDelay[e] = delay;
	
	// petite explosion
	if (type==0) 
		this.expFramesBeforeEnd[e] = 15;
	else 
		this.expFramesBeforeEnd[e] = 30;
	
}
explosions.prototype.getPic = function (e) {
	
	var firstPic;
	
	if (this.expType[e]==0)
		return pic.getByNbr(120);
	
	else if (this.expType[e]<=12)
		firstPic = 120+2*this.expType[e];
	
	if (this.expType[e]>=0  && firstPic>0) {
		if (this.expFramesBeforeEnd[e] <10 || this.expFramesBeforeEnd[e]>20) 
			return pic.getByNbr(firstPic);
		else 
			return pic.getByNbr(firstPic+1);
	}
	
	//radioactive sign
	if (this.expType[e]==24) {
		if (this.expFramesBeforeEnd[e] %15 <8) // flashing
			return pic.getByNbr(5);
		else 
			return pic.getByNbr(6);
	}
	
	// blue atomic mushroom
	if (this.expType[e]==25) {
		if (this.expFramesBeforeEnd[e]>10)
			return pic.getByNbr(104);
		else 
			return pic.getByNbr(105);
	}
	
	alert("prob explosion #" + this.expType[e]);
}

explosions.prototype.x = function (e) {
	return this.expX[e];
}

explosions.prototype.y = function (e) {
	return this.expY[e];
}

explosions.prototype.type = function (e) {
	return this.expType[e];
}

explosions.prototype.delay = function (e) {
	return this.expDelay[e];
}

explosions.prototype.framesBeforeEnd = function (e) {
	return this.expFramesBeforeEnd[e];
}

explosions.prototype.countdownToFade = function (e) {
	this.expFramesBeforeEnd[e]--;
}

explosions.prototype.nbr = function () {
	return this.nbrExplosions;
}