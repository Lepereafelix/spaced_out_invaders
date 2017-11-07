
function etoiles()
{
	this.etoileX = new Array();
	this.etoileY = new Array();
	this.etoileSpeed = new Array();
	this.etoileRGB = new Array();
	this.nbrEtoiles = 0;
}

etoiles.prototype.ajoutN = function (nbrNew) {

	for (var e=1; e<=nbrNew; e++) {
		this.nbrEtoiles++;
		this.ajout(this.nbrEtoiles);
	}
}

etoiles.prototype.ajout = function (e) {
	
	this.etoileX[e] =  parseInt(Math.random() * canvasMaxX);
	this.etoileY[e] = 1;
	this.etoileRGB[e] = (parseInt(Math.random() * 100) + 100).toString(16);
	this.etoileSpeed[e] = parseInt(Math.random() * 12) +1;
	
}
etoiles.prototype.retirer = function (e) {
	this.etoileY[e] = 0;
}

etoiles.prototype.affichage = function () {

	for (var e=1; e<=etl.nbr(); e++) {
		if (etl.y(e) > 0) {
			ctx.fillStyle = "#" + etl.rgb(e) + etl.rgb(e) + etl.rgb(e);
			ctx.fillRect(etl.x(e), etl.y(e), 1, 1);
		}
	}
}

etoiles.prototype.descente = function () {
		
	for (var e=1; e<=this.nbrEtoiles; e++) {
		if (this.etoileY[e] > 0) {
			this.etoileY[e] += this.etoileSpeed[e];
			
			if (this.etoileY[e] > canvasMaxY)
				this.ajout(e);
		}	
	}	
}

etoiles.prototype.x = function (e) {
	return this.etoileX[e];
}

etoiles.prototype.y = function (e) {
	return this.etoileY[e];
}

etoiles.prototype.rgb = function (e) {
	return this.etoileRGB[e];
}

etoiles.prototype.speed = function (e) {
	return this.etoileSpeed[e];
}

etoiles.prototype.nbr = function () {
	return this.nbrEtoiles;
}
