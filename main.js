
/////////////////////////////////////////////////////////////////////
// Frédéric Gaonac'h - 2016 - gmail : lepereafelix
/////////////////////////////////////////////////////////////////////

var nbrUfosDifferents =9;
var nbrBossesDifferents = 9;
var maxLevel = 19;
var fuseeHitPoints;
var fuseeType = 2; // 1=tintin; 2=atlantis; 3=falcon
var fuseeRainbowAmmos ;
var fuseeLaserAmmos;
var fuseeAtomicAmmos;
var fuseeWaveAmmos;
var fuseeHeatseekerAmmos;
var fuseeMegaBombs;
var numMissileMegaBomb;
var showSplashScreen = false;
var showInfosScreen = false;
var fuseeX;
var fuseeY;
var astLargeur = 120;
var astHauteur = 100; 
var canvasMaxX;
var canvasMaxY; 
var timeLastMissile = 0;
var timeGameStart = 0;
var timeLastBomb = 0;
var timeLastUfoHit = 0;
var fuseeShieldStart = new Date(2000, 1, 1);
var fuseeSpeedStart = new Date(2000, 1, 1);
var shieldDuration = 12; //secs
var speedDuration  = 12; //secs
var score = 0;
var level;
var pause = false;
var frameNr = 0;
var mute = false;
var gamePlaying = false;
var goLeft = false;
var goRight = false;
var gameOver = false;
var timeGameOver = 0;
var nbrUfosLeft;
var nbrUfoKilled;
var timeLevelCompleted;
var readyForNextLevel;
var debug = false;
var bossArea;
var bossUfoNr;
var bossIsDead;
var timeStartLevel;
var framesPerSecond = 0;
var delay1;
var delay2;

var ast = new asteroids();
var mis = new missiles();
var bombs = new missiles();
var ufo = new ufos();
var expl = new explosions();
var etl = new etoiles();
var gal = new galaxies();
var cad = new cadeaux();
var pic = new pictures();
var ctx;

function init() {
	ctx = document.getElementById('myCanvas').getContext('2d');
	setCanvasSize();
	pic.loadPics();
	displayPicsLoaded();
}

function setCanvasSize() {
	myCanvas.width = window.innerWidth;
	myCanvas.height = window.innerHeight;
	canvasMaxX = myCanvas.width; 
	canvasMaxY = myCanvas.height;
	
	if (gamePlaying && !timeLevelCompleted)
		fuseeY = fuseeFightY();
}

function displayPicsLoaded() {
	
	if (pic.allLoaded()) {
		showSplashScreen=true;
		etl = new etoiles();
		etl.ajoutN(60);
		window.requestAnimationFrame(draw);
	}
	else {
		ctx.clearRect(0, 0, canvasMaxX, canvasMaxY); // clear canvas
		ctx.font = "24pt 'Arial Black'";
		ctx.fillStyle = "#00BB00";
		var x = Math.ceil((canvasMaxX-600) / 2);
		ctx.fillText("LOADING PICS (" + pic.loaded() + "/" + pic.nbr() + ")", x+60, 150);
		ctx.beginPath();
		ctx.lineWidth="2";
		ctx.strokeStyle="#00BB00";
		ctx.rect(x, 200, 600, 40);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth="20";
		ctx.strokeStyle="#00BB00";
		ctx.rect(x+10, 210, 580 * (pic.loaded() / pic.nbr()), 20);
		ctx.stroke();
		setTimeout(displayPicsLoaded, 200);
	}
}

function newGame() {

	showSplashScreen = false;
	fuseeRainbowAmmos = 0;
	fuseeLaserAmmos = 0;
	fuseeAtomicAmmos = 0;
	fuseeHeatseekerAmmos = 0;
	fuseeMegaBombs = 0;
	fuseeWaveAmmos = 0;
	fuseeX = Math.ceil(canvasMaxX / 2);
	fuseeY = canvasMaxY;
	score = 0;
	level=0;
	fuseeHitPoints=100*fuseeType;
	nbrUfoKilled = 0;
	gamePlaying=true;
	gameOver = false;
	timeGameStart=new Date();
	etl = new etoiles();
	gal = new galaxies();
	etl.ajoutN(60);
	gal.init();
	newLevel();
}

