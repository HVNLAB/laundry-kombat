'use strict';
// Character art drawn with canvas shapes: washer, granny (and KO pose), turbo dachshund.

// ---------- drawing: WASHER ----------
function drawWasher(f){
  ctx.save();
  var hop=0;
  if((game.phase==='roundEnd'||game.phase==='matchEnd') && f===game.koWinner && f.state!=='ko'){
    hop=-Math.abs(Math.sin(gFrame*0.18))*16;
  }
  ctx.translate(f.x, f.y+hop);
  ctx.scale(2.8,2.8);
  var airH=clamp((GROUND-f.y)/260,0,1);
  ctx.fillStyle='rgba(0,0,0,0.18)';
  ctx.globalAlpha=1-airH*0.6;
  ctx.beginPath(); ctx.ellipse(0,(GROUND-f.y)/2.8+2,46*(1-airH*0.35),9*(1-airH*0.35),0,0,7); ctx.fill();
  ctx.globalAlpha=1;
  var rot=0;
  if(f.state==='ko'){ rot=f.facing===1?1.45:-1.45; }
  else if(f.state==='attack' && f.attackType==='heavy'){ rot=Math.sin(f.t*0.85)*0.15; }
  else if(f.state==='hit'){ rot=-f.facing*0.1; }
  ctx.translate(0,-46); ctx.rotate(rot); ctx.translate(0,46);
  if(f.state==='ko'){
    ctx.translate(f.facing*10,0);
    ctx.fillStyle='rgba(140,205,255,0.55)';
    ctx.beginPath(); ctx.ellipse(0,0,54,10,0,0,7); ctx.fill();
    drawSock(-34,-10,9,'#ffffff');
    drawSock(32,-14,9,'#ffd1dc');
  }
  // body
  ctx.lineWidth=3; ctx.strokeStyle='#8fa3b8';
  var grad=ctx.createLinearGradient(-38,-92,38,0);
  grad.addColorStop(0,'#f4f7fa'); grad.addColorStop(1,'#d7dde4');
  ctx.fillStyle=grad; roundRect(-38,-92,76,92,10); ctx.fill(); ctx.stroke();
  // panel with the "face"
  ctx.fillStyle='#c6d0da'; roundRect(-31,-86,62,15,5); ctx.fill();
  var ex=f.facing*8, ey=-78;
  if(blinking(57,230)){
    ctx.strokeStyle='#233'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(ex-11,ey); ctx.lineTo(ex-3,ey);
    ctx.moveTo(ex+3,ey); ctx.lineTo(ex+11,ey);
    ctx.stroke();
  } else {
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(ex-7,ey,4.5,0,7); ctx.arc(ex+7,ey,4.5,0,7); ctx.fill();
    ctx.fillStyle='#233';
    ctx.beginPath(); ctx.arc(ex-7+f.facing*1.8,ey,2,0,7); ctx.arc(ex+7+f.facing*1.8,ey,2,0,7); ctx.fill();
  }
  ctx.strokeStyle='#233'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(ex-11,ey-8); ctx.lineTo(ex-3,ey-5); ctx.moveTo(ex+11,ey-8); ctx.lineTo(ex+3,ey-5); ctx.stroke();
  ctx.fillStyle='#90a0b0'; ctx.beginPath(); ctx.arc(-f.facing*24,ey,4,0,7); ctx.fill();
  // round drum door
  var px=f.facing*15, py=-48, pr=21;
  ctx.fillStyle='#2b3a46'; ctx.beginPath(); ctx.arc(px,py,pr-3,0,7); ctx.fill();
  drawSock(px-2,py+3,7,'#ffffff');
  var doorOpen=0;
  if(f.state==='attack' && f.attackType==='light'){
    var a=ATTACKS.pLight, span=a.startup+a.active;
    var prog=clamp(f.t/span,0,1);
    doorOpen=Math.sin(prog*Math.PI);
  }
  if(doorOpen>0.05 || f.state==='ko'){
    var dx=px+f.facing*pr*1.5, dy=py-2;
    ctx.strokeStyle='#aebccb'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.arc(dx,dy,pr-1,0,7); ctx.stroke();
    ctx.fillStyle='rgba(190,225,250,0.75)';
    ctx.beginPath(); ctx.arc(dx,dy,pr-4,0,7); ctx.fill();
    ctx.fillStyle='#8fa3b8'; ctx.beginPath(); ctx.arc(dx+f.facing*(pr-6),dy,3.5,0,7); ctx.fill();
    if(doorOpen>0.05){
      ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=3;
      for(var s2=0;s2<3;s2++){
        ctx.beginPath();
        if(f.facing===1){ ctx.arc(px,py,pr+6+s2*7,-0.9,0.5); }
        else { ctx.arc(px,py,pr+6+s2*7,Math.PI-0.5,Math.PI+0.9); }
        ctx.stroke();
      }
    }
  } else {
    ctx.strokeStyle='#aebccb'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.arc(px,py,pr,0,7); ctx.stroke();
    ctx.fillStyle='rgba(180,220,250,0.5)';
    ctx.beginPath(); ctx.arc(px,py,pr-4,0,7); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.65)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(px-5,py-5,8,-2.2,-1.1); ctx.stroke();
  }
  // little feet
  ctx.fillStyle='#5d6b78'; ctx.fillRect(-26,-4,14,6); ctx.fillRect(12,-4,14,6);
  // hit flash
  if(f.flash>0){
    ctx.fillStyle='rgba(255,255,255,'+(f.flash/6*0.55)+')';
    roundRect(-38,-92,76,92,10); ctx.fill();
  }
  ctx.restore();
}

