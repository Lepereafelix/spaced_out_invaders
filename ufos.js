
function ufos()
{
	this.ufoX = new Array();
	this.ufoY = new Array();
	this.ufoXSpeed = new Array();
	this.ufoYSpeed = new Array();
	this.ufoType = new Array();
	this.ufoHitPoints = new Array();
	this.ufoLastBombTime = new Array();
	this.ufoFiresCarrots = new Array();
	this.ufoFrozen = new Array();
	this.ufoDirectionX = new Array(); //-1 ; 0 ; +1
	this.nbrUfo = 0;
}

ufos.prototype.ajoutN = function (nbrNewufo, maxType) {

	for (var u=1; u<=nbrNewufo; u++) {
		this.nbrUfo++;
		this.remplacer(this.nbrUfo);
	}
}

ufos.prototype.largeur = function (u) {

	if (this.ufoType[u] <10)
		return 100;
	else
		return 235;
}


ufos.prototype.hauteur = function (u) {

	if (this.ufoType[u] <10)
		return 90;
	else
		return 188;
}

ufos.prototype.bombsRate = function (u) {

	if (this.ufoType[u] <10)
		return 0.02;
	else
		return 0.1;
}

ufos.prototype.killed = function (u) {
	score +=1000 * this.ufoType[u];
	nbrUfosLeft--;
	nbrUfoKilled++;

	playSound(sndUfoDead);

	if (ufo.frozen(u)) {
		expl.ajout(this.ufoX[u]-50, this.ufoY[u]-50, 11);
	}
	else {		
			if (this.ufoType[u]<10)				
				expl.ajout(this.ufoX[u]-50,this.ufoY[u]-50, this.ufoType[u]); 			
			else {
				bossIsDead = true;
				playSound(sndBossDead);
				
				for(var i=0; i<40; i++) 
					expl.ajout(this.ufoX[u]-100+Math.random()*200, this.ufoY[u]-80+Math.random()*160, 7, i*4);
			}
	}
	
	if (!bossArea)
		this.remplacer(u);
	else
		this.remiser(u);
}

ufos.prototype.remplacer = function (u) {
	
	if (nbrUfosLeft<=1 && !bossArea) {
		bossArea= true;
		this.ufoType[u] = 11 + (level-1)%nbrBossesDifferents;
		bossUfoNr = u;
		
		playSound(sndIncomingBoss);
	}
	else
		this.ufoType[u] = Math.ceil(Math.random() * monsterLevelMax());
	
	this.ufoX[u] = Math.ceil(Math.random() * (canvasMaxX-100));
	this.ufoY[u] = -this.hauteur(u);
	this.ufoDirectionX[u] = 1 - Math.floor(Math.random() * 3);
	this.ufoFrozen[u] = false;
	this.ufoFiresCarrots[u] = false;
	this.ufoLastBombTime[u] = new Date();
	
	if (this.ufoType[u]<10) {
		// regular ufos
		this.ufoHitPoints[u] = this.ufoType[u]+2;
		this.ufoXSpeed[u] = 3+Math.round(this.ufoType[u]/3);
		this.ufoYSpeed[u] = 2+Math.round((this.ufoType[u])/4);
	}
	else
	{
		// bosses
		this.ufoXSpeed[u] = 5 + Math.floor(level / 3);
		this.ufoYSpeed[u] = 3  + Math.floor(level / 4);
		this.ufoHitPoints[u] = this.bossHitPoints() ;
	}
}

ufos.prototype.bossHitPoints = function () {
	return 45 + 5*level;
}
ufos.prototype.ballade = function () {
	
	for (var u=1; u<=this.nbrUfo; u++) {
		if (this.ufoHitPoints[u] > 0) {
			this.ufoX[u] += this.ufoDirectionX[u] * this.ufoXSpeed[u];
			
			if (this.ufoX[u] < 1)
				this.ufoX[u] = 1;
			if (this.ufoX[u] > canvasMaxX - this.largeur(u))
				this.ufoX[u] = canvasMaxX - this.largeur(u);
			
			this.ufoY[u] += this.ufoYSpeed[u];
			
			if (this.ufoY[u] > canvasMaxY) {
				if (nbrUfosLeft > 0 && !bossArea)
					//nouveau ufo 
					this.remplacer(u);
				else
					this.remiser(u);
			}
			
			// changement de direction X
			if (Math.floor(Math.random() * 50)==1) 
				this.ufoDirectionX[u] = 1 - Math.floor(Math.random() * 3);

			// changement de direction pour bosses
			if (this.ufoType[u]>10) {				
				if (this.ufoX[u] <=1)
					 this.ufoDirectionX[u] = 1;
				if (this.ufoX[u] >= canvasMaxX - this.largeur(u))
					 this.ufoDirectionX[u] = -1;
				if (this.ufoY[u] <=1)
					this.ufoYSpeed[u] = Math.abs(this.ufoYSpeed[u]);
				if (this.ufoY[u] >=500)
					this.ufoYSpeed[u] = -Math.abs(this.ufoYSpeed[u]);
			}
		}
	}	
}