function draw() {
	frameNr+=1;
	ctx.clearRect(0, 0, canvasMaxX, canvasMaxY); 
	
	//etoiles
	etl.affichage();
	etl.descente();
	
	//pictures loaded, ready to play, displaying splash screen
	if (showInfosScreen) {
		ctx.drawImage(pic.getByNbr(1), centerPicX(0), centerPicY(0));
		window.requestAnimationFrame(draw);
		return true;
	}
	
	if (showSplashScreen) {
		ctx.drawImage(pic.getByNbr(0), centerPicX(0), 50);
		window.requestAnimationFrame(draw);
		return true;
	}
	
	// galaxy	
	gal.affichage();
	gal.descente();
	
	if (bossArea && !bossIsDead) 
		ufo.displayBossLifeBar();

	
	///////////////////////
	// asteroids
	///////////////////////
	
	for (var a=1; a<=ast.nbr(); a++) {
		if (ast.actif(a)>0) {
			ctx.drawImage(ast.getPic(a), ast.x(a), ast.y(a));
		
			// collision avec héros
			if (ast.y(a)>fuseeY-astHauteur && ast.x(a)>fuseeX-astLargeur && ast.x(a)<fuseeX+largeurFusee()) {
				expl.ajout( ast.x(a), ast.y(a), 9);
				fuseeHit(5);
				score+=100;
				ast.recycler(a);
				
				playSound(sndAstExplosion);
			}
		}
	}
	
	///////////////////////
	//ufos
	///////////////////////

	for (var u=1; u<=ufo.nbr(); u++) {
	
		if(ufo.hitPoints(u) > 0) {
			ctx.drawImage(ufo.getPic(u), ufo.x(u), ufo.y(u));
			
			//slowed down
			if (ufo.ufoXSpeed[u]==1)
				ctx.drawImage(pic.getByNbr(22), ufo.x(u)+38, ufo.y(u)+53);
			
			if (ufo.frozen(u)) 
				ctx.drawImage(pic.getByNbr(119), ufo.x(u)-5, ufo.y(u)-18);
			
			else if(Date.now() - ufo.lastBombTime(u)> 500 && Math.random() < ufo.bombsRate(u)) {
				//tiens, une bombe dans ta gueule
				bombs.ajout(ufo.x(u)+Math.floor((ufo.largeur(u)-bombs.largeurPNG(ufo.bombType(u)))/2), ufo.y(u)+ufo.hauteur(u) + 10, ufo.xSpeed(u)+2, ufo.bombType(u), Math.ceil(ufo.type(u)/2));
				ufo.ufoLastBombTime[u] = new Date();
				
				if (!mute) {
					if (ufo.type(u)>10) 
						playSound(sndBossShoot);
					else 
						//playSound(sndUfoShoot[1+ufo.type(u) % 4]);
					playSound(sndUfoShoot[Math.ceil(Math.random() * 3)]);
					
				}
			}
			
			// collision avec héros
			if (ufo.y(u) > fuseeY - ufo.hauteur(u) && ufo.y(u) < fuseeY + hauteurFusee()
			&&  ufo.x(u) > fuseeX - ufo.largeur(u) && ufo.x(u) < fuseeX + largeurFusee()) {
				
				if (ufo.frozen(u)) 
					fuseeHit(1);
				else 
					fuseeHit(Math.ceil(ufo.hitPoints(u)));

				ufo.killed(u);
			}

			if (ufo.y(u) > canvasMaxY) {
				if (nbrUfosLeft>0)
					ufo.remplacer(u);
				else
					ufo.remiser(u);
			}	
		}
	}	

	///////////////////////
	// bombes des ufos
	///////////////////////
	
	for (var b=1; b<=bombs.nbr(); b++) {
		
		if (bombs.actif(b)) {
			if (bombs.y(b) < canvasMaxY) {
				ctx.drawImage(bombs.getPic(bombs.type(b), (Date.now() - bombs.lauchTime(b)) % 600 < 300), bombs.x(b), bombs.y(b));
				
				// collision bombe / héros
				if (bombs.collision(b, fuseeX, fuseeY, fuseeX+largeurFusee(), fuseeY+hauteurFusee())) {
					if (bombs.type(b)==0) {
						fuseeHit(-1); // yabon carottes
						playSound(sndCarrot);
					}
					else {
						if (bombs.type(b)<10)
							expl.ajout(bombs.x(b)-50, bombs.y(b), 10);
						else
							expl.ajout(fuseeX-50, fuseeY-50, 7); //rouge
						
						fuseeHit(Math.ceil(bombs.hitPoints(b)));
						playSound(sndBomb);
					}
					bombs.retirer(b);
				}
			}
			else 
				bombs.retirer(b);
		}
	}
	///////////////////////
	// missiles	du héros
	///////////////////////
	
	for (var m=1; m<=mis.nbr(); m++) {
		if (mis.actif(m)) {
			
			if (mis.type(m)==107) {
				//wave resize			
				var factor = (1-mis.y(m)/fuseeY);
				ctx.drawImage(mis.getPic(mis.type(m), false), mis.x(m)-parseInt(factor * mis.largeurPNG(107)/2), mis.y(m), parseInt(factor * mis.largeurPNG(107)), parseInt(factor * mis.hauteurPNG(107)));
			}
			else
				ctx.drawImage(mis.getPic(mis.type(m), false), mis.x(m), mis.y(m));
			
			for (var a=1; a<=ast.nbr(); a++) {
				if (ast.actif(a)) {
					// asteroïde atteint par missile
					if (mis.collision(m, ast.x(a), ast.y(a), ast.x(a)+astLargeur, ast.y(a)+astHauteur)) {
						if (m==numMissileMegaBomb)
							detonationMegaBomb(m);
						else {
							ast.astHitPoints[a] -= mis.puissance(m);
							
							if (ast.hitPoints(a)<=0) {
								expl.ajout(ast.x(a)-50, ast.y(a)-50, 9);
								score +=100;
								ast.recycler(a);								
								playSound(sndAstExplosion);
							}	
							else {								
								if (!mis.dommageDeZone(m))
									expl.ajout(mis.x(m)-30, mis.y(m)-30, 0);
							}
							
							if (!mis.dommageDeZone(m))
								mis.retirer(m);
						}
					}
				}
			}
			
			for (var u=1; u<=ufo.nbr(); u++) {
				if (ufo.actif(u)) {
					// ufo atteint par missile
					if (mis.collision(m, ufo.x(u), ufo.y(u), ufo.x(u)+ufo.largeur(u), ufo.y(u)+ufo.hauteur(u))) {
						
						if (m==numMissileMegaBomb)
							detonationMegaBomb(m);
						else {
							ufo.ufoHitPoints[u] -= mis.puissance(m);
							
							if (ufo.hitPoints(u)<=0) {
								ufo.killed(u);
							}
							else {
								if (!mis.dommageDeZone(m))
									expl.ajout(mis.x(m)-30, mis.y(m)-30, 0);
									
								playSound(sndUfoHit);
								lastUfoHit = new Date();
								
								// ufo red hot suite laser 
								if (mis.type(m) == 102) 
										ctx.drawImage(pic.getByNbr(ufo.type(u)<10 ? 168 : 169), ufo.x(u), ufo.y(u));  
							}
							if (!mis.dommageDeZone(m))
								mis.retirer(m);
						}
					}
				}
			}			
			for (var b=1; b<=bombs.nbr(); b++) {
				if (bombs.actif(b) > 0) {
					// bombe atteinte par missile
					if (mis.collision(m, bombs.x(b), bombs.y(b), bombs.x(b)+bombs.largeurPNG(bombs.type(b)), bombs.y(b)+bombs.hauteurPNG(bombs.type(b)))) {
						
						if (m==numMissileMegaBomb)
							detonationMegaBomb(m);
						else {
							if (!mis.dommageDeZone(m))
								expl.ajout(mis.x(m)-30, mis.y(m)-30, 0);
							
							bombs.missileHitPoints[b] -= mis.puissance(m);
							
							if (bombs.hitPoints(b)<=0) {
								expl.ajout(bombs.x(b)-50, bombs.y(b)-50, (bombs.type(b)<10 ? bombs.type(b) : 10));
								score += 100 * bombs.type(b);
								bombs.retirer(b);
								playSound(sndBombIntercept);
							}
							if (!mis.dommageDeZone(m))
								mis.retirer(m);
						}
					}
				}
			}
			// missile off screen
			if (mis.y(m)+mis.hauteurPNG(mis.type(m))<0) {
				mis.retirer(m);
				
				if (m==numMissileMegaBomb)
					numMissileMegaBomb = -1;
			}
			//atomic bomb disappears before reaching top screen
			else if (mis.type(m)==104 && mis.y(m) < canvasMaxY - mis.hauteurPNG(104) - hauteurFusee()) {
				expl.ajout(mis.x(m), mis.y(m), 25);
				mis.retirer(m);
				fuseeAtomicAmmos--;
			}			
		}
	}
	/////////////
	// fusee 
	/////////////
	
	if (fuseeHitPoints > 0)
		pic.displayHero();
	else
		// game over explosion
		expl.ajout(fuseeX-50, fuseeY-50, 10);
		
	///////////////////////
	// cadeaux
	///////////////////////
	
	if (!missionAccomplie() && Math.ceil(Math.random() * 300)==1) {
		if (!bossArea)
			if (asteroidOnly(level))
				cad.ajout(1, 8);
			else
				cad.ajout();
		else 
			// boss area - disabling useless presents
			cad.ajout(1, 12);
	}
	
	for (var c=1; c<=cad.nbr(); c++) {
		if (cad.x(c) > 0) {	
			ctx.drawImage(cad.getPic(c), cad.x(c), cad.y(c));
			
			// cadeau attrapé ?
			if (cad.y(c)>fuseeY-80 && cad.x(c)>fuseeX-60 && cad.x(c)<fuseeX+largeurFusee()) {
				
				if (cad.type(c)<=3)  // life
					fuseeHitPoints+=20;
				if (cad.type(c)==4) // speed
					fuseeSpeedStart = new Date();
				if (cad.type(c)==5) // gun arc en ciel
					fuseeRainbowAmmos += 50;
				if (cad.type(c)==6) // laser
					fuseeLaserAmmos += 10;
				if (cad.type(c)==7) // megabomb
					fuseeMegaBombs += 5;
				if (cad.type(c)==8) // blue atomic
					fuseeAtomicAmmos += 5;
				if (cad.type(c)==9) //shield
					fuseeShieldStart = new Date();
				if (cad.type(c)==10) { // nuke all ufos
					expl.ajout(centerPicX(5), centerPicY(5), 24);
					
					for (var u=1; u<=ufo.nbr(); u++) {
						if (ufo.hitPoints(u) > 0) {
							ufo.ufoHitPoints[u] -= 15;
						
							if (ufo.hitPoints(u)<=0)
								ufo.killed(u);
							else {
								//boss
								expl.ajout(ufo.x(u), ufo.y(u), 10);
								playSound(sndUfoDead);
							}
						}
					}	
				}
				if (cad.type(c)==11)  // heatseeker
					fuseeHeatseekerAmmos += 15;
				if (cad.type(c)==12) // wave 
					fuseeWaveAmmos += 8;
				if (cad.type(c)==13)  // slow down ufos
					for (var u=1; u<=ufo.nbr(); u++) 
						if (ufo.type(u) < 10) {
							ufo.ufoXSpeed[u]=1;
							ufo.ufoYSpeed[u]=1;
						}
				// carrots
				if (cad.type(c)==14) 
					for (var u=1; u<=ufo.nbr(); u++) 
						if (ufo.type(u) < 10) {
							ufo.firesCarrots(u);
							ufo.ufoHitPoints[u]=1;
						}
					
				if (cad.type(c)==15)  // ice
					for (var u=1; u<=ufo.nbr(); u++) 
						if (ufo.type(u) < 10)
							ufo.freeze(u);
						
				if (cad.type(c) !=4)
					playSound(sndGotPresent);
				
				cad.effacer(c);	
			}
			if (cad.y(c) > canvasMaxY) 
				cad.effacer(c);	
		}
	}
	
	////////////////////
	// explosions
	////////////////////
	
	for (var e=1; e<=expl.nbr(); e++) {
	
		if (expl.delay(e) > 0)
			expl.expDelay[e]--;
		else if (expl.framesBeforeEnd(e) > 0) {
			//console.log("calling expl " + e);
			ctx.drawImage(expl.getPic(e), expl.x(e), expl.y(e));
			expl.countdownToFade(e);
		}
	}
	
	// level completed
	if (missionAccomplie()) {
	
		if (!timeLevelCompleted) {
			var waitSomeMore = false;
			
			//waiting for last asteroids to leave
			for (var a=1; a<=ast.nbr(); a++) 
				if (ast.actif(a))
					waitSomeMore = true;
					
			//waiting for last bombs to leave
			for (var b=1; b<=bombs.nbr(); b++) 
				if (bombs.actif(b)) 
					waitSomeMore = true;
				
			//waiting for last presents to fall
			for (var c=1; c<=cad.nbr(); c++) 
				if (cad.actif(c)) 
					waitSomeMore = true;
					
			if (!waitSomeMore) 
				timeLevelCompleted = new Date();
		}
		else 
			// les derniers items ont disparu
			levelCompleted();
	}
	
	// console texte
	displayScore();
	
	// gestion des mouvements
	ast.descente();
	mis.montee();
	bombs.descente();
	ufo.ballade();
	cad.descente();
	
	if (goLeft) {
		fuseeX-=fuseeSpeedX();
		
		if (fuseeX < 1)
			fuseeX = 1;
	}
	if (goRight) {
		fuseeX+=fuseeSpeedX();
		
		if (fuseeX > canvasMaxX - largeurFusee())
			fuseeX = canvasMaxX - largeurFusee();
	}
		
	// arrivée nouveau niveau
	if (fuseeY>fuseeFightY()) 
		fuseeY-=Math.min(10, fuseeY-fuseeFightY());

	if (fuseeHitPoints <= 0) {
		
		if (gamePlaying){
			timeGameOver=new Date();
			gamePlaying = false;
			gameOver = true;			
			playSound(sndBossDead);
		}
	}
	
	framesPerSecond = 0.99 * framesPerSecond + 0.01 * (1000*frameNr/ (Date.now()-timeStartLevel));
	
	if (!gameOver || Date.now() - timeGameOver < 1200) {
		if (!pause)
			window.requestAnimationFrame(draw);
	}
	else {
		ctx.drawImage(pic.getByNbr(299), 0, 0);
		displayScore();
	}
}

