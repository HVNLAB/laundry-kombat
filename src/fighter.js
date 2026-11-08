'use strict';
// The Fighter class (shared by washer and granny) + attack collision logic.

function atkDef(f){
  if(!f.attackType) return null;
  if(f.kind==='pralka') return f.attackType==='light'?ATTACKS.pLight:ATTACKS.pHeavy;
  return f.attackType==='light'?ATTACKS.gLight:ATTACKS.gHeavy;
}

// ---------- fighter ----------
function Fighter(kind,x,facing){
  this.kind=kind;
  this.wins=0;
  this.reset(x,facing);
}
Fighter.prototype.reset=function(x,facing){
  this.x=x; this.y=GROUND; this.vx=0; this.vy=0; this.onGround=true;
  this.facing=facing; this.hp=100; this.dispHp=100;
  this.state='idle'; this.t=0; this.attackType=null; this.hitApplied=false;
  this.stun=0; this.flash=0; this.combo=0; this.lastHitAt=-999;
  this.peeing=false; this.peeT=0; this.specialCd=0;
  this.tapping=false; this.tapT=0; this.kranCd=0;
  this.height=this.kind==='pralka'?260:268;
  this.speed=this.kind==='pralka'?3.0:3.8;
  this.jumpV=this.kind==='pralka'?-14:-15;
};
Fighter.prototype.bodyBox=function(){
  var w=this.kind==='pralka'?212:146;
  return {x:this.x-w/2, y:this.y-this.height, w:w, h:this.height};
};
Fighter.prototype.startAttack=function(type){
  if(this.state==='attack'||this.state==='hit'||this.state==='ko'||this.stun>0) return;
  if(!this.onGround) return;
  this.state='attack'; this.attackType=type;
  this.t=0; this.hitApplied=false; this.vx=0;
  sfx.whoosh();
};
Fighter.prototype.doSpecial=function(){
  if(this.specialCd>0 || !this.onGround || this.state==='attack' || this.state==='hit' || this.state==='ko' || this.stun>0 || this.peeing) return;
  if(this.kind==='pralka'){
    if(dog) return;
    dog={x:this.x+this.facing*46, vx:this.facing*6.2, life:420, dir:this.facing, bitten:false};
    this.specialCd=DOG_CD;
    sfx.bark();
    floaters.push({x:this.x, y:this.y-this.height-46, vy:-1.2, life:35,
      text:'WOOF! WOOF!', color:'#ffd97a', shout:true, big:false});
  } else {
    if(Math.abs(this.x-NOCNIK_X)>70){
      floaters.push({x:this.x, y:this.y-this.height-20, vy:-1, life:45,
        text:'Go to the potty!', color:'#ffffff', big:false});
      return;
    }
    this.peeing=true; this.peeT=PEE_TIME; this.vx=0;
    sfx.pee();
  }
};
Fighter.prototype.doKran=function(){
  if(this.kind!=='pralka' || this.tapping || this.kranCd>0 || !this.onGround || this.state==='attack' || this.state==='hit' || this.state==='ko' || this.stun>0 || this.peeing) return;
  if(Math.abs(this.x-KRAN_X)>70){
    floaters.push({x:this.x, y:this.y-this.height-20, vy:-1, life:45,
      text:'Go to the faucet!', color:'#ffffff', big:false});
    return;
  }
  this.tapping=true; this.tapT=TAP_TIME; this.vx=0;
  sfx.pee();
};
Fighter.prototype.hurt=function(dmg,kb,kbY,stun,blocked){
  if(this.state==='ko') return 'ko';
  this.peeing=false; this.tapping=false;
  this.hp=Math.max(0,this.hp-dmg);
  this.flash=6;
  if(this.hp<=0){
    this.state='ko'; this.t=0;
    this.vx=-this.facing*7; this.vy=-8; this.onGround=false;
    sfx.ko();
    return 'ko';
  }
  if(blocked){
    this.vx=-this.facing*kb*0.5; this.stun=7;
    sfx.block();
    return 'block';
  }
  this.state='hit'; this.stun=stun; this.t=0;
  this.vx=-this.facing*kb; this.vy=kbY;
  if(kbY<0) this.onGround=false;
  return 'hit';
};
Fighter.prototype.update=function(inp){
  this.t++;
  if(this.flash>0) this.flash--;
  if(this.state==='ko'){
    this.vy+=0.55; this.y+=this.vy; this.x+=this.vx; this.vx*=0.92;
    if(this.y>=GROUND){
      this.y=GROUND;
      if(this.vy>0){ this.vy=0; this.onGround=true; this.vx*=0.5; }
    }
    this.x=clamp(this.x,40,W-40);
    return;
  }
  if(this.state==='attack'){
    this.vx=0;
    var a=atkDef(this);
    if(a && this.t>=a.startup+a.active+a.recovery){
      this.state='idle'; this.attackType=null; this.t=0;
    }
    return;
  }
  // potty break — energy regeneration
  if(this.peeing){
    this.state='pee'; this.vx=0; this.peeT--;
    if(this.peeT<=0){
      this.peeing=false; this.state='idle'; this.t=0;
      this.hp=Math.min(100,this.hp+PEE_HEAL);
      this.specialCd=PEE_CD;
      floaters.push({x:this.x, y:this.y-this.height-30, vy:-1.1, life:50,
        text:'+'+PEE_HEAL+' (potty!)', color:'#7ef58f', big:false});
      sfx.relief();
    }
    return;
  }
  // faucet hookup — washer regeneration
  if(this.tapping){
    this.state='tap'; this.vx=0; this.tapT--;
    if(this.tapT<=0){
      this.tapping=false; this.state='idle'; this.t=0;
      this.hp=Math.min(100,this.hp+TAP_HEAL);
      this.kranCd=TAP_CD;
      floaters.push({x:this.x, y:this.y-this.height-30, vy:-1.1, life:50,
        text:'+'+TAP_HEAL+' (faucet!)', color:'#7ec8f5', big:false});
      sfx.relief();
    }
    return;
  }
  if(this.kranCd>0) this.kranCd--;
  if(this.specialCd>0) this.specialCd--;
  if(this.state==='hit'||this.stun>0){
    this.stun--;
    this.vy+=0.55; this.y+=this.vy; this.x+=this.vx; this.vx*=0.88;
    if(this.y>=GROUND){ this.y=GROUND; this.vy=0; this.onGround=true; }
    if(this.stun<=0 && this.state==='hit'){ this.state='idle'; this.t=0; this.vx=0; }
    this.x=clamp(this.x,40,W-40);
    return;
  }
  // auto-facing the opponent
  if(this.opp){ this.facing = this.opp.x>=this.x?1:-1; }
  var blocking = inp.block && this.onGround;
  if(blocking){
    this.state='block'; this.vx=0;
  } else {
    var mv=0;
    if(inp.left) mv-=1;
    if(inp.right) mv+=1;
    if(inp.jump && this.onGround){
      this.vy=this.jumpV; this.onGround=false; this.state='jump'; sfx.jump();
    }
    if(this.onGround){
      this.vx=mv*this.speed;
      this.state = mv!==0?'walk':'idle';
    } else { this.state='jump'; }
    this.x+=this.vx;
    if(inp.light) this.startAttack('light');
    if(inp.heavy) this.startAttack('heavy');
    if(inp.special) this.doSpecial();
    if(inp.kran) this.doKran();
  }
  if(!this.onGround){
    this.vy+=0.55; this.y+=this.vy;
    if(this.y>=GROUND){ this.y=GROUND; this.vy=0; this.onGround=true; this.state='idle'; }
  }
  this.x=clamp(this.x,40,W-40);
};

