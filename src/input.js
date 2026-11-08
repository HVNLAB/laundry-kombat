'use strict';
// Input: keyboard + on-screen touch buttons. Fills keys (held) and pressed (just pressed) states.

// ---------- input ----------
var keys={}, pressed={};
window.addEventListener('keydown',function(e){
  var k=(e.key||'').toLowerCase();
  keys[k]=true;
  if(!e.repeat){ pressed[k]=true; }
  if(k==='m'){ audioOn=!audioOn; }
  if(['arrowleft','arrowright','arrowup','arrowdown'].indexOf(k)>=0){ e.preventDefault(); }
  initAudio();
});
window.addEventListener('keyup',function(e){ keys[(e.key||'').toLowerCase()]=false; });
window.addEventListener('blur',function(){ keys={}; });

// ---------- touch controls (mobile) ----------
var IS_TOUCH=('ontouchstart' in window)||((navigator.maxTouchPoints||0)>0);
var TBTN=[], tMap={};
function tb(id,x,y,r,label,key,cat){ TBTN.push({id:id,x:x,y:y,r:r,label:label,key:key,cat:cat,held:false}); }
// menu / end-of-match buttons
tb('m1',270,199,46,'1P','1','menu');   tb('m2',690,199,46,'2P','2','menu');
tb('re',340,352,46,'REMATCH','r','end'); tb('mn',620,352,46,'MENU','enter','end');
// washer movement (left side, always active)
tb('pL',55,505,32,'◀','a','p1');  tb('pR',135,505,32,'▶','d','p1');
tb('pJ',55,436,32,'▲','w','p1');  tb('pB',135,436,32,'▼','s','p1');
// washer actions — left cluster (two-player mode)
tb('pF',225,505,32,'DOOR','f','p1b'); tb('pG',225,436,32,'SPIN','g','p1b');
tb('pH',315,505,32,'DOG','h','p1b');  tb('pT',315,436,32,'TAP','t','p1b');
// washer actions — right cluster (single-player mode)
tb('qF',735,505,32,'DOOR','f','p1r'); tb('qG',820,505,32,'SPIN','g','p1r');
tb('qH',735,436,32,'DOG','h','p1r');  tb('qT',820,436,32,'TAP','t','p1r');
tb('qJ',905,436,32,'▲','w','p1r');
// granny (player 2, right side)
tb('gL',825,505,32,'◀','arrowleft','g2');  tb('gR',905,505,32,'▶','arrowright','g2');
tb('gJ',825,436,32,'▲','arrowup','g2');    tb('gB',905,436,32,'▼','arrowdown','g2');
tb('gK',735,505,32,'SWEEP','k','g2'); tb('gW',735,436,32,'WHACK','l','g2');
tb('gP',645,505,32,'POTTY','p','g2');
function tbSet(cat){ var o=[],i; for(i=0;i<TBTN.length;i++){ if(TBTN[i].cat===cat) o.push(TBTN[i]); } return o; }
function tSet(){
  if(game.phase==='title') return tbSet('menu');
  if(game.phase==='matchEnd') return tbSet('end');
  return tbSet('p1').concat(game.mode==='ai'?tbSet('p1r'):tbSet('p1b').concat(tbSet('g2')));
}
function tPos(t){ var r=cv.getBoundingClientRect(); return {x:(t.clientX-r.left)*W/r.width, y:(t.clientY-r.top)*H/r.height}; }
function btnById(id){ var i; for(i=0;i<TBTN.length;i++){ if(TBTN[i].id===id) return TBTN[i]; } return null; }
function btnAt(p){ var bs=tSet(),i,b; for(i=0;i<bs.length;i++){ b=bs[i]; var dx=p.x-b.x, dy=p.y-b.y; if(dx*dx+dy*dy<=b.r*b.r*1.5) return b; } return null; }
function tKeyHeld(key,skipId){ var k,b; for(k in tMap){ if(tMap[k]&&tMap[k]!==skipId){ b=btnById(tMap[k]); if(b&&b.key===key) return true; } } return false; }
function tDown(t){ var b=btnAt(tPos(t)); tMap[t.identifier]=b?b.id:null; if(b){ b.held=true; keys[b.key]=true; pressed[b.key]=true; } }
function tUp(t){ var id=tMap[t.identifier]; if(id){ var b=btnById(id); if(b){ b.held=false; if(!tKeyHeld(b.key,id)) keys[b.key]=false; } } delete tMap[t.identifier]; }
function tMove(t){ if(!(t.identifier in tMap)) return; var b=btnAt(tPos(t)); var cur=tMap[t.identifier]?btnById(tMap[t.identifier]):null;
  if(b!==cur){ if(cur){ cur.held=false; if(!tKeyHeld(cur.key,cur.id)) keys[cur.key]=false; }
    tMap[t.identifier]=b?b.id:null; if(b){ b.held=true; keys[b.key]=true; pressed[b.key]=true; } } }
if(IS_TOUCH){
  ['touchstart','touchmove','touchend','touchcancel'].forEach(function(ev){
    cv.addEventListener(ev,function(e){
      e.preventDefault(); initAudio();
      var i,ch=e.changedTouches;
      for(i=0;i<ch.length;i++){
        if(ev==='touchstart') tDown(ch[i]);
        else if(ev==='touchmove') tMove(ch[i]);
        else tUp(ch[i]);
      }
    },{passive:false});
  });
}
function drawTouchUI(){
  if(!IS_TOUCH) return;
  var bs=tSet(),i,b;
  for(i=0;i<bs.length;i++){ b=bs[i];
    ctx.save();
    ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,7);
    ctx.fillStyle=b.held?'rgba(255,217,61,0.55)':'rgba(16,22,30,0.35)'; ctx.fill();
    ctx.lineWidth=2; ctx.strokeStyle=b.held?'#ffd93d':'rgba(255,255,255,0.6)'; ctx.stroke();
    ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='800 '+(b.label.length>3?10:16)+'px system-ui,sans-serif';
    ctx.fillText(b.label,b.x,b.y+1);
    ctx.restore();
  }
}

function humanInput(map){
  return {
    left:!!keys[map.left], right:!!keys[map.right],
    jump:!!pressed[map.jump], block:!!keys[map.block],
    light:!!pressed[map.light], heavy:!!pressed[map.heavy],
    special:!!pressed[map.special], kran:!!pressed[map.kran]
  };
}