function fuseeSpeedX() {
	
	if (fuseeType==1)
		return (Date.now() - fuseeSpeedStart > speedDuration * 1000) ? 10 : 14;
	if (fuseeType==2)
		return (Date.now() - fuseeSpeedStart > speedDuration * 1000) ? 9 : 13;
	if (fuseeType==3)
		return (Date.now() - fuseeSpeedStart > speedDuration * 1000) ? 8 : 12;
	
}

function centerPicX(picNr) {
	return Math.floor((canvasMaxX-pic.width(picNr))/2);
}

function centerPicY(picNr) {
	return Math.floor((canvasMaxY-pic.height(picNr))/2);
}

function displayScore() {

	ctx.font = "9pt 'Arial Black'";
	ctx.fillStyle = "#00BB00";
	ctx.fillText("POWER : ", 20, 30);
	ctx.fillText("LEVEL : " + level, 20, 50);
	ctx.fillText("UFOS DESTROYED : " + nbrUfoKilled, 20, 70);
	
	//ajout d'espaces comme séparateur de milliers
	var scoreFormatted="";
	var str=score+"";
	var p = 0;
	
	while (p<str.length)  {
		scoreFormatted += ((str.length - p)%3==0?" ":"")  + str.substr(p, 1);
		p++;
	}

	ctx.fillText("SCORE : " + scoreFormatted, 20, 90);
	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="#00BB00";
	ctx.rect(10, 10, 230, 90);
	ctx.stroke();
	
	if (debug) {
		ctx.fillStyle = "#666666";
		ctx.fillText("Frames per second : " + Math.round(framesPerSecond), 20 ,120);
		ctx.fillText("Game playing : " + Math.floor((Date.now() - timeGameStart) /60000) + "m " +Math.floor(((Date.now() - timeGameStart) %60000)/1000) + "s", 20 ,140);
		ctx.fillText("Debug : " + debug, 20, 160);
	}

	// life bar
	if (fuseeHitPoints> 0) {
		ctx.beginPath();
		ctx.lineWidth="8";
		ctx.strokeStyle="#" + hexa((85-fuseeHitPoints)*2.5) + hexa(fuseeHitPoints*2.5) + "00";
		ctx.rect(90, 21, Math.min(fuseeHitPoints/2, 140), 8);
		ctx.stroke();
		ctx.fillStyle = "#000000";
		ctx.fillText(fuseeHitPoints, 90, 30);
	}
}

