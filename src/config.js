'use strict';
// WASHER vs GRANNY - config: all tunable numbers live here. Rebalance the game in this file only.

var W=960,H=540,GROUND=470;
var cv=document.getElementById('game'), ctx=cv.getContext('2d');

var ATTACKS={
  pLight:{startup:7, active:7, recovery:13, dmg:9,  range:140, kb:5,  kbY:0,           stun:16},
  pHeavy:{startup:18,active:12,recovery:24, dmg:19, range:110, kb:12, kbY:-7,          stun:26, both:true, shake:9},
  gLight:{startup:9, active:7, recovery:15, dmg:8,  range:240, kb:5,  kbY:0,           stun:15},
  gHeavy:{startup:19,active:9, recovery:27, dmg:17, range:250, kb:11, kbY:-6,          stun:24, shake:8}
};

var NOCNIK_X=880, PEE_TIME=85, PEE_HEAL=25, PEE_CD=600, DOG_CD=750;
var KRAN_X=80, TAP_TIME=75, TAP_HEAL=25, TAP_CD=600;

var IDLE_INP={left:false,right:false,jump:false,block:false,light:false,heavy:false,special:false,kran:false};
var P1MAP={left:'a',right:'d',jump:'w',block:'s',light:'f',heavy:'g',special:'h',kran:'t'};
var P2MAP={left:'arrowleft',right:'arrowright',jump:'arrowup',block:'arrowdown',light:'k',heavy:'l',special:'p'};