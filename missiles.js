
function missiles()
{
	this.missileX = new Array();
	this.missileY = new Array();
	this.missileLauchTime = new Array();
	this.missileSpeed = new Array();
	this.missileType = new Array();
	this.missileHitPoints = new Array();
	this.missileActif = new Array();
	this.nbrMissile = 0;
}

missiles.prototype.ajout = function (x, y, s, t, h) {

	m=1;
	
	while (m<=this.nbrMissile && this.missileY[m]>0 && this.missileY[m]<canvasMaxY)
		m++;
	
	if (m>this.nbrMissile)
		this.nbrMissile++;
	
	this.missileX[m] = x;
	this.missileY[m] = y;
	this.missileSpeed[m] = s;
	this.missileType[m] = t;
	this.missileHitPoints[m] = h;
	this.missileLauchTime[m] = new Date();
	this.missileActif[m] = true;
	return m;
}

missiles.prototype.getPic = function (t, alt) {

	if (alt) 
			return pic.getByNbr(26+t*2); // missiles ufos alt pic
	else {		
		if (t<100)
			return pic.getByNbr(25+t*2); // missiles ufos
		else
			//hero
			return pic.getByNbr(t);
	}
}

missiles.prototype.retirer = function (m) {
	this.missileActif[m] = false;
}

// pour les missiles du héros
missiles.prototype.montee = function () {
		
	for (var m=1; m<=this.nbrMissile; m++) {
		if (this.missileActif[m])  {
			this.missileY[m] -= this.missileSpeed[m];

			 //heatseeker - targeting nearest ennemy
			if (this.missileType[m]==106) {
				u = ufo.closestUfo(this.missileX[m], this.missileY[m]);
				
				if (u != -1) {
					this.missileX[m] += Math.max(Math.min(((ufo.x(u)+ufo.largeur(u)/2) - this.missileX[m]+30)*0.2, 15), -15);
					ufo.drawLock(u);
				}
			}
			if(this.missileY[m]< -this.hauteurPNG(this.missileType[m]))
				this.retirer(m);
		}
	}
}

// pour les bombes des ufos
missiles.prototype.descente = function () {
		
	for (var m=1; m<=this.nbrMissile; m++) {
		if (this.missileActif[m]) {
			this.missileY[m] += this.missileSpeed[m];
		}
	}	
}

missiles.prototype.largeurPNG = function (m) {
	
	//carrot
	if (m==0) return 30;
	//ufos
	if (m==1) return 70;
	if (m==2) return 50;
	if (m==3) return 49;
	if (m==4) return 50;
	if (m==5) return 54;
	if (m==6) return 50;
	if (m==7) return 41;
	if (m==8) return 41;
	if (m==9) return 50;
	 // first boss weapon
	if (m==11) return 75;
	if (m==12) return 75;
	if (m==13) return 60;
	if (m==14) return 86;
	if (m==15) return 90;
	if (m==16) return 100;
	if (m==17) return 118;
	if (m==18) return 150;
	if (m==19) return 120;
	if (m==21) return 150;
	if (m==22) return 130;
	if (m==23) return 130;
	if (m==24) return 97;
	if (m==26) return 120;
	if (m==27) return 20;
	if (m==28) return 160;
	if (m==29) return 164;
	 // héros
	if (m==101 || m==111 || m==112 || m==113) // base weapons
		return 11;
	if (m==102) // laser héros
		return 20;
	if (m==103) // megabomb
		return 40;
	if (m==104) // blue atomic bomb
		return 420;
	if (m==106) // heatseeker missile
		return 50;
	if (m==107) // wave
		return 522;
}
missiles.prototype.hauteurPNG = function (m) {
	
	//carrot
	if (m==0) return 60;
	//ufos
	if (m==1) return 50;
	if (m==2) return 70;
	if (m==3) return 51;
	if (m==4) return 33;
	if (m==5) return 42;
	if (m==6) return 50;
	if (m==7) return 84;
	if (m==8) return 32;
	if (m==9) return 50;
	 // first boss weapon
	if (m==11) return 80;
	if (m==12) return 89;
	if (m==13) return 90;
	if (m==14) return 108;
	if (m==15) return 98;
	if (m==16) return 103;
	if (m==17) return 269;
	if (m==18) return 150;
	if (m==19) return 120;
	if (m==21) return 150;
	if (m==22) return 130;
	if (m==23) return 160;
	if (m==24) return 166;
	if (m==26) return 120;
	if (m==27) return 250;
	if (m==28) return 160;
	if (m==29) return 205;

	if (m==101 || m==111 || m==112 || m==113)  // hero base weapons
		return 26;
	if (m==102) // laser héros
		return 850;
	if (m==103) // megabomb
		return 84;
	if (m==104) // blue atomic bomb
		return 440;
	if (m==106) // heatseeker missile
		return 50;
	if (m==107) // wave
		return 483;
}


