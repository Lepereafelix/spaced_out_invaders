
//********************************************************* 
// Loads game pics
//********************************************************* 

function pictures()
{
	this.objet = new Array();
	this.nbrPics = 0;
	this.nbrLoaded = 0;
}

pictures.prototype.loadPics = function () {

	//splash screen first
	this.ajout(0,  "splash_screen.png");
	this.ajout(1,  "splash_screen2.png");
	this.ajout(4,  "speed.png");
	this.ajout(5,  "radioactive.png");
	this.ajout(6,  "transparent_pixel.png");
	this.ajout(9,  "present_life.png");
	this.ajout(10, "present_shield.png");
	this.ajout(11, "present_gun.png");
	this.ajout(12, "present_laser.png");
	this.ajout(13, "present_bomb.png");
	this.ajout(14, "present_atomic.png");
	this.ajout(15, "present_slow.png");
	this.ajout(16, "present_carrots.png");
	this.ajout(17, "present_nuke.png");
	this.ajout(18, "present_ice.png");
	this.ajout(19, "present_speed.png");
	this.ajout(20, "present_heatseeker.png");
	this.ajout(21, "present_wave.png");
	this.ajout(22, "slow.png");
	this.ajout(25, "carrot.png");
	this.ajout(26, "carrot_alt.png");
	
	for (var u=1; u<=nbrUfosDifferents; u++) {
		this.ajout(25+2*u, "bomb" + u + ".png");
		this.ajout(26+2*u, "bomb" + u + "_alt.png");
	}
	
	for (b=1; b<=19; b++) {
		// level 5 = asteroids
		if(b!=5 && b!=10 && b!=15) {
			//bosses bombs = pics #47=>#84
			this.ajout(45+2*b, "bomb_boss" + b + ".png");
			this.ajout(46+2*b, "bomb_boss" + b + "_alt.png");
			//bosses = pics #191=>#208
			if(b<=9) { 
				this.ajout(189+2*b, "ufo_boss" + b + "_left.png");
				this.ajout(190+2*b, "ufo_boss" + b + "_right.png");
			}
		}
	}
		
	this.ajout(90, "lock1.png");
	this.ajout(91, "lock2.png");
	this.ajout(92, "lock3.png");
	this.ajout(93, "lock4.png");
	this.ajout(101, "missile_rainbow.png");
	this.ajout(102, "missile_laser.png");
	this.ajout(103, "missile_bomb.png");
	this.ajout(104, "missile_atomic.png");
	this.ajout(105, "missile_atomic_fade.png");
	this.ajout(106, "missile_heatseeker.png");
	this.ajout(107, "missile_wave.png");
	this.ajout(111, "missile_red.png");
	this.ajout(112, "missile_green.png");
	this.ajout(113, "missile_blue.png");
	this.ajout(114, "halo_purple.png");
	this.ajout(115, "halo_yellow.png");
	this.ajout(116, "halo_red.png");
	this.ajout(117, "halo_green.png");
	this.ajout(118, "halo_blue.png");
	this.ajout(119, "ice_cube.png");
	this.ajout(120, "explosion0.png");
		
	for (var e=1; e<=12; e++) {
		this.ajout(120+2*e, "explosion" + e + ".png");
		this.ajout(121+2*e, "explosion" + e + "_big.png");
	}	
	
	for (var a=1; a<=9; a++)
		this.ajout(150+a,  "asteroid" + a + ".png");
	
	this.ajout(168, "ufo_red.png");
	this.ajout(169, "boss_red.png");
	this.ajout(170, "ufo_rabbit.png");
	
	for (var u=1; u<=nbrUfosDifferents; u++) {
		this.ajout(171+2*(u-1), "ufo" + u + "_left.png");
		this.ajout(172+2*(u-1), "ufo" + u + "_right.png");
	}
	
	this.ajout(251, "fusee1.png");
	this.ajout(252, "fusee2.png");
	this.ajout(253, "fusee3.png");
	this.ajout(254, "fusee1_shield.png");
	this.ajout(255, "fusee2_shield.png");
	this.ajout(256, "fusee3_shield.png");
	this.ajout(261, "atlantis1.png");
	this.ajout(262, "atlantis2.png");
	this.ajout(263, "atlantis3.png");
	this.ajout(264, "atlantis1_shield.png");
	this.ajout(265, "atlantis2_shield.png");
	this.ajout(266, "atlantis3_shield.png");
	this.ajout(271, "falcon1.png");
	this.ajout(272, "falcon2.png");
	this.ajout(273, "falcon3.png");
	this.ajout(274, "falcon1_shield.png");
	this.ajout(275, "falcon2_shield.png");
	this.ajout(276, "falcon3_shield.png");
	
	for (var g=1; g<=10; g++)
		this.ajout(280+g, "galaxy" + g + ".png");
		
	this.ajout(299, "game_over.png");
}

