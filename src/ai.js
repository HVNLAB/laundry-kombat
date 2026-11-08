'use strict';
// Granny's CPU brain: decides her actions when you play solo.

// ---------- granny AI ----------
var ai={act:'wait', actTimer:0, cool:0, atk:'light'};
function aiInput(){
  var inp={left:false,right:false,jump:false,block:false,light:false,heavy:false,special:false};
  var dist=Math.abs(f1.x-f2.x);
  // dodge the turbo dachshund
  if(dog && f2.onGround && !f2.peeing){
    var toward=(dog.vx>0 && dog.x<f2.x)||(dog.vx<0 && dog.x>f2.x);
    if(toward && Math.abs(dog.x-f2.x)<180 && Math.random()<0.06){ inp.jump=true; }
  }
  // at low health granny heads for the potty
  if(f2.hp<45 && f2.specialCd<=0 && !f2.peeing && ai.act!=='goPee' && Math.random()<0.04){
    ai.act='goPee'; ai.actTimer=90;
  }
  // defensive reaction: when the washer starts an attack up close
  if(ai.act!=='attack' && ai.cool<=0 && f1.state==='attack' && dist<200 && Math.random()<0.035){
    ai.act='block'; ai.actTimer=18;
  }
  ai.actTimer--; ai.cool--;
  if(ai.actTimer<=0){
    if(ai.cool<=0){
      if(dist>230){
        var r1=Math.random();
        ai.act = r1<0.75?'approach':(r1<0.9?'wait':'jumpIn');
      } else {
        var r=Math.random();
        if(r<0.44){ ai.act='attack'; ai.atk=Math.random()<0.7?'light':'heavy'; }
        else if(r<0.6){ ai.act='block'; }
        else if(r<0.72){ ai.act='retreat'; }
        else if(r<0.82){ ai.act='jumpIn'; }
        else { ai.act='approach'; }
      }
      ai.actTimer=Math.floor(rnd(10,26));
      if(ai.act==='attack'){ ai.cool=Math.floor(rnd(32,60)); }
    } else {
      ai.act='wait'; ai.actTimer=10;
    }
  }
  if(ai.act==='approach'){ inp.right=f1.x>f2.x; inp.left=f1.x<f2.x; }
  else if(ai.act==='retreat'){ inp.right=f1.x<f2.x; inp.left=f1.x>f2.x; }
  else if(ai.act==='jumpIn'){ inp.right=f1.x>f2.x; inp.left=f1.x<f2.x; inp.jump=f2.onGround; }
  else if(ai.act==='block'){ inp.block=true; }
  else if(ai.act==='attack'){ inp[ai.atk]=true; ai.act='wait'; ai.actTimer=8; }
  else if(ai.act==='goPee'){
    inp.right=f2.x<NOCNIK_X; inp.left=f2.x>NOCNIK_X;
    if(Math.abs(f2.x-NOCNIK_X)<70){ inp.special=true; ai.act='wait'; ai.actTimer=10; }
    else if(ai.actTimer<=0){ ai.actTimer=60; }
  }
  return inp;
}