missiles.prototype.collision = function (m, objectMinX, objectMinY, objectMaxX, objectMaxY) {
	
	var missileMinX = this.missileX[m];
	var missileMinY = this.missileY[m];
	var missileMaxX = this.missileX[m]+this.largeurPNG(this.missileType[m]);
	var missileMaxY = this.missileY[m]+this.hauteurPNG(this.missileType[m]);

	//wave cone
	if (this.missileType[m]==107) {
		var factor = (1-mis.y(m)/fuseeY);
		missileMinX = this.missileX[m] - parseInt(factor * this.largeurPNG(107)/2);
		missileMaxX = this.missileX[m] + parseInt(factor * this.largeurPNG(107)/2);
		missileMaxY = this.missileY[m] + factor* this.hauteurPNG(107);
	}
		
	//if (RectA.Left < RectB.Right && RectA.Right > RectB.Left &&  RectA.Top < RectB.Bottom && RectA.Bottom > RectB.Top ) 
	if (missileMinX < objectMaxX && missileMaxX > objectMinX &&  missileMinY < objectMaxY && missileMaxY > objectMinY) 
		return true;
	else
		return false;
}

missiles.prototype.x = function (m) {
	return this.missileX[m];
}

missiles.prototype.y = function (m) {
	return this.missileY[m];
}

missiles.prototype.speed = function (m) {
	return this.missileSpeed[m];
}

missiles.prototype.hitPoints = function (m) {
	return this.missileHitPoints[m];
}

missiles.prototype.puissance = function (m) {
	if (this.missileType[m]==0)
		return -1; // yabon carottes
	if (this.missileType[m]>=1 && this.missileType[m]<10)
		return this.missileType[m] + 2; // ufos
	if (this.missileType[m]>10 && this.missileType[m]<100) //bosses
		return 10+level;
	if (this.missileType[m]==101) //rainbow
		return 3;
	if (this.missileType[m]==102) // laser, multi-hits
		return 0.5;
	if (this.missileType[m]==103) // traité après avec detonation()
		return 0;
	if (this.missileType[m]==104)// bombe atomique, multi-hits
		return 1; 
	if (this.missileType[m]==106) // heatseeker
		return 8;
	if (this.missileType[m]==107)  // wave, multi-hits
		return 0.4; 
	if (this.missileType[m]==111)
		return 1; // base missile for swallow
	if (this.missileType[m]==112)
		return 1.3; // base missile for albatross
	if (this.missileType[m]==113)
		return 1.6; // base missile for falcon
}

missiles.prototype.hit = function (m) {
	this.missileHitPoints--;
}

missiles.prototype.type = function (m) {
	return this.missileType[m];
}

missiles.prototype.actif = function (m) {
	return this.missileActif[m];
}

missiles.prototype.lauchTime = function (m) {
	return this.missileLauchTime[m];
}

missiles.prototype.nbr = function () {
	return this.nbrMissile;
}
missiles.prototype.dommageDeZone = function (m) {
	return this.missileType[m]==102 || this.missileType[m]==104 || this.missileType[m]==107;
}

