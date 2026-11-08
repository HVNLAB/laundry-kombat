'use strict';
// HUD: health bars, round pips, cooldown hints, title / KO / winner screens.

// ---------- HUD ----------
function drawBar(x,y,w,f,label,right,tag){
  ctx.fillStyle='rgba(15,20,32,0.5)';
  roundRect(x-4,y-4,w+8,30,10); ctx.fill();
  ctx.fillStyle='#3a2230'; ctx.fillRect(x,y,w,22);
  var pct=clamp(f.hp/100,0,1), gpct=clamp(f.dispHp/100,0,1);
  var gw=w*gpct, fw=w*pct;
  if(right){
    ctx.fillStyle='#ffd23d'; ctx.fillRect(x+w-gw,y,gw,22);
    ctx.fillStyle='#ff7a3c'; ctx.fillRect(x+w-fw,y,fw,22);
  } else {
    ctx.fillStyle='#ffd23d'; ctx.fillRect(x,y,gw,22);
    ctx.fillStyle='#4cd964'; ctx.fillRect(x,y,fw,22);
  }
  ctx.fillStyle='rgba(255,255,255,0.18)'; ctx.fillRect(x,y,w,7);
  ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2; ctx.strokeRect(x,y,w,22);
  ctx.font='900 15px system-ui,sans-serif'; ctx.fillStyle='#ffffff';
  ctx.textAlign=right?'right':'left';
  ctx.fillText(label+(tag||''), right?x+w:x, y-8);
}
function drawHUD(){
  if(game.phase==='title') return;
  f1.dispHp += (f1.hp-f1.dispHp)*0.06;
  f2.dispHp += (f2.hp-f2.dispHp)*0.06;
  if(Math.abs(f1.hp-f1.dispHp)<0.3) f1.dispHp=f1.hp;
  if(Math.abs(f2.hp-f2.dispHp)<0.3) f2.dispHp=f2.hp;
  drawBar(30,26,380,f1,'WASHER',false,'');
  drawBar(550,26,380,f2,'GRANNY'+(game.mode==='ai'?' (CPU)':''),true,'');
  // round points
  for(var i=0;i<2;i++){
    ctx.beginPath(); ctx.arc(46+i*18,60,5,0,7);
    ctx.fillStyle = f1.wins>i ? '#ffd93d' : 'rgba(255,255,255,0.25)';
    ctx.fill();
    ctx.beginPath(); ctx.arc(914-i*18,60,5,0,7);
    ctx.fillStyle = f2.wins>i ? '#ffd93d' : 'rgba(255,255,255,0.25)';
    ctx.fill();
  }
  ctx.font='700 13px system-ui,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.85)';
  ctx.textAlign='center';
  ctx.fillText('Round '+game.round, W/2, 26);
  // combo
  if(f1.combo>=2 && gFrame-f1.lastHitAt<50){
    ctx.textAlign='left'; ctx.font='900 16px system-ui,sans-serif'; ctx.fillStyle='#ffd93d';
    ctx.fillText('COMBO x'+f1.combo, 32, 80);
  }
  if(f2.combo>=2 && gFrame-f2.lastHitAt<50){
    ctx.textAlign='right'; ctx.font='900 16px system-ui,sans-serif'; ctx.fillStyle='#ffd93d';
    ctx.fillText('COMBO x'+f2.combo, 928, 80);
  }
  // special ability indicators
  if(game.phase==='fight'||game.phase==='intro'){
    ctx.font='700 12px system-ui,sans-serif';
    ctx.textAlign='left';
    if(f1.specialCd>0){ ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('DOG IN: '+Math.ceil(f1.specialCd/60)+'s',32,98); }
    else { ctx.fillStyle='#ffd97a'; ctx.fillText('H — TURBO DOG READY!',32,98); }
    if(f1.kranCd>0){ ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('FAUCET IN: '+Math.ceil(f1.kranCd/60)+'s',32,114); }
    else { ctx.fillStyle='#9ad0ff'; ctx.fillText('T — FAUCET READY!',32,114); }
    ctx.textAlign='right';
    if(f2.specialCd>0){ ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('POTTY IN: '+Math.ceil(f2.specialCd/60)+'s',928,98); }
    else { ctx.fillStyle='#a9e5b5'; ctx.fillText('POTTY READY',928,98); }
  }
}