pictures.prototype.ajout = function (nr, url) {
	
		this.objet[nr] = new Image();
		this.objet[nr].src = url;	
		this.objet[nr].onload = function() { pic.incLoaded(); }
		this.nbrPics++;
}

// gestion ici de l'affichage et animation du heros

pictures.prototype.displayHero = function () {
	
	var offsetX = (fuseeType==2 ? 12: 10);
	
	if (activeWeapon()=="megabomb")
		ctx.drawImage(pic.getByNbr(115), fuseeX+offsetX, fuseeY-15); //yellow halo
	if (activeWeapon()=="laser")
		ctx.drawImage(pic.getByNbr(116), fuseeX+offsetX, fuseeY-15); //red halo
	else if (activeWeapon()=="atomic")
		ctx.drawImage(pic.getByNbr(118), fuseeX+offsetX, fuseeY-15); //blue halo
	else if (activeWeapon()=="heatseeker")
		ctx.drawImage(pic.getByNbr(117), fuseeX+offsetX, fuseeY-15); //green halo
	if (activeWeapon()=="wave")
		ctx.drawImage(pic.getByNbr(114), fuseeX+offsetX, fuseeY-15); //purple halo
	
	var picNrOffset = 250 + (parseInt(fuseeType-1) * 10);
	
	if ((Date.now() - fuseeShieldStart > shieldDuration * 1000) || (Date.now() - fuseeShieldStart > (shieldDuration-2) * 1000 && frameNr % 2==1)){
		//shield [OFF]
		if (frameNr %24 < 6) 
			ctx.drawImage(pic.getByNbr(picNrOffset + 1),  fuseeX, fuseeY);
		else if (frameNr %24 < 12) 
			ctx.drawImage(pic.getByNbr(picNrOffset + 2),  fuseeX, fuseeY);
		else if (frameNr %24 < 18) 
			ctx.drawImage(pic.getByNbr(picNrOffset + 3),  fuseeX, fuseeY);
		else
			ctx.drawImage(pic.getByNbr(picNrOffset + 2),  fuseeX, fuseeY);
	}
	else {
		//shield [ON]
		if (frameNr %24 < 6)
			ctx.drawImage(pic.getByNbr(picNrOffset + 4), fuseeX, fuseeY);
		else if (frameNr %24 < 12)
			ctx.drawImage(pic.getByNbr(picNrOffset + 5), fuseeX, fuseeY);
		else if (frameNr %24 < 18)
			ctx.drawImage(pic.getByNbr(picNrOffset + 6), fuseeX, fuseeY);
		else
			ctx.drawImage(pic.getByNbr(picNrOffset + 5), fuseeX, fuseeY);
	}
	
	//speed icon
	if (Date.now() - fuseeSpeedStart < speedDuration * 1000) 
		ctx.drawImage(pic.getByNbr(4), fuseeX+(fuseeType==3 ? 69: 33), fuseeY+82); 
}
pictures.prototype.getByNbr = function (nr) {
	return this.objet[nr];
}
pictures.prototype.width = function (nr) {
	return this.objet[nr].width;
}
pictures.prototype.height = function (nr) {
	return this.objet[nr].height;
}
pictures.prototype.incLoaded = function () {
	this.nbrLoaded++;
}
pictures.prototype.nbr = function () {
	return this.nbrPics;
}
pictures.prototype.loaded = function () {
	return this.nbrLoaded;
}
pictures.prototype.allLoaded = function () {
	return (this.nbrLoaded==this.nbrPics);
}