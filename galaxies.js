
function galaxies()
{
	this.x = 0;
	this.y = 0;
	this.type = 1;
	this.speed = 1;
	this.nbrGalaxies = 10;
}

galaxies.prototype.init = function () {
	
	this.x = parseInt(Math.random() * (canvasMaxX-800));
	this.y = -500;
	this.type = Math.ceil(Math.random() * this.nbrGalaxies);
}

galaxies.prototype.affichage = function () {
	
	if (this.y < canvasMaxY) 
		ctx.drawImage(this.getPic(), this.x, this.y);
}

galaxies.prototype.descente = function () {
	
	this.y += this.speed;
	
	if (this.y > canvasMaxY) 
		this.init();
}

galaxies.prototype.getPic = function () {
	//starting at pic #280
	return pic.getByNbr(280 + this.type);
}