function activeWeapon() {
	
	if (fuseeMegaBombs  > 0 || numMissileMegaBomb>0)
		return "megabomb";
	else if (fuseeWaveAmmos > 0)
		return "wave";
	else if (fuseeLaserAmmos > 0)
		return "laser";
	else if (fuseeHeatseekerAmmos > 0)
		return "heatseeker";
	else if (fuseeAtomicAmmos > 0)
		return "atomic";
	else if (fuseeRainbowAmmos > 0)
		return "rainbow";
}

function shoot() {
		
	if (Date.now() - timeLastMissile > 100) {
		if (activeWeapon()=="megabomb") {
			
			if (numMissileMegaBomb>0 && mis.actif(numMissileMegaBomb)>0) 
				detonationMegaBomb(numMissileMegaBomb);
			else {
				numMissileMegaBomb = mis.ajout(fuseeX+Math.floor(largeurFusee()/2)-24, fuseeY-50, 10, 103);
				fuseeMegaBombs -=1;
				playSound(sndMegabomb);
			}
		}
		else if (activeWeapon()=="laser") {
			mis.ajout(fuseeX+Math.floor(largeurFusee()/2)-14, fuseeY-48, 40, 102);
			fuseeLaserAmmos--;
			playSound(sndLaser);
		}
		else if (activeWeapon()=="atomic") {
			mis.ajout(fuseeX+Math.floor(largeurFusee()/2)-220, (fuseeY+hauteurFusee()), 40, 104);
			playSound(sndAstExplosion);
		}
		else if (activeWeapon()=="heatseeker") {
			fuseeHeatseekerAmmos--;
			mis.ajout(fuseeX+Math.floor(largeurFusee()/2)-36, fuseeY-50, 7, 106);
			playSound(sndHeatseeker);
		}
		else if (activeWeapon()=="wave") {
			fuseeWaveAmmos--;
			mis.ajout(fuseeX+Math.floor(largeurFusee()/2), fuseeY, 30, 107);
			playSound(sndHeatseeker);
		}
		else if (activeWeapon()=="rainbow") {
			mis.ajout(fuseeX+Math.floor(largeurFusee()/2)-10, fuseeY-30, 10, 101);
			fuseeRainbowAmmos--;
			playSound(sndRainbowGun);
		}
		else {
			mis.ajout(fuseeX+Math.floor(largeurFusee()/2)-10, fuseeY-30, 5, 110+fuseeType);	
			playSound(sndSimpleGun);
		}
		timeLastMissile = new Date();
	}
}

