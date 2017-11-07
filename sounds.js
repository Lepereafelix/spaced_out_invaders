
var volume = 0.3;
var sndUfoShoot = [new Audio("ufo_shoot1.wav"), new Audio("ufo_shoot2.wav"), new Audio("ufo_shoot3.wav"), new Audio("ufo_shoot4.wav")]; 
var sndUfoHit = new Audio("ufo_hit.wav"); 
var sndCarrot = new Audio("carrot.wav"); 
var sndUfoDead = new Audio("ufo_dead.mp3"); 
var sndRainbowGun = new Audio("gun_rainbow.wav"); 
var sndAstExplosion = new Audio("ast_explosion.mp3"); 
var sndGotPresent = new Audio("got_present.mp3"); 
var sndBomb = new Audio("bomb.wav"); 
var sndBombIntercept = new Audio("bomb2.wav"); 
var sndSimpleGun = new Audio("gun.wav"); 
var sndLaser = new Audio("gun_laser.wav"); 
var sndMegabomb = new Audio("megabomb.wav"); 
var sndRainbowGun1 = new Audio("gun_rainbow.wav"); 
var sndHeatseeker = new Audio("gun_heatseeker.wav"); 
var sndIncomingBoss = new Audio("incoming_boss.wav"); 
var sndBossShoot= new Audio("boss_shoot.wav"); 
var sndBossDead = new Audio("boss_dead.wav"); 
var sndThrottle = new Audio("throttle.wav"); 
var sndEngine = new Audio("engine.wav"); 

function playSound(leSon) {
	if (!mute) {
		leSon.volume = volume;
		//leSon.pause();
		leSon.currentTime = 0;
		leSon.play();
	}
}
function stopSound(leSon) {
	leSon.pause();
	leSon.currentTime=0;
}