// ---------- hits ----------
function activeAttack(f){
  if(f.state!=='attack'||!f.attackType||f.hitApplied) return null;
  var a=atkDef(f);
  if(a && f.t>a.startup && f.t<=a.startup+a.active) return a;
  return null;
}
function attackBoxes(f,a){
  var y=f.y-f.height+8, h=f.height-16;
  if(a.both){
    var r=a.range+60;
    return [{x:f.x-r, y:y, w:2*r, h:h}];
  }
  var x0 = f.facing===1 ? f.x+52 : f.x-52-a.range;
  return [{x:x0, y:y, w:a.range, h:h}];
}
function boxesHit(b1,b2){
  return b1.x<b2.x+b2.w && b1.x+b1.w>b2.x && b1.y<b2.y+b2.h && b1.y+b1.h>b2.y;
}
function resolveHits(){
  var pairs=[[f1,f2],[f2,f1]];
  for(var i=0;i<pairs.length;i++){
    var atk=activeAttack(pairs[i][0]), def=pairs[i][1];
    if(!atk) continue;
    if(def.state==='hit'||def.state==='ko') continue;
    var boxes=attackBoxes(pairs[i][0],atk);
    var body=def.bodyBox();
    for(var j=0;j<boxes.length;j++){
      if(boxesHit(boxes[j],body)){
        var attacker=pairs[i][0];
        attacker.hitApplied=true;
        var blocked = def.state==='block';
        var dmg = blocked ? Math.max(1,Math.round(atk.dmg*0.2)) : atk.dmg;
        var res=def.hurt(dmg, blocked?atk.kb*0.35:atk.kb, blocked?0:atk.kbY, blocked?7:atk.stun, blocked);
        if(!blocked){
          attacker.combo = (gFrame-attacker.lastHitAt<60) ? attacker.combo+1 : 1;
          attacker.lastHitAt=gFrame;
        } else { attacker.combo=0; }
        hitstop = blocked?3:6;
        shake = Math.max(shake, blocked?3:(atk.shake||4));
        var hx=(attacker.x+def.x)/2, hy=def.y-def.height*0.55;
        spawnSparks(hx,hy, blocked?'#cfe8ff':'#ffe066', blocked?6:10);
        floaters.push({x:def.x, y:def.y-def.height-14, vy:-1.2, life:50,
          text:'-'+dmg+(blocked?' BLOCK':''), color:blocked?'#9fc4e8':'#ff5d5d', big:false});
        if(blocked){ sfx.block(); }
        else if(atk.dmg>12){ sfx.heavy(); }
        else { sfx.hit(); }
        if(!blocked){
          if(def===f2){
            synthAua(res==='ko');
            floaters.push({x:def.x, y:def.y-def.height-46, vy:-1.6, life:40,
              text:(res==='ko'?'AUUUAA!':'AUA!'), color:'#ff8fb3', shout:true, big:false});
          } else {
            synthWrrr(res==='ko');
            floaters.push({x:def.x, y:def.y-def.height-46, vy:-1.6, life:40,
              text:(res==='ko'?'WRRRRR!':'WRRR!'), color:'#9ad0ff', shout:true, big:false});
          }
        }
        if(res==='ko'){ onKO(attacker,def); }
        break;
      }
    }
  }
}
function pushApart(){
  if(f1.state==='ko'||f2.state==='ko') return;
  var b1=f1.bodyBox(), b2=f2.bodyBox();
  if(b1.x<b2.x+b2.w && b1.x+b1.w>b2.x && b1.y<b2.y+b2.h && b1.y+b1.h>b2.y){
    var minGap=(b1.w+b2.w)/2-14;
    var dx=f2.x-f1.x;
    var s=dx>=0?1:-1;
    var overlap=minGap-Math.abs(dx);
    if(overlap>0){ f1.x-=s*overlap/2; f2.x+=s*overlap/2; }
    f1.x=clamp(f1.x,40,W-40); f2.x=clamp(f2.x,40,W-40);
  }
}