function detonationMegaBomb(m) {
	
	expl.ajout(mis.x(m)-350, mis.y(m)-325, 12);
	
	playSound(sndAstExplosion);
	
	// explosion ufo
	for (var u=1; u<=ufo.nbr(); u++) {
		if(ufo.hitPoints(u)>0 && ufo.x(u)>mis.x(m)-400 && ufo.x(u)<mis.x(m)+300 && ufo.y(u)>mis.y(m)-400 && ufo.y(u)<mis.y(m)+300) {
			ufo.ufoHitPoints[u] -=10;
			
			if (ufo.ufoHitPoints[u]<=0)
				ufo.killed(u);
			else
				expl.ajout(ufo.x(u)+50, ufo.y(u)+50, 10);
		}
	}
	// explosion asteroide
	for (var a=1; a<=ast.nbr(); a++) {
		if(ast.hitPoints(a)>0 && ast.x(a)>mis.x(m)-400 && ast.x(a)<mis.x(m)+300 && ast.y(a)>mis.y(m)-400 && ast.y(a)<mis.y(m)+300) {
			score +=100;
			expl.ajout(ast.x(a)-50, ast.y(a)-50, 9);
			ast.astHitPoints[a] =-1;
			ast.recycler(a);
		}
	}	
	// explosion bombe
	for (var b=1; b<=bombs.nbr(); b++) {
		if(bombs.actif(b) && bombs.x(b)>mis.x(m)-400 && bombs.x(b)<mis.x(m)+300 && bombs.y(b)>mis.y(m)-400 && bombs.y(b)<mis.y(m)+300) {
			score +=100;
			expl.ajout(bombs.x(b)-50, bombs.y(b)-50, 10);
			bombs.retirer(b);
		}
	}				
	mis.retirer(m);
	numMissileMegaBomb = -1;
}
function levelCompleted() {
	
	delay1 = level < maxLevel ? 2000 : 5000;
	delay2 = level < maxLevel ? 5000 : 12000;
	var opacity = Math.min((Date.now() - timeLevelCompleted)/delay1, 1);
	ctx.font = "42pt 'Arial Black'";
	ctx.fillStyle = "rgba(0, 200, 0, " + opacity + ")";
	
	//color gradient
	var x = Math.ceil(canvasMaxX/2 - 300);
	var y = Math.ceil(canvasMaxY/2 - 150);
	
	var gradient=ctx.createLinearGradient(x,y-50,x,y+50);
	gradient.addColorStop("0","#00AA00");
	gradient.addColorStop("1","#00DD00");
	ctx.fillStyle=gradient;
	
	if (level<maxLevel) 
		ctx.fillText("LEVEL " + level + " COMPLETED", x, y);
	else
		ctx.fillText("CONGRATS, YOU WON THE GAME !!!", x-250, y+50);
		
	// recentrage du héros
	if (Date.now() - timeLevelCompleted < delay2) {
		if(fuseeX > Math.ceil((canvasMaxX-largeurFusee()+21)/2))
			fuseeX-=10;
		else if (fuseeX < Math.floor((canvasMaxX-largeurFusee())/2))
			fuseeX+=10;
		if (sndEngine.currentTime==0) 
			playSound(sndEngine);

	}
	else {
		if (fuseeY==fuseeFightY() && level<maxLevel) {
			//goodie
			cad.cadX[1] = centerPicX(10);
			cad.cadY[1] = -80;
			cad.cadSpeed[1] = 12;
			cad.cadType[1] = Math.ceil(Math.random() * 8);
			playSound(sndThrottle);
		}
		
		//decollage fusée
		if (fuseeY> -hauteurFusee()) {
			if (fuseeY >= fuseeFightY() && fuseeY < canvasMaxY)
				playSound(sndThrottle);
			
			fuseeY-=0.03*Math.max(Math.ceil(canvasMaxY-fuseeY), 1);
		}
		
		if (level<maxLevel) {
			if (Date.now() - timeLevelCompleted > delay2+2000) {
				displayNextTarget();
				readyForNextLevel = true;
			}
		}
		else {
			//parade finale 
			if (fuseeY<= -hauteurFusee()) {
				// one more run
				fuseeX = Math.ceil(canvasMaxX*Math.random());
				fuseeY = canvasMaxY + 5000;
			}
		}
	}
}

