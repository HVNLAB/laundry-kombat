'use strict';
// Scenery: sky, smoking sun, flying cow chased by the HVNLAB rocket, faucet hose.

// ---------- background ----------
function drawBackground(){
  var g=ctx.createLinearGradient(0,0,0,GROUND);
  g.addColorStop(0,'#8ed0f5'); g.addColorStop(1,'#dff2e6');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,GROUND);
  // sun — smiling, with a cigarette
  ctx.fillStyle='#ffd93d';
  ctx.beginPath(); ctx.arc(120,80,34,0,7); ctx.fill();
  ctx.fillStyle='rgba(255,217,61,0.35)';
  ctx.beginPath(); ctx.arc(120,80,48,0,7); ctx.fill();
  // rays
  ctx.strokeStyle='#ffd93d'; ctx.lineWidth=4; ctx.lineCap='round';
  for(var rr=0;rr<8;rr++){
    var ang=rr*Math.PI/4+Math.sin(gFrame*0.02)*0.1;
    ctx.beginPath();
    ctx.moveTo(120+Math.cos(ang)*52,80+Math.sin(ang)*52);
    ctx.lineTo(120+Math.cos(ang)*62,80+Math.sin(ang)*62);
    ctx.stroke();
  }
  // eyes (random blink)
  ctx.strokeStyle='#a8781c'; ctx.lineWidth=3; ctx.lineCap='round';
  if(blinking(11,260)){
    ctx.beginPath(); ctx.arc(110,74,5,0.15,Math.PI-0.15); ctx.stroke();
    ctx.beginPath(); ctx.arc(132,74,5,0.15,Math.PI-0.15); ctx.stroke();
  } else {
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(110,74,4.5,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(132,74,4.5,0,7); ctx.fill();
    ctx.fillStyle='#7a5c1e';
    ctx.beginPath(); ctx.arc(110,75,2,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(132,75,2,0,7); ctx.fill();
  }
  // smile
  ctx.beginPath(); ctx.arc(121,86,11,0.25,Math.PI-0.25); ctx.stroke();
  // cigarette — in the corner of the mouth
  ctx.save();
  ctx.translate(132,89);
  ctx.rotate(-0.12);
  ctx.fillStyle='#f4f4f4'; ctx.fillRect(0,-3,20,7);
  ctx.fillStyle='#ff6b2e'; ctx.fillRect(18,-3,5,7);
  // smoke
  ctx.fillStyle='rgba(200,200,200,0.5)';
  for(var sm=0;sm<3;sm++){
    var sph=(gFrame*0.02+sm*0.33)%1;
    ctx.beginPath();
    ctx.arc(21+sph*9, -6-sph*24+Math.sin(gFrame*0.1+sm)*2, 3+sph*4, 0, 7);
    ctx.fill();
  }
  ctx.restore();
  // clouds
  ctx.fillStyle='rgba(255,255,255,0.92)';
  [[250,72],[600,110],[790,58]].forEach(function(c){
    ctx.beginPath();
    ctx.arc(c[0],c[1],18,0,7); ctx.arc(c[0]+20,c[1]-6,14,0,7); ctx.arc(c[0]+38,c[1],16,0,7);
    ctx.fill();
  });
  // fence
  ctx.fillStyle='#c9a06a';
  for(var x=-6;x<W;x+=36){ ctx.fillRect(x,414,28,56); }
  ctx.fillStyle='#b58a55'; ctx.fillRect(0,426,W,8); ctx.fillRect(0,452,W,8);
  // washing line
  ctx.strokeStyle='#8a6a4a'; ctx.lineWidth=6;
  ctx.beginPath(); ctx.moveTo(70,470); ctx.lineTo(70,296); ctx.moveTo(890,470); ctx.lineTo(890,296); ctx.stroke();
  ctx.strokeStyle='rgba(70,70,70,0.55)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(70,302); ctx.lineTo(890,302); ctx.stroke();
  var items=[[180,'shirt','#ff8fa3'],[300,'towel','#7ad0ff'],[430,'sock','#ffd93d'],[560,'shirt','#a5d86e'],[690,'towel','#d9a5ff'],[800,'sock','#ff9f6e']];
  for(var i=0;i<items.length;i++){
    var it=items[i];
    var sway=Math.sin(gFrame*0.02+i)*0.1;
    ctx.save(); ctx.translate(it[0],302); ctx.rotate(sway);
    if(it[1]==='shirt'){
      ctx.fillStyle=it[2]; roundRect(-16,0,32,34,6); ctx.fill();
      ctx.fillRect(-24,2,8,14); ctx.fillRect(16,2,8,14);
    } else if(it[1]==='towel'){
      ctx.fillStyle=it[2]; roundRect(-15,0,30,42,5); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(-15,10,30,5);
    } else {
      drawSock(0,14,12,it[2]);
    }
    ctx.restore();
  }
  // grass
  ctx.fillStyle='#7cc26a'; ctx.fillRect(0,GROUND,W,H-GROUND);
  ctx.fillStyle='#68ad58';
  for(var gx=0;gx<W;gx+=28){
    ctx.beginPath(); ctx.moveTo(gx,GROUND+8); ctx.lineTo(gx+4,GROUND); ctx.lineTo(gx+8,GROUND+8); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle='rgba(0,0,0,0.12)'; ctx.fillRect(0,GROUND,W,3);
  // granny's potty
  ctx.save(); ctx.translate(NOCNIK_X, GROUND);
  ctx.fillStyle='#f2f6fa'; ctx.strokeStyle='#9db2c4'; ctx.lineWidth=2.5;
  roundRect(-30,-44,60,44,10); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#5b8db8'; ctx.lineWidth=3.5;
  ctx.beginPath(); ctx.moveTo(-30,-38); ctx.lineTo(30,-38); ctx.stroke();
  ctx.strokeStyle='#9db2c4'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(-33,-26,5,-1.2,1.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(33,-26,5,Math.PI-1.2,Math.PI+1.2); ctx.stroke();
  ctx.font='900 10px system-ui,sans-serif'; ctx.textAlign='center';
  ctx.fillStyle='#5b8db8';
  ctx.fillText('POTTY',0,-12);
  ctx.restore();
  // faucet for the washer
  ctx.save(); ctx.translate(KRAN_X, GROUND);
  ctx.fillStyle='#8b95a3'; ctx.fillRect(-6,-70,12,70);
  ctx.fillStyle='#b9c4cf'; roundRect(-10,-84,20,16,4); ctx.fill();
  ctx.strokeStyle='#5b8db8'; ctx.lineWidth=5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(0,-84); ctx.lineTo(0,-94); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-9,-94); ctx.lineTo(9,-94); ctx.stroke();
  ctx.strokeStyle='#b9c4cf'; ctx.lineWidth=7;
  ctx.beginPath(); ctx.moveTo(10,-78); ctx.lineTo(22,-78); ctx.stroke();
  ctx.fillStyle='#7ec8f5'; ctx.beginPath(); ctx.ellipse(24,-78,4,3,0,0,7); ctx.fill();
  ctx.restore();
}

// ---------- drawing: flying cow + HVNLAB rocket ----------
function drawFlyover(){
  if(!flyover) return;
  drawRocket(flyover.x - flyover.dir*400, flyover.y+20, flyover.dir);
  var x=flyover.x, y=flyover.y, d=flyover.dir;
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(d*3,3);
  var flap=Math.sin(gFrame*0.25);
  ctx.fillStyle='#ffffff'; ctx.strokeStyle='#c8d2dc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-4,-8); ctx.lineTo(-26,-30-flap*10); ctx.lineTo(2,-12); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6,-8); ctx.lineTo(28,-28+flap*10); ctx.lineTo(12,-11); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#e8e2d8'; ctx.lineWidth=4; ctx.lineCap='round';
  var kick=Math.sin(gFrame*0.3);
  ctx.beginPath(); ctx.moveTo(-16,-2); ctx.lineTo(-18,10+kick*3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8,-2); ctx.lineTo(-5,10-kick*3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10,-2); ctx.lineTo(13,10+kick*3); ctx.stroke();
  ctx.fillStyle='#ffffff'; ctx.strokeStyle='#b9c4cf'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(-4,-12,30,16,0,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#2f2f2f';
  ctx.beginPath(); ctx.ellipse(-14,-16,8,6,0.3,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4,-8,7,5,-0.4,0,7); ctx.fill();
  ctx.fillStyle='#f2a9c4'; ctx.beginPath(); ctx.ellipse(-20,0,6,5,0,0,7); ctx.fill();
  // milk dripping from the udder
  ctx.fillStyle='#ffffff';
  ctx.beginPath(); ctx.ellipse(-24,5,1.6,2.5,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-16,5,1.6,2.5,0,0,7); ctx.fill();
  for(var mk=0;mk<2;mk++){
    var mp=(gFrame*0.05+mk*0.5)%1;
    ctx.globalAlpha=1-mp;
    ctx.beginPath(); ctx.arc(mk===0?-24:-16, 8+mp*26, 2.5, 0, 7); ctx.fill();
    ctx.globalAlpha=1;
  }
  ctx.fillStyle='#ffffff'; ctx.strokeStyle='#b9c4cf'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(28,-18,11,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#f2a9c4'; ctx.beginPath(); ctx.ellipse(36,-15,5,4,0,0,7); ctx.fill();
  ctx.strokeStyle='#cfd8e3'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(24,-27); ctx.lineTo(20,-33); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(31,-27); ctx.lineTo(33,-33); ctx.stroke();
  if(blinking(89,170)){
    ctx.strokeStyle='#000000'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(24.5,-20); ctx.lineTo(31.5,-20); ctx.stroke();
  } else {
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(28,-20,3.5,0,7); ctx.fill();
    ctx.fillStyle='#000000'; ctx.beginPath(); ctx.arc(29.5,-20,1.8,0,7); ctx.fill();
  }
  ctx.restore();
}
function drawRocket(x,y,d){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(d*3,3);
  var fl=8+Math.sin(gFrame*0.6)*5;
  ctx.fillStyle='#ff9d2e';
  ctx.beginPath(); ctx.moveTo(-38,-6); ctx.lineTo(-38-fl*1.6,0); ctx.lineTo(-38,6); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#ffe066';
  ctx.beginPath(); ctx.moveTo(-38,-3); ctx.lineTo(-38-fl,0); ctx.lineTo(-38,3); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#f4f7fa'; ctx.strokeStyle='#9db2c4'; ctx.lineWidth=2;
  roundRect(-38,-10,76,20,6); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#d94f4f';
  ctx.beginPath(); ctx.moveTo(38,-10); ctx.lineTo(50,0); ctx.lineTo(38,10); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30,-10); ctx.lineTo(-40,-18); ctx.lineTo(-34,0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30,10); ctx.lineTo(-40,18); ctx.lineTo(-34,0); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#9ed7f2'; ctx.strokeStyle='#5b8db8'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(18,0,5,0,7); ctx.fill(); ctx.stroke();
  // label — flipped back so it stays readable when flying left
  ctx.save();
  ctx.scale(d,1);
  ctx.fillStyle='#0a2540'; ctx.font='900 8px system-ui,sans-serif'; ctx.textAlign='center';
  ctx.fillText('HVNLAB',-8,3);
  ctx.restore();
  ctx.restore();
}

// ---------- hose connecting the washer to the faucet ----------
function drawHose(){
  ctx.strokeStyle='#4aa3d8'; ctx.lineWidth=6; ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(KRAN_X+22, GROUND-78);
  ctx.quadraticCurveTo((KRAN_X+f1.x)/2, GROUND-24, f1.x, GROUND-64);
  ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(KRAN_X+22, GROUND-78);
  ctx.quadraticCurveTo((KRAN_X+f1.x)/2, GROUND-24, f1.x, GROUND-64);
  ctx.stroke();
}