ufos.prototype.firesCarrots = function (u) {
	this.ufoFiresCarrots[u] = true;
}

ufos.prototype.bombType = function (u) {
	
	if (this.ufoFiresCarrots[u]) 
		return 0;
	else {
		if (this.ufoType[u]<10)
			return this.ufoType[u];
		else
			//boss
			return level+10;
	}
}

ufos.prototype.remiser = function (u) {
	this.ufoHitPoints[u]=0;	
}
ufos.prototype.x = function (u) {
	return this.ufoX[u];
}
ufos.prototype.y = function (u) {
	return this.ufoY[u];
}
ufos.prototype.xSpeed = function (u) {
	return this.ufoXSpeed[u];
}
ufos.prototype.ySpeed = function (u) {
	return this.ufoYSpeed[u];
}
ufos.prototype.type = function (u) {
	return this.ufoType[u];
}
ufos.prototype.hitPoints = function (u) {
	return this.ufoHitPoints[u];
}
ufos.prototype.actif = function (u) {
	return (this.ufoHitPoints[u]>0);
}
ufos.prototype.frozen = function (u) {	
	return this.ufoFrozen[u];
}
ufos.prototype.freeze= function (u) {
	this.ufoFrozen[u] = true;
	this.ufoHitPoints[u] = 1;
}
ufos.prototype.lastBombTime = function (u) {
	return this.ufoLastBombTime[u];
}
ufos.prototype.nbr = function () {
	return this.nbrUfo;
}

ufos.prototype.getPic = function(u) {
	
	var rightPicVersion;
	rightPicVersion = this.ufoX[u] < fuseeX ? 1 : 0;
		
	if (this.ufoFiresCarrots[u]) {
		return pic.getByNbr(170); // lapin
	}
	else {
		// starting at pic #171		
		if (this.ufoType[u]<10)
			return pic.getByNbr(169 + (this.ufoType[u]*2) + rightPicVersion);
		else
			return pic.getByNbr(this.ufoBossPicNr(level) + rightPicVersion); //boss
	}
}

ufos.prototype.ufoBossPicNr = function(level) {
	// only 10 bosses
	return 189 + (level%10) *2;
}

ufos.prototype.drawLock = function(u) {
	ctx.drawImage(pic.getByNbr(90), this.ufoX[u]-3, this.ufoY[u]-3);
	ctx.drawImage(pic.getByNbr(91), this.ufoX[u]+this.largeur(u)-17, this.ufoY[u]-3);
	ctx.drawImage(pic.getByNbr(92), this.ufoX[u]-3, this.ufoY[u]+this.hauteur(u)-17);
	ctx.drawImage(pic.getByNbr(93), this.ufoX[u]+this.largeur(u)-17, this.ufoY[u]+this.hauteur(u)-17);
}

ufos.prototype.bossName = function(n) {
	
	if 		 (n==1)  return "DJINNGER";
	else if  (n==2)	 return "CARNIVORACE";
	else if  (n==3)	 return "EVILUTION";
	else if  (n==4)	 return "TRIOXIN";
	else if  (n==6)	 return "NITROZON";
	else if  (n==7)	 return "HYDROUS";
	else if  (n==8)	 return "VORT-X";
	else if  (n==9)	 return "GORGOROTH";
	else if  (n==11) return "JABA THE HOT";
	else if  (n==12) return "BIOMICIDE";
	else if  (n==13) return "ANTHRAX";
	else if  (n==14) return "COCKROAST";
	else if  (n==16) return "ARACKING";
	else if  (n==17) return "SULFUR";
	else if  (n==18) return "DIPHTEROS";
	else if  (n==19) return "BRUTUS";
}

ufos.prototype.closestUfo = function(x, y) {
	var minDistance = 9999;
	var closestU = -1;

	for (var u=1; u<=this.nbr(); u++) {

		if(this.ufoHitPoints[u] > 0) {			
			var dist = Math.sqrt(Math.pow(this.ufoX[u] - x, 2) + Math.pow(this.ufoY[u] - y, 2));
			
			if(dist<minDistance) {
				minDistance = dist;
				closestU = u;
			}
		}
	}	
	return closestU;
}

ufos.prototype.displayBossLifeBar = function () {
	ctx.beginPath();
	ctx.lineWidth="20";
	ctx.strokeStyle="#880000";
	ctx.rect(canvasMaxX-230, 20,  Math.max(0, 200*(this.hitPoints(bossUfoNr)/this.bossHitPoints())), 0);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth="2";
	ctx.strokeStyle="#550000";
	ctx.rect(canvasMaxX-230, 10, 200, 20);
	ctx.font = "9pt 'Arial Black'";
	ctx.fillStyle = "#000000";
	ctx.fillText(this.bossName(level), canvasMaxX-225, 24);	
	ctx.stroke();
}