function displayNextTarget() {
	
	ctx.font = "16pt 'Arial Black'";
	
	if (asteroidOnly(level+1)) {
		ctx.fillText("NOW ENTERING ASTEROID BELT..." , Math.ceil(canvasMaxX/2 - 200), Math.ceil(canvasMaxY/2 - 50));
	}
	else {
		ctx.fillText("NEXT TARGET : " + ufo.bossName(level+1),centerPicX(ufo.ufoBossPicNr(level+1)), Math.ceil(canvasMaxY/2)- 50);
		
		if (Date.now() - timeLevelCompleted > delay2 + 2100)
			ctx.drawImage(pic.getByNbr(ufo.ufoBossPicNr(level+1)),  Math.ceil(canvasMaxX/2)-100, Math.ceil(canvasMaxY/2));
		if (Date.now() - timeLevelCompleted > delay2 + 2200)
			ctx.drawImage(bombs.getPic(level+11), Math.ceil(canvasMaxX/2)-100, Math.ceil(canvasMaxY/2)+200);
		if (Date.now() - timeLevelCompleted > delay2 + 2300)
			ctx.drawImage(bombs.getPic(level+11, true), Math.ceil(canvasMaxX/2)-300, Math.ceil(canvasMaxY/2)+250);
		if (Date.now() - timeLevelCompleted > delay2 + 2400)
			ctx.drawImage(bombs.getPic(level+11), Math.ceil(canvasMaxX/2)-500, Math.ceil(canvasMaxY/2)+300);
	}
}
function newLevel(){
	
	ast = new asteroids();
	mis = new missiles();
	bombs = new missiles();
	expl = new explosions();
	cad = new cadeaux();
	ufo = new ufos();
	
	timeStartLevel = new Date();
	frameNr = 0;
	bossArea = false;
	bossIsDead = false;
	level+=1;
	fuseeY = canvasMaxY;
	nbrUfosLeft = 10 + level*2;	
	
	ast.ajoutN(Math.floor(level/2) + (asteroidOnly(level) ? 10 : 3));
	readyForNextLevel = false;
	timeLevelCompleted = null;
	
	if (!asteroidOnly(level))
		ufo.ajoutN(3 + Math.floor(level/2));
}
	