// ---------- drawing: GRANNY ----------
function drawGrandma(f){
  ctx.save();
  var hop=0;
  if((game.phase==='roundEnd'||game.phase==='matchEnd') && f===game.koWinner && f.state!=='ko'){
    hop=-Math.abs(Math.sin(gFrame*0.18))*16;
  }
  ctx.translate(f.x, f.y+hop);
  ctx.scale(2.8,2.8);
  var airH=clamp((GROUND-f.y)/260,0,1);
  ctx.fillStyle='rgba(0,0,0,0.18)';
  ctx.globalAlpha=1-airH*0.6;
  ctx.beginPath(); ctx.ellipse(0,(GROUND-f.y)/2.8+2,30*(1-airH*0.35),8*(1-airH*0.35),0,0,7); ctx.fill();
  ctx.globalAlpha=1;
  var lean=0;
  if(f.state==='hit') lean=-f.facing*0.18;
  else if(f.state==='walk') lean=f.facing*0.05;
  ctx.rotate(lean);
  if(f.state==='ko'){ drawGrandmaKO(f); ctx.restore(); return; }
  var bob = f.state==='walk' ? Math.sin(f.t*0.3)*2 : (f.state==='idle'?Math.sin(gFrame*0.05)*1.2:0);
  if(f.peeing){ bob=6; }
  ctx.translate(0,bob);
  // shoes
  ctx.fillStyle='#4a3a33';
  ctx.beginPath(); ctx.ellipse(-8,0,7,4,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(9,0,7,4,0,0,7); ctx.fill();
  // dress
  ctx.fillStyle='#5c6bc0';
  ctx.beginPath();
  ctx.moveTo(-15,-46); ctx.quadraticCurveTo(0,-52,15,-46);
  ctx.lineTo(26,-2); ctx.quadraticCurveTo(0,4,-26,-2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle='#c5cae9';
  var dots=[[-10,-30],[3,-38],[12,-24],[-2,-16],[10,-8],[-16,-12]];
  for(var di=0;di<dots.length;di++){
    ctx.beginPath(); ctx.arc(dots[di][0],dots[di][1],2,0,7); ctx.fill();
  }
  // broom — angle depends on state
  var angle=-0.35+Math.sin(gFrame*0.05)*0.04;
  if(f.state==='block') angle=-1.25;
  if(f.state==='attack' && f.attackType){
    var a=atkDef(f), span=a.startup+a.active;
    if(f.t<span){
      var p=f.t/span;
      var s0 = f.attackType==='light' ? -1.15 : -1.9;
      var s1 = f.attackType==='light' ? 0.75 : 0.95;
      angle=lerp(s0,s1,easeOut(p));
    } else {
      var rp=clamp((f.t-span)/a.recovery,0,1);
      var end = f.attackType==='light' ? 0.75 : 0.95;
      angle=lerp(end,-0.35,easeOut(rp));
    }
  }
  if(f.state==='hit') angle=0.9;
  if(f.peeing) angle=-1.3;
  var dx=Math.cos(angle)*f.facing, dy=Math.sin(angle);
  var grip={x:f.facing*20, y:-48};
  // arms
  ctx.strokeStyle='#e8b98c'; ctx.lineWidth=5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-6,-44); ctx.lineTo(grip.x,grip.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4,-42); ctx.lineTo(grip.x+dx*16,grip.y+dy*16); ctx.stroke();
  // broom handle
  ctx.strokeStyle='#9c6b3f'; ctx.lineWidth=5;
  ctx.beginPath(); ctx.moveTo(grip.x-dx*12,grip.y-dy*12); ctx.lineTo(grip.x+dx*62,grip.y+dy*62); ctx.stroke();
  // bristles
  var bx=grip.x+dx*62, by=grip.y+dy*62;
  ctx.fillStyle='#e2b93b';
  ctx.beginPath();
  ctx.moveTo(bx,by);
  ctx.lineTo(bx+dx*24-dy*9, by+dy*24+dx*9);
  ctx.lineTo(bx+dx*24+dy*9, by+dy*24-dx*9);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#c99f2e'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+dx*22,by+dy*22); ctx.stroke();
  // head
  var hy=-62;
  ctx.fillStyle='#cfd5da'; ctx.beginPath(); ctx.arc(-f.facing*14,hy-4,8,0,7); ctx.fill(); // bun (grey) // kok
  ctx.fillStyle='#f2cfa4'; ctx.beginPath(); ctx.arc(0,hy,15,0,7); ctx.fill();
  // grey hair on the sides
  ctx.fillStyle='#cfd5da';
  ctx.beginPath(); ctx.arc(-12,hy+2,5,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(12,hy+2,5,0,7); ctx.fill();
  // headscarf
  ctx.fillStyle='#d94f4f';
  ctx.beginPath();
  ctx.moveTo(-15,hy-2); ctx.quadraticCurveTo(0,hy-19,15,hy-2);
  ctx.quadraticCurveTo(0,hy-8,-15,hy-2);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(-f.facing*13,hy-1,4,0,7); ctx.fill();
  var fl2=Math.sin(gFrame*0.12)*4;
  ctx.strokeStyle='#d94f4f'; ctx.lineWidth=4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-f.facing*15,hy); ctx.lineTo(-f.facing*26,hy+2+fl2); ctx.stroke();
  // face (profile)
  if(f.peeing){
    ctx.strokeStyle='#333333'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(f.facing*7,hy-4,4,0.2,Math.PI-0.2); ctx.stroke();
    ctx.strokeStyle='#a05a3c';
    ctx.beginPath(); ctx.arc(f.facing*8,hy+5,4,0.3,2.7); ctx.stroke();
  } else {
    if(blinking(131,190)){
      ctx.strokeStyle='#333333'; ctx.lineWidth=2; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(f.facing*3,hy-3); ctx.lineTo(f.facing*11,hy-3); ctx.stroke();
    } else {
      ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(f.facing*7,hy-3,4.5,0,7); ctx.fill();
      ctx.fillStyle='#333333'; ctx.beginPath(); ctx.arc(f.facing*7+f.facing*1.8,hy-3,2,0,7); ctx.fill();
    }
    ctx.strokeStyle='#666666'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(f.facing*7,hy-3,6,0,7); ctx.stroke(); // glasses
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(f.facing*3,hy-9); ctx.lineTo(f.facing*11,hy-7); ctx.stroke(); // angry brow
    ctx.fillStyle='rgba(230,120,120,0.4)'; ctx.beginPath(); ctx.arc(f.facing*11,hy+2,3.5,0,7); ctx.fill();
    ctx.strokeStyle='#a05a3c'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(f.facing*5,hy+7); ctx.lineTo(f.facing*10,hy+6); ctx.stroke(); // mouth
  }
  // hit flash
  if(f.flash>0){
    ctx.fillStyle='rgba(255,255,255,'+(f.flash/6*0.5)+')';
    ctx.beginPath(); ctx.arc(0,-50,34,0,7); ctx.fill();
  }
  ctx.restore();
}
function drawGrandmaKO(f){
  ctx.fillStyle='#5c6bc0';
  ctx.beginPath(); ctx.ellipse(0,-16,26,17,0,0,7); ctx.fill();
  var hy=-44;
  ctx.fillStyle='#f2cfa4'; ctx.beginPath(); ctx.arc(0,hy,15,0,7); ctx.fill();
  ctx.fillStyle='#d94f4f';
  ctx.beginPath();
  ctx.moveTo(-15,hy-2); ctx.quadraticCurveTo(0,hy-18,15,hy-2);
  ctx.quadraticCurveTo(0,hy-7,-15,hy-2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle='#cfd5da'; ctx.beginPath(); ctx.arc(-16,hy+2,7,0,7); ctx.fill();
  ctx.strokeStyle='#333333'; ctx.lineWidth=2;
  var eyes=[[-6,hy-3],[6,hy-3]];
  for(var i=0;i<eyes.length;i++){
    ctx.beginPath();
    ctx.moveTo(eyes[i][0]-3,eyes[i][1]-3); ctx.lineTo(eyes[i][0]+3,eyes[i][1]+3);
    ctx.moveTo(eyes[i][0]+3,eyes[i][1]-3); ctx.lineTo(eyes[i][0]-3,eyes[i][1]+3);
    ctx.stroke();
  }
  ctx.save(); ctx.translate(-f.facing*40,2); ctx.rotate(f.facing*0.06);
  ctx.strokeStyle='#9c6b3f'; ctx.lineWidth=5;
  ctx.beginPath(); ctx.moveTo(-40,0); ctx.lineTo(30,0); ctx.stroke();
  ctx.fillStyle='#e2b93b';
  ctx.beginPath(); ctx.moveTo(30,0); ctx.lineTo(48,-8); ctx.lineTo(48,8); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ---------- drawing: TURBO DACHSHUND ----------
function drawDog(d){
  ctx.save();
  ctx.translate(d.x, GROUND);
  ctx.scale(d.dir*1.5,1.5);
  ctx.fillStyle='rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(0,2,34,7,0,0,7); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=3; ctx.lineCap='round';
  for(var i=1;i<=3;i++){
    ctx.beginPath(); ctx.moveTo(-34-i*12, -14-i*7); ctx.lineTo(-56-i*12, -14-i*7); ctx.stroke();
  }
  ctx.strokeStyle='#7a4a21'; ctx.lineWidth=5; ctx.lineCap='round';
  for(var l=0;l<4;l++){
    var lx=-22+l*14;
    var ph=Math.sin(gFrame*0.9+l*1.6)*7;
    ctx.beginPath(); ctx.moveTo(lx,-10); ctx.lineTo(lx+ph,0); ctx.stroke();
  }
  ctx.fillStyle='#9c6127';
  ctx.beginPath(); ctx.ellipse(-2,-16,32,11,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(30,-22,10,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(40,-20,7,5,0,0,7); ctx.fill();
  ctx.fillStyle='#7a4a21';
  ctx.beginPath(); ctx.ellipse(26,-30,4,7,Math.sin(gFrame*0.8)*0.3,0,7); ctx.fill();
  if(blinking(23,150)){
    ctx.strokeStyle='#000000'; ctx.lineWidth=1.5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(29,-25); ctx.lineTo(35,-25); ctx.stroke();
  } else {
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(32,-25,3,0,7); ctx.fill();
    ctx.fillStyle='#000000'; ctx.beginPath(); ctx.arc(33,-25,1.5,0,7); ctx.fill();
  }
  ctx.strokeStyle='#9c6127'; ctx.lineWidth=5;
  ctx.beginPath(); ctx.moveTo(-32,-18);
  ctx.quadraticCurveTo(-42,-26+Math.sin(gFrame*0.8)*4,-48,-20); ctx.stroke();
  ctx.strokeStyle='#e23b3b'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(22,-16); ctx.lineTo(29,-14); ctx.stroke();
  ctx.restore();
}