// ---------- screens / texts ----------
function bigText(text,y,size,fill,stroke){
  ctx.textAlign='center';
  ctx.font='900 '+size+'px system-ui,sans-serif';
  ctx.strokeStyle=stroke||'rgba(0,0,0,0.75)'; ctx.lineWidth=8; ctx.lineJoin='round';
  ctx.strokeText(text,W/2,y);
  ctx.fillStyle=fill||'#ffffff';
  ctx.fillText(text,W/2,y);
}
function drawOverlays(){
  var ph=game.phase;
  if(ph==='title'){
    ctx.fillStyle='rgba(12,16,26,0.78)';
    roundRect(160,76,640,392,18); ctx.fill();
    ctx.textAlign='center';
    ctx.font='900 56px system-ui,sans-serif';
    ctx.fillStyle='#ffd93d'; ctx.fillText('LAUNDRY KOMBAT',W/2,130);
    ctx.font='900 24px system-ui,sans-serif';
    ctx.fillStyle='#bfe9ff'; ctx.fillText('WASHER',W/2-70,164);
    ctx.fillStyle='#ffd93d'; ctx.fillText('vs',W/2,164);
    ctx.fillStyle='#ffb39a'; ctx.fillText('GRANNY',W/2+70,164);
    ctx.font='700 17px system-ui,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.fillText('1 — play vs computer (you are the washer)',W/2,196);
    ctx.fillText('2 — two players (granny: arrows + K/L)',W/2,222);
    ctx.textAlign='left';
    ctx.font='700 14px system-ui,sans-serif'; ctx.fillStyle='#bfe9ff';
    ctx.fillText('WASHER',214,256);
    ctx.fillStyle='#cfd8e6'; ctx.font='500 13px system-ui,sans-serif';
    ctx.fillText('A / D — move',214,278);
    ctx.fillText('W — jump',214,298);
    ctx.fillText('S — block',214,318);
    ctx.fillText('F — door slam',214,338);
    ctx.fillText('G — spin cycle (heavy, hits both sides)',214,358);
    ctx.fillText('H — unleash the TURBO DACHSHUND!',214,378);
    ctx.fillText('T — hook up to the faucet (+25)',214,398);
    ctx.textAlign='left';
    ctx.font='700 14px system-ui,sans-serif'; ctx.fillStyle='#ffb39a';
    ctx.fillText('GRANNY (player 2)',540,256);
    ctx.fillStyle='#cfd8e6'; ctx.font='500 13px system-ui,sans-serif';
    ctx.fillText('arrows — move',540,278);
    ctx.fillText('arrow up — jump',540,298);
    ctx.fillText('arrow down — block',540,318);
    ctx.fillText('K — broom whack',540,338);
    ctx.fillText('L — sweeping blow (heavy)',540,358);
    ctx.fillText('P — potty break (+25 energy)',540,378);
    ctx.textAlign='center';
    var blink=0.55+0.45*Math.sin(gFrame*0.09);
    ctx.globalAlpha=blink;
    ctx.font='900 19px system-ui,sans-serif'; ctx.fillStyle='#ffd93d';
    ctx.fillText(IS_TOUCH?'Tap 1P or 2P to start':'Press 1 or 2 to start',W/2,442);
    ctx.globalAlpha=1;
  } else if(ph==='intro'){
    if(game.timer>30){ bigText('ROUND '+game.round,250,56,'#ffffff'); }
    else { bigText('FIGHT!',260,84,'#ffd93d'); }
  } else if(ph==='roundEnd'){
    var nm = game.koWinner===f1 ? 'WASHER' : 'GRANNY';
    bigText(nm+' WINS THE ROUND!',250,42,'#ffffff');
  } else if(ph==='matchEnd'){
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(0,0,W,H);
    var nm2 = game.koWinner===f1 ? 'WASHER' : 'GRANNY';
    bigText('🏆 '+nm2+' WINS!',240,56, game.koWinner===f1?'#bfe9ff':'#ffb39a');
    ctx.textAlign='center';
    ctx.font='700 20px system-ui,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.fillText(IS_TOUCH?'Tap REMATCH or MENU':'R — rematch      Enter — menu',W/2,300);
  }
  if(ph==='fight'||ph==='intro'){
    ctx.font='600 13px system-ui,sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.textAlign='center';
    var hint = game.mode==='ai'
      ? 'A/D move · W jump · S block · F door · G spin · H dog · T faucet'
      : 'Washer: A D W S F G H T   ·   Granny: arrows + K / L + P';
    if(!IS_TOUCH){ ctx.fillText(hint,W/2,H-10); }
    if(game.mode==='2p' && Math.abs(f2.x-NOCNIK_X)<220){
      ctx.font='700 12px system-ui,sans-serif';
      ctx.fillStyle='rgba(255,255,255,'+(0.55+0.35*Math.sin(gFrame*0.1))+')';
      ctx.fillText('P — potty (+energy)', NOCNIK_X, GROUND-58);
    }
    if(Math.abs(f1.x-KRAN_X)<220){
      ctx.font='700 12px system-ui,sans-serif';
      ctx.fillStyle='rgba(255,255,255,'+(0.55+0.35*Math.sin(gFrame*0.1+1))+')';
      ctx.fillText('T — faucet (+energy)', KRAN_X, GROUND-124);
    }
  }
}