function monsterLevelMax() {
	return Math.min(level+1, nbrUfosDifferents);
}

function missionAccomplie() {
	
	if (asteroidOnly(level)) 
		return (Date.now()-timeStartLevel > 45*1000);
	else
		return bossIsDead;		
}

function asteroidOnly(L) {
	// levels 5, 10, 15 are asteroids only
	return (L % 5==0);
}

function fuseeHit(hurt) {
	if (Date.now() - fuseeShieldStart > 1000 * shieldDuration || hurt < 0) //exception : on peut choper les carottes malgré le bouclier
		fuseeHitPoints -= hurt;
}

function hexa(nbr) {
	nbr = parseInt(nbr);
	
	if (nbr < 16)
		return "0" + nbr.toString(16);
	else
		return nbr.toString(16);
}

function fuseeFightY() {
	return canvasMaxY - 150;
}

document.addEventListener('keydown', function(event) {
	
	if (pause) {
		pause = false;
		window.requestAnimationFrame(draw);
	}
	
	if (showInfosScreen) {
		showInfosScreen = false;
		showSplashScreen = true;
	}

	validationEcrans(event.keyCode);
	
	if(event.keyCode==32  && gamePlaying && !timeLevelCompleted)  // space bar
		shoot();

	if(event.keyCode==37) // left arrow
		if (!timeLevelCompleted) {
			goLeft=true;
			goRight=false;			
			
			if (sndEngine.currentTime==0) 
				playSound(sndEngine);

		}	
	if(event.keyCode==39) // right arrow
		if (!timeLevelCompleted) {
			goLeft=false;
			goRight=true;
			
			if (sndEngine.currentTime==0)
				playSound(sndEngine);
		}
	
	if(event.keyCode==67) { // C = cadeau
		//cad.ajout();
	}

	if(event.keyCode==80)  // P = pause
		pause = true;
	
	if(event.keyCode==83)  // S = toggle sound
		mute = !mute;
		
	if(event.keyCode==107 && volume<=0.9)  // + = son + fort
		volume = (parseFloat(volume)+0.1).toFixed(1);
		
	if(event.keyCode==109 && volume>=0.1)  // - = son moins fort 
		volume = (volume-0.1).toFixed(1);

});

document.addEventListener('keyup', function(event) {
	
	if(event.keyCode==37) { // left arrow
		goLeft=false;
		stopSound(sndEngine);
	}
	
	if(event.keyCode==39) {  // right arrow
		goRight=false;
		stopSound(sndEngine);
	}
});

function validationEcrans(keyCode) {

	if (gameOver && Date.now() - timeGameOver > 4000) {
		showSplashScreen();
		gameOver = false;
	}
	else if (showSplashScreen) 
		if (keyCode == 73) // I = infos
			showInfosScreen=true;
			
		if (showSplashScreen && (keyCode >= 97 && keyCode <= 99)) {
			// 1-2-3 => type of user ship
			fuseeType = keyCode - 96;
			newGame();
		}
	else if (gamePlaying && readyForNextLevel) 
		newLevel();
}
	
function largeurFusee() {
	
	if (fuseeType==1)
		return 90; //tintin
	if (fuseeType==2)
		return 93; //atlantis
	if (fuseeType==3)
		return 160; //falcon
}

function hauteurFusee() {
	
	if (fuseeType==1)
		return 139;
	else if (fuseeType==2)
		return 170; 
	else if (fuseeType==3)
		return 125; 
}
