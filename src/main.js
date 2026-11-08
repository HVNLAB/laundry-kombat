'use strict';
// The conductor: game state, fighters, round flow, 60 Hz step/render loop.

var dog=null, flyover=null, flyTimer=380;
var game={phase:'title', mode:'ai', round:1, timer:0, koWinner:null};
var f1=new Fighter('pralka',260,1);
var f2=new Fighter('babcia',700,-1);
f1.opp=f2; f2.opp=f1;
var gFrame=0, hitstop=0, shake=0;
var particles=[], floaters=[];

// ---------- game phases ----------
function startRound(){
  f1.reset(260,1); f2.reset(700,-1);
  particles=[]; floaters=[]; dog=null;
}
function matchStart(){
  f1.wins=0; f2.wins=0; game.round=1;
  startRound();
  game.phase='intro'; game.timer=95;
  sfx.bell();
}
function onKO(winner,loser){
  game.phase='ko'; game.timer=85; game.koWinner=winner;
  shake=14; dog=null;
  floaters.push({x:(winner.x+loser.x)/2, y:210, vy:-0.3, life:85, text:'K.O.!', color:'#ff3b3b', big:true});
}
function step(){
  gFrame++;
  updateFx();
  // flying cow chased by the HVNLAB rocket
  if(!flyover){
    flyTimer--;
    if(flyTimer<=0){
      var fd=Math.random()<0.5?1:-1;
      flyover={x: fd===1?-730:W+730, y:rnd(100,180), dir:fd, vx:fd*4.5};
      flyTimer=Math.floor(rnd(500,1100));
      sfx.moo();
    }
  } else {
    flyover.x+=flyover.vx;
    if((flyover.dir===1 && flyover.x>W+720) || (flyover.dir===-1 && flyover.x<-720)){ flyover=null; }
  }
  // HEAVY METAL in the background
  if(actx && audioOn){
    musicFrame++;
    if(musicFrame>=7){ musicFrame=0; musicTick(); }
  }
  if(hitstop>0){ hitstop--; return; }
  var ph=game.phase;
  if(ph==='title'){
    f1.update(IDLE_INP); f2.update(IDLE_INP);
    if(pressed['1']){ game.mode='ai'; matchStart(); }
    else if(pressed['2']){ game.mode='2p'; matchStart(); }
  } else if(ph==='intro'){
    f1.update(IDLE_INP); f2.update(IDLE_INP);
    game.timer--;
    if(game.timer===35){ sfx.go(); }
    if(game.timer<=0){ game.phase='fight'; }
  } else if(ph==='fight'){
    var in1=humanInput(P1MAP);
    var in2=(game.mode==='ai') ? aiInput() : humanInput(P2MAP);
    f1.update(in1); f2.update(in2);
    resolveHits();
    pushApart();
    // turbo dachshund running
    if(dog){
      dog.x+=dog.vx; dog.life--;
      if(gFrame%32===0){ sfx.bark(); }
      if(!dog.bitten && f2.state!=='hit' && f2.state!=='ko'){
        var dbb=f2.bodyBox();
        if(dog.x>dbb.x-16 && dog.x<dbb.x+dbb.w+16){
          dog.bitten=true;
          var dres=f2.hurt(14,6,0,18,false);
          hitstop=5; shake=Math.max(shake,5);
          synthAua(false);
          sfx.bark();
          spawnSparks((dog.x+f2.x)/2, f2.y-60, '#ffe066', 8);
          floaters.push({x:f2.x, y:f2.y-f2.height-46, vy:-1.6, life:40,
            text:'WOOF! GRR!', color:'#ffd97a', shout:true, big:false});
          if(dres==='ko'){ onKO(f1,f2); }
        }
      }
      if(dog && (dog.life<=0 || dog.x<-70 || dog.x>W+70)){ dog=null; }
    }
    // stream to the potty
    if(f2.peeing && gFrame%2===0){
      particles.push({x:f2.x+f2.facing*6, y:f2.y-10,
        vx:clamp((NOCNIK_X-f2.x)*0.10,-5,5), vy:rnd(-0.5,0.5),
        life:14, color:'#ffe36a', size:2.5});
    }
    // water from the faucet
    if(f1.tapping && gFrame%3===0){
      particles.push({x:KRAN_X+24, y:GROUND-74, vx:1.2, vy:rnd(-1,0.5),
        life:12, color:'#7ec8f5', size:2.5});
    }
    // foam during the spin cycle
    if(f1.state==='attack' && f1.attackType==='heavy'){
      var pa=ATTACKS.pHeavy;
      if(f1.t>pa.startup && f1.t<=pa.startup+pa.active && gFrame%2===0){
        spawnFoam(f1.x+rnd(-48,48), f1.y-rnd(40,125), 3);
      }
    }
  } else if(ph==='ko'){
    f1.update(IDLE_INP); f2.update(IDLE_INP);
    game.timer--;
    if(game.timer<=0){
      game.koWinner.wins++;
      if(game.koWinner.wins>=2){ game.phase='matchEnd'; }
      else { game.phase='roundEnd'; game.timer=130; }
    }
  } else if(ph==='roundEnd'){
    f1.update(IDLE_INP); f2.update(IDLE_INP);
    game.timer--;
    if(game.timer<=0){ game.round++; startRound(); game.phase='intro'; game.timer=95; sfx.bell(); }
  } else if(ph==='matchEnd'){
    f1.update(IDLE_INP); f2.update(IDLE_INP);
    if(pressed['r']){ matchStart(); }
    else if(pressed['enter']){ startRound(); game.phase='title'; }
  }
  for(var k in pressed){ pressed[k]=false; }
}

// ---------- render ----------
function render(){
  ctx.save();
  ctx.clearRect(0,0,W,H);
  var sx=shake>0?rnd(-shake,shake):0, sy=shake>0?rnd(-shake,shake)*0.6:0;
  ctx.translate(sx,sy);
  drawBackground();
  drawFlyover();
  if(f1.tapping){ drawHose(); }
  drawGrandma(f2);
  drawWasher(f1);
  if(dog){ drawDog(dog); }
  drawParticles();
  drawFloaters();
  ctx.restore();
  drawHUD();
  drawOverlays();
  drawTouchUI();
  if(shake>0){ shake*=0.86; if(shake<0.4) shake=0; }
}

// ---------- loop (fixed 60 Hz step) ----------
var last=performance.now(), acc=0;
function frame(now){
  acc+=Math.min(50,now-last);
  last=now;
  while(acc>=16.667){ step(); acc-=16.667; }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);