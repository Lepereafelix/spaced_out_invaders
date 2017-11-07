
function asteroids()
{
    this.astX = new Array();
    this.astY = new Array();
    this.astSpeed = new Array();
    this.astType = new Array();
    this.astHitPoints = new Array();
	this.nbrAst = 0;
	this.nbrAstPics = 9;
}

asteroids.prototype.ajoutN = function (nbrNewAst) {

	for (var a=1; a<=nbrNewAst; a++) {
		this.nbrAst++;
		this.recycler(this.nbrAst);
	}	
}

asteroids.prototype.remiser = function (a) {
	this.astX[a] = 0;
}

asteroids.prototype.recycler = function (a) {

	var chrono = new Date();
	var demonSpeed = asteroidOnly(level) && (chrono- timeStartLevel > 1000); // 1 seconde d'acoutumance avant accelération
	
	if (!missionAccomplie())  {
		this.astX[a] = 1+Math.floor(Math.random() * (canvasMaxX - astLargeur));
		this.astY[a] = -astHauteur;
		this.astSpeed[a] = parseInt(Math.random() * (demonSpeed ? 16 : 5)) + Math.floor(level/3) +2;

		this.astType[a] = parseInt(Math.random() * this.nbrAstPics) +1;
		this.astHitPoints[a] =  (demonSpeed ? 5 : 3) ;
	}
	else {
		this.remiser(a); 
	}
}

asteroids.prototype.getPic = function (a) {
	//starting at pic #151
		return pic.getByNbr(150+this.astType[a]); 
}

asteroids.prototype.descente = function () {
	
	for (var a=1; a<=this.nbrAst; a++) {
		if (this.astX[a] > 0) {
			this.astY[a] += this.astSpeed[a];
			
			if (this.astY[a] > canvasMaxY)  {
				this.recycler(a); 
			}
		}
	}	
}

asteroids.prototype.collisionVaisseau = function (rocketX) {	
	
	for (var a=1; a<=this.nbrAst; a++) {
		if (this.x(a) > rocketX -100 && this.x(a) < rocketX +60 && this.y(a) > canvasMaxY - 270)
			return true;
	}
	
	return false;
}

asteroids.prototype.x = function (a) {	
	return this.astX[a];
}

asteroids.prototype.y = function (a) {	
	return this.astY[a];
}

asteroids.prototype.speed = function (a) {	
	return this.astSpeed[a];
}

asteroids.prototype.type = function (a) {	
	return this.astType[a];
}

asteroids.prototype.actif = function (a) {	
	return (this.astX[a]>0);
}

asteroids.prototype.hitPoints = function (a) {	
	return this.astHitPoints[a];
}

asteroids.prototype.nbr = function () {	
	return this.nbrAst;
}