'use strict';
// All sound is synthesized with WebAudio - no audio files. Metal riff, hits and battle cries.

// ---------- sound (WebAudio, no files) ----------
var audioOn=true, actx=null;
function initAudio(){
  if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(actx && actx.state==='suspended'){ actx.resume(); }
  if(actx && !musicBus){ initMusic(); }
}
// ---------- HEAVY METAL: riff + drums (WebAudio + distortion) ----------
var musicBus=null, musicGainNode=null, musicFrame=0, musicStep=0;
function initMusic(){
  if(!actx) return;
  var ws=actx.createWaveShaper();
  var curve=new Float32Array(256);
  for(var i=0;i<256;i++){ var x2=i/128-1; curve[i]=Math.tanh(3.5*x2); }
  ws.curve=curve;
  musicGainNode=actx.createGain();
  musicGainNode.gain.value=0.12;
  ws.connect(musicGainNode);
  musicGainNode.connect(actx.destination);
  musicBus=ws;
}
function mChord(freq,when,dur){
  var o1=actx.createOscillator(), o2=actx.createOscillator(), g=actx.createGain();
  o1.type='sawtooth'; o2.type='square';
  o1.frequency.setValueAtTime(freq,when);
  o2.frequency.setValueAtTime(freq*1.5,when);
  g.gain.setValueAtTime(0.25,when);
  g.gain.exponentialRampToValueAtTime(0.001,when+dur);
  o1.connect(g); o2.connect(g); g.connect(musicBus);
  o1.start(when); o2.start(when);
  o1.stop(when+dur+0.02); o2.stop(when+dur+0.02);
}
function mKick(when){
  var o=actx.createOscillator(), g=actx.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(140,when);
  o.frequency.exponentialRampToValueAtTime(45,when+0.09);
  g.gain.setValueAtTime(0.5,when);
  g.gain.exponentialRampToValueAtTime(0.001,when+0.12);
  o.connect(g); g.connect(musicBus);
  o.start(when); o.stop(when+0.14);
}
function mNoise(when,dur,vol,hp){
  var n=Math.floor(actx.sampleRate*dur), buf=actx.createBuffer(1,n,actx.sampleRate), d=buf.getChannelData(0);
  for(var i=0;i<n;i++){ d[i]=(Math.random()*2-1)*(1-i/n); }
  var s=actx.createBufferSource(); s.buffer=buf;
  var f=actx.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp;
  var g=actx.createGain(); g.gain.value=vol;
  s.connect(f); f.connect(g); g.connect(musicBus);
  s.start(when);
}
// riff in E minor: E E _ E | E _ E G | E E _ E | A _ B G
var RIFF=[82.4,82.4,0,82.4, 82.4,0,82.4,98.0, 82.4,82.4,0,82.4, 110.0,0,123.5,98.0];
function musicTick(){
  if(!actx || !musicBus) return;
  var t=actx.currentTime+0.05;
  var s=musicStep%16;
  if(RIFF[s]>0){ mChord(RIFF[s], t, 0.16); }
  if(s%4===0 || s===6 || s===11 || s===14){ mKick(t); }
  if(s===4 || s===12){ mNoise(t,0.09,0.22,1500); }
  if(s%2===0){ mNoise(t,0.03,0.06,7000); }
  musicStep++;
}
function tone(freq,dur,type,vol,slide){
  if(!audioOn||!actx) return;
  var o=actx.createOscillator(), g=actx.createGain(), t=actx.currentTime;
  o.type=type||'square';
  o.frequency.setValueAtTime(freq,t);
  if(slide){ o.frequency.exponentialRampToValueAtTime(Math.max(30,slide),t+dur); }
  g.gain.setValueAtTime(vol||0.15,t);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(g); g.connect(actx.destination);
  o.start(t); o.stop(t+dur+0.02);
}
function noiseBurst(dur,vol){
  if(!audioOn||!actx) return;
  var n=Math.floor(actx.sampleRate*dur), buf=actx.createBuffer(1,n,actx.sampleRate), d=buf.getChannelData(0);
  for(var i=0;i<n;i++){ d[i]=(Math.random()*2-1)*(1-i/n); }
  var s=actx.createBufferSource(); s.buffer=buf;
  var g=actx.createGain(); g.gain.value=vol||0.2;
  s.connect(g); g.connect(actx.destination); s.start();
}
var sfx={
  hit:function(){ noiseBurst(0.09,0.3); tone(160,0.09,'square',0.12,60); },
  heavy:function(){ noiseBurst(0.16,0.4); tone(90,0.18,'sawtooth',0.18,40); },
  block:function(){ tone(720,0.06,'square',0.1); tone(960,0.05,'square',0.08); },
  whoosh:function(){ noiseBurst(0.08,0.06); },
  jump:function(){ tone(300,0.12,'sine',0.12,560); },
  ko:function(){ tone(500,0.5,'sawtooth',0.2,60); noiseBurst(0.3,0.3); },
  bell:function(){ tone(880,0.25,'triangle',0.18); setTimeout(function(){tone(1320,0.3,'triangle',0.18);},160); },
  go:function(){ tone(660,0.15,'square',0.15); },
  bark:function(){ tone(340,0.06,'square',0.14,200); setTimeout(function(){ tone(300,0.06,'square',0.12,180); },90); },
  moo:function(){ tone(210,0.3,'sine',0.22,120); setTimeout(function(){ tone(170,0.35,'sine',0.18,100); },140); },
  pee:function(){ noiseBurst(0.7,0.06); },
  relief:function(){ tone(540,0.35,'sine',0.15,320); }
};
// ---------- fighter voices ----------
// granny's scream "AUA!" — vowels imitated with formants
function synthAua(ko){
  if(!audioOn||!actx) return;
  var t=actx.currentTime, dur=ko?0.75:0.32;
  var o=actx.createOscillator(); o.type='sawtooth';
  o.frequency.setValueAtTime(ko?400:360,t);
  o.frequency.linearRampToValueAtTime(ko?240:300,t+dur);
  var vib=actx.createOscillator(); vib.type='sine'; vib.frequency.value=7;
  var vg=actx.createGain(); vg.gain.value=9;
  vib.connect(vg); vg.connect(o.frequency);
  var f1=actx.createBiquadFilter(); f1.type='bandpass'; f1.Q.value=5;
  f1.frequency.setValueAtTime(320,t); f1.frequency.linearRampToValueAtTime(850,t+dur*0.5);
  var f2=actx.createBiquadFilter(); f2.type='bandpass'; f2.Q.value=7;
  f2.frequency.setValueAtTime(800,t); f2.frequency.linearRampToValueAtTime(1250,t+dur*0.5);
  var g=actx.createGain();
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(0.5,t+0.02);
  g.gain.setValueAtTime(0.5,t+dur*0.35);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(f1); o.connect(f2);
  f1.connect(g); f2.connect(g);
  g.connect(actx.destination);
  o.start(t); o.stop(t+dur+0.02); vib.start(t); vib.stop(t+dur+0.02);
}
// washer's growl "WRRR!" — a low trembling engine
function synthWrrr(ko){
  if(!audioOn||!actx) return;
  var t=actx.currentTime, dur=ko?0.85:0.38;
  var o=actx.createOscillator(); o.type='sawtooth';
  o.frequency.setValueAtTime(52,t);
  o.frequency.linearRampToValueAtTime(100,t+dur*0.4);
  o.frequency.linearRampToValueAtTime(70,t+dur);
  var w=actx.createOscillator(); w.type='sine'; w.frequency.value=20;
  var wg=actx.createGain(); wg.gain.value=14;
  w.connect(wg); wg.connect(o.frequency);
  var f=actx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=650; f.Q.value=3;
  var g=actx.createGain();
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(0.5,t+0.03);
  g.gain.setValueAtTime(0.5,t+dur*0.45);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(f); f.connect(g); g.connect(actx.destination);
  o.start(t); o.stop(t+dur+0.02); w.start(t); w.stop(t+dur+0.02);
}