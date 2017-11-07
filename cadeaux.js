
function cadeaux()
{
	this.cadX = new Array();
	this.cadY = new Array();
	this.cadSpeed = new Array();
	this.cadType = new Array();
	this.nbrCadeaux = 0;
}

cadeaux.prototype.ajout = function (min, max) {

	if (!min)
		min = 1;
	if (!max)
		max = 15;
	c=1;
	
	while (c<=this.nbrCadeaux && this.cadX[c]>0)
		c++;
	
	if (c>this.nbrCadeaux)
		this.nbrCadeaux++;
	
	this.cadX[c] = Math.ceil(Math.random() * (canvasMaxX - 100));
	this.cadY[c] = -80;
	this.cadSpeed[c] = 5;
	this.cadType[c] = min + Math.round(Math.random() * (max+0.499-min));
}

cadeaux.prototype.getPic = function (c) {

	if (cad.cadType[c]<=3)  // life, 3x plus de chance d'en avoir
		return pic.getByNbr(9);
	if (cad.cadType[c]==4) // speed
		return pic.getByNbr(19);
	if (cad.cadType[c]==5) // gun arc en ciel
		return pic.getByNbr(11);
	if (cad.cadType[c]==6) // laser
		return pic.getByNbr(12);
	if (cad.cadType[c]==7) //megabomb
		return pic.getByNbr(13);
	if (cad.cadType[c]==8) // blue atomic 
		return pic.getByNbr(14);
	if (cad.cadType[c]==9) //shield 
		return pic.getByNbr(10);
	if (cad.cadType[c]==10) // nuke all ufos
		return pic.getByNbr(17);
	if (cad.cadType[c]==11) // heatseeker
		return pic.getByNbr(20);
	if (cad.cadType[c]==12) // wave
		return pic.getByNbr(21);
	if (cad.cadType[c]==13) // slow down ufos
		return pic.getByNbr(15);
	if (cad.cadType[c]==14) // carrots
		return pic.getByNbr(16);
	if (cad.cadType[c]==15) // ice
		return pic.getByNbr(18);
}

cadeaux.prototype.descente = function () {
	
	for (var c=1; c<=this.nbrCadeaux; c++) {
		if (this.cadX[c] > 0) {
			this.cadY[c] += this.cadSpeed[c];
		
			if (this.cadY[c] > canvasMaxY) 
				this.cadX[c] = 0;
		}
	}
}

cadeaux.prototype.x = function (c) {
	return this.cadX[c];
}

cadeaux.prototype.effacer = function (c) {
	this.cadX[c] = 0;
}
cadeaux.prototype.y = function (c) {
	return this.cadY[c];
}

cadeaux.prototype.speed = function (c) {
	return this.cadSpeed[c];
}

cadeaux.prototype.type = function (c) {
	return this.cadType[c];
}

cadeaux.prototype.actif = function (c) {
	return (this.cadX[c]>0);
}

cadeaux.prototype.nbr = function () {
	return this.nbrCadeaux;
}