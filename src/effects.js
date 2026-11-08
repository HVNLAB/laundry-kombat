'use strict';
// Shared helpers (lerp, clamp, blinking...) + battle FX: sparks, foam, floating texts.

// ---------- helpers ----------
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function easeOut(t){ return 1-Math.pow(1-t,3); }
function blinking(seed,period){ return ((gFrame+seed)%period)<8; }
function rnd(a,b){ return a+Math.random()*(b-a); }
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function drawSock(x,y,s,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(x-s*0.4,y-s);
  ctx.lineTo(x+s*0.5,y-s);
  ctx.lineTo(x+s*0.5,y+s*0.2);
  ctx.lineTo(x+s*1.1,y+s*0.9);
  ctx.lineTo(x+s*0.2,y+s*1.1);
  ctx.lineTo(x-s*0.4,y+s*0.2);
  ctx.closePath(); ctx.fill();
}

// ---------- effects ----------
function spawnSparks(x,y,color,n){
  for(var i=0;i<n;i++){
    particles.push({x:x,y:y,vx:rnd(-4,4),vy:rnd(-4,2),life:rnd(15,30),color:color,size:rnd(2,5)});
  }
}
function spawnFoam(x,y,n){
  for(var i=0;i<n;i++){
    particles.push({x:x,y:y,vx:rnd(-3,3),vy:rnd(-5,-1),life:rnd(20,40),color:'#eaf6ff',size:rnd(3,7)});
  }
}
function updateFx(){
  for(var i=particles.length-1;i>=0;i--){
    var p=particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.18; p.life--;
    if(p.life<=0) particles.splice(i,1);
  }
  for(var j=floaters.length-1;j>=0;j--){
    var fl=floaters[j];
    fl.y+=fl.vy; fl.life--;
    if(fl.life<=0) floaters.splice(j,1);
  }
}

// ---------- effects: drawing ----------
function drawParticles(){
  for(var i=0;i<particles.length;i++){
    var p=particles[i];
    ctx.globalAlpha=clamp(p.life/20,0,1);
    ctx.fillStyle=p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,7); ctx.fill();
  }
  ctx.globalAlpha=1;
}
function drawFloaters(){
  ctx.textAlign='center';
  for(var i=0;i<floaters.length;i++){
    var fl=floaters[i];
    ctx.globalAlpha=clamp(fl.life/30,0,1);
    if(fl.big){
      ctx.font='900 96px system-ui,sans-serif';
      ctx.strokeStyle='#ffffff'; ctx.lineWidth=8;
      ctx.strokeText(fl.text,fl.x,fl.y);
      ctx.fillStyle=fl.color;
      ctx.fillText(fl.text,fl.x,fl.y);
    } else if(fl.shout){
      ctx.font='italic 900 30px system-ui,sans-serif';
      ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.lineWidth=6; ctx.lineJoin='round';
      ctx.strokeText(fl.text,fl.x,fl.y);
      ctx.fillStyle=fl.color;
      ctx.fillText(fl.text,fl.x,fl.y);
    } else {
      ctx.font='900 18px system-ui,sans-serif';
      ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=4;
      ctx.strokeText(fl.text,fl.x,fl.y);
      ctx.fillStyle=fl.color;
      ctx.fillText(fl.text,fl.x,fl.y);
    }
  }
  ctx.globalAlpha=1;
}