(() => {
"use strict";
const $=s=>document.querySelector(s), canvas=$("#canvas"), ctx=canvas.getContext("2d");
const W=960,H=600, keys={}, audio={};
const scolds=["Tá vendo? Tá limpo igual tua cara!","Eu mandei fazer isso faz uma hora, menino!","Enquanto você morar debaixo do meu teto...","Você acha que essa casa se limpa sozinha?","Eu não sou sua empregada, não!","Se eu tiver que fazer, você vai ver!","Isso pra você tá limpo? Olha essa sujeira!","MENINOOOO! EU JÁ MANDEI LIMPAR ISSO!"];
const calls=["MENINO! Já terminou?","Eu mandei limpar isso faz tempo!","Você tá fazendo o quê aí?","Eu vou aí olhar, viu?","Não me faça ir até aí!"];
const taskDefs={
 sweep:{name:"Varrer a sala",x:245,y:220,d:3,icon:"🧹",act:"Varrendo..."},
 bath:{name:"Limpar o banheiro",x:815,y:135,d:4,icon:"🧽",act:"Limpando..."},
 toys:{name:"Guardar objetos espalhados",x:530,y:180,d:3.5,icon:"🧸",act:"Guardando..."},
 ingredients:{name:"Pegar ingredientes",x:690,y:360,d:2.5,icon:"🥕",act:"Pegando ingredientes..."},
 cook:{name:"Preparar a comida",x:850,y:365,d:5,icon:"🍳",act:"Cozinhando..."},
 dishes:{name:"Lavar a louça",x:765,y:470,d:4,icon:"🍽️",act:"Lavando louça..."},
 area:{name:"Limpar a área",x:170,y:500,d:4,icon:"🪣",act:"Limpando área..."},
 yard:{name:"Limpar o quintal",x:120,y:500,d:4.5,icon:"🍂",act:"Limpando quintal..."},
 trash:{name:"Tirar o lixo",x:900,y:520,d:3,icon:"🗑️",act:"Tirando lixo..."},
 organize:{name:"Organizar objetos",x:520,y:160,d:4,icon:"📦",act:"Organizando..."},
 kitchen:{name:"Limpar a cozinha",x:800,y:400,d:5,icon:"✨",act:"Limpando cozinha..."},
 surprise:{name:"Tarefa surpresa: arrumar a cama",x:500,y:330,d:5,icon:"🛏️",act:"Arrumando cama..."}
};
const phases=[
 {name:"ARRUMANDO A CASA",time:120,drain:.62,momSpeed:58,tasks:["sweep","bath","toys"]},
 {name:"HORA DO ALMOÇO",time:105,drain:.82,momSpeed:72,tasks:["ingredients","cook","dishes","area"]},
 {name:"A MÃE TÁ BRAVA",time:95,drain:1.08,momSpeed:86,tasks:["yard","trash","organize","kitchen","surprise"]}
];
const walls=[
 {x:0,y:0,w:960,h:18},{x:0,y:582,w:960,h:18},{x:0,y:0,w:18,h:600},{x:942,y:0,w:18,h:600},
 {x:320,y:18,w:14,h:135},{x:320,y:215,w:14,h:165},{x:320,y:445,w:14,h:137},
 {x:640,y:18,w:14,h:100},{x:640,y:180,w:14,h:200},{x:640,y:445,w:14,h:137},
 {x:334,y:285,w:115,h:14},{x:515,y:285,w:125,h:14},
 {x:654,y:285,w:105,h:14},{x:825,y:285,w:117,h:14}
];
const furniture=[
 {x:75,y:75,w:150,h:55,c:"#4ea8de",label:"SOFÁ"},{x:120,y:270,w:80,h:42,c:"#9c6644",label:"MESA"},
 {x:390,y:70,w:165,h:75,c:"#f4a261",label:"CAMA"},{x:710,y:55,w:85,h:45,c:"#8ecae6",label:"BANHEIRA"},
 {x:840,y:75,w:48,h:60,c:"#eee",label:"WC"},{x:690,y:325,w:80,h:45,c:"#90be6d",label:"GELADEIRA"},
 {x:825,y:325,w:90,h:45,c:"#adb5bd",label:"FOGÃO"},{x:715,y:455,w:135,h:40,c:"#6c9a8b",label:"PIA"},
 {x:390,y:330,w:165,h:75,c:"#cdb4db",label:"CAMA"}
];
let phase=0,state="menu",player,mom,tasks,timeLeft,patience,doing=null,doProgress=0,last=0,totalElapsed=0,totalDone=0,callText="",callTimer=0,nextCall=12,redAlerted=false,failTimer=0;

function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active")}
function beep(type){try{const A=window.AudioContext||window.webkitAudioContext; audio.ctx=audio.ctx||new A();const o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.connect(g);g.connect(audio.ctx.destination);let f=type==="alert"?180:type==="done"?660:type==="win"?880:120;o.frequency.value=f;g.gain.setValueAtTime(.08,audio.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.ctx.currentTime+.18);o.start();o.stop(audio.ctx.currentTime+.18)}catch(e){}}
function startPhase(n){phase=n;const p=phases[n];tasks=p.tasks.map(id=>({...taskDefs[id],id,done:false}));timeLeft=p.time;patience=100;doing=null;doProgress=0;redAlerted=false;player={x:270,y:520,r:15,speed:175,dir:0,walk:0};mom={x:60,y:65,r:17,speed:p.momSpeed,target:{x:150,y:100},think:0};state="playing";nextCall=8+Math.random()*9;callTimer=0;updateHud();show("game")}
function circleRect(x,y,r,q){return x+r>q.x&&x-r<q.x+q.w&&y+r>q.y&&y-r<q.y+q.h}
function blocked(x,y,r){return walls.some(q=>circleRect(x,y,r,q))||furniture.some(q=>circleRect(x,y,r,q))}
function move(ent,dx,dy,dt){let nx=ent.x+dx*dt,ny=ent.y+dy*dt;if(!blocked(nx,ent.y,ent.r))ent.x=nx;if(!blocked(ent.x,ny,ent.r))ent.y=ny}
function nearestTask(){let best=null,bd=70;for(const t of tasks)if(!t.done){const d=Math.hypot(player.x-t.x,player.y-t.y);if(d<bd){best=t;bd=d}}return best}
function patienceInfo(){if(patience>68)return["🟢 Tranquila","#65d66e"];if(patience>40)return["🟡 Desconfiada","#ffd166"];if(patience>18)return["🟠 Irritada","#f8961e"];return["🔴 MENINO!!!","#ef233c"]}
function updateHud(){const p=phases[phase],done=tasks.filter(t=>t.done).length;$("#phaseLabel").textContent="FASE "+(phase+1);$("#phaseName").textContent=p.name;$("#time").textContent=fmt(timeLeft);const pi=patienceInfo();$("#patienceState").textContent=pi[0];$("#patienceBar").style.width=patience+"%";$("#patienceBar").style.background=pi[1];$("#missionList").innerHTML=tasks.map(t=>'<li class="'+(t.done?"done":"")+'">'+(t.done?"☑":"☐")+" "+t.name+"</li>").join("");$("#taskCount").textContent=done+"/"+tasks.length;$("#taskBar").style.width=(done/tasks.length*100)+"%"}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function momAI(dt){const chase=patience<=18||phase===2&&patience<35;if(chase){const dx=player.x-mom.x,dy=player.y-mom.y,d=Math.hypot(dx,dy)||1;mom.speed=phases[phase].momSpeed*(patience<=18?1.7:1.25);move(mom,dx/d*mom.speed,dy/d*mom.speed,dt)}else{mom.think-=dt;if(mom.think<=0||Math.hypot(mom.x-mom.target.x,mom.y-mom.target.y)<20){mom.target={x:40+Math.random()*880,y:40+Math.random()*520};mom.think=2+Math.random()*3;if(blocked(mom.target.x,mom.target.y,mom.r))mom.think=0}const dx=mom.target.x-mom.x,dy=mom.target.y-mom.y,d=Math.hypot(dx,dy)||1;move(mom,dx/d*mom.speed,dy/d*mom.speed,dt)}
 if(Math.hypot(player.x-mom.x,player.y-mom.y)<34&&patience<=18)beginFail()}
function beginFail(){if(state!=="playing")return;state="scolding";failTimer=2.6;callText=scolds[Math.floor(Math.random()*scolds.length)];beep("fail")}
function finishTask(t){t.done=true;doing=null;doProgress=0;totalDone++;patience=Math.min(100,patience+10);beep("done");updateHud();if(tasks.every(x=>x.done)){state="complete";beep("win");setTimeout(()=>{if(phase===2){$("#totalTime").textContent=fmt(totalElapsed);$("#totalTasks").textContent=totalDone;show("victory");state="victory"}else show("phaseComplete")},600)}}
function update(dt){if(state==="playing"){totalElapsed+=dt;timeLeft-=dt;patience=Math.max(0,patience-phases[phase].drain*dt);let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);if(dx||dy){let d=Math.hypot(dx,dy);dx/=d;dy/=d;move(player,dx*player.speed,dy*player.speed,dt);player.walk+=dt*10;player.dir=Math.atan2(dy,dx)}momAI(dt);nextCall-=dt;if(nextCall<=0){callText=calls[Math.floor(Math.random()*calls.length)];callTimer=3;nextCall=9+Math.random()*12}callTimer=Math.max(0,callTimer-dt);
 const near=nearestTask();$("#interaction").style.display=near?"block":"none";if(near)$("#interaction").textContent="[E] "+near.name;
 if(keys.e&&near){if(doing!==near){doing=near;doProgress=0}doProgress+=dt;$("#progressBox").style.display="block";$("#progressText").textContent=near.act;$("#progressBar").style.width=Math.min(100,doProgress/near.d*100)+"%";if(doProgress>=near.d)finishTask(near)}else{doing=null;doProgress=0;$("#progressBox").style.display="none"}
 if(patience<=18&&!redAlerted){redAlerted=true;beep("alert");$("#alert").style.display="block";setTimeout(()=>$("#alert").style.display="none",2400)}
 if(timeLeft<=0)beginFail();updateHud()}else if(state==="scolding"){failTimer-=dt;const dx=player.x-mom.x,dy=player.y-mom.y,d=Math.hypot(dx,dy)||1;if(d>48)move(mom,dx/d*130,dy/d*130,dt);if(failTimer<=0){$("#scoldText").textContent=callText;show("gameOver");state="over"}}}
function room(x,y,w,h,name,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.fillStyle="#0007";ctx.font="bold 14px sans-serif";ctx.fillText(name,x+12,y+24)}
function draw(){if(!["playing","scolding"].includes(state))return;ctx.clearRect(0,0,W,H);room(18,18,302,362,"SALA","#ffe8a1");room(334,18,306,267,"QUARTO","#ffd6e0");room(654,18,288,267,"BANHEIRO","#caf0f8");room(654,299,288,283,"COZINHA","#d8f3dc");room(334,299,306,283,"QUARTO 2","#e9d8fd");room(18,394,302,188,"ÁREA / QUINTAL","#b7e4a8");ctx.fillStyle="#73533b";walls.forEach(q=>ctx.fillRect(q.x,q.y,q.w,q.h));furniture.forEach(f=>{ctx.fillStyle=f.c;ctx.fillRect(f.x,f.y,f.w,f.h);ctx.fillStyle="#17223b";ctx.font="bold 11px sans-serif";ctx.fillText(f.label,f.x+6,f.y+20)});
 tasks.forEach(t=>{if(t.done)return;ctx.font="28px serif";ctx.fillText(t.icon,t.x-14,t.y+10);ctx.strokeStyle="#ffd166";ctx.lineWidth=3;ctx.beginPath();ctx.arc(t.x,t.y,24+Math.sin(performance.now()/250)*3,0,Math.PI*2);ctx.stroke()});
 drawPerson(player,"#277da1","👦");drawPerson(mom,"#ef476f","👩");if(callTimer>0||state==="scolding"){const text=callText,max=300,x=Math.min(W-max-10,Math.max(10,mom.x-120)),y=Math.max(25,mom.y-70);ctx.fillStyle="#fff";roundRect(x,y,max,42,12);ctx.fill();ctx.fillStyle="#222";ctx.font="bold 14px sans-serif";ctx.fillText(text.slice(0,38),x+12,y+26)}}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function drawPerson(p,c,emoji){const bob=Math.sin((p.walk||0))*2;ctx.fillStyle="#0003";ctx.beginPath();ctx.ellipse(p.x,p.y+17,18,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y+bob,p.r,0,Math.PI*2);ctx.fill();ctx.font="25px serif";ctx.textAlign="center";ctx.fillText(emoji,p.x,p.y+8+bob);ctx.textAlign="left"}
function loop(ts){const dt=Math.min(.033,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}
addEventListener("keydown",e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=true;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault()});
addEventListener("keyup",e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=false});
$("#playBtn").onclick=()=>{totalElapsed=0;totalDone=0;startPhase(0)};$("#nextBtn").onclick=()=>startPhase(phase+1);$("#retryBtn").onclick=()=>startPhase(phase);$("#menuBtn").onclick=()=>{state="menu";show("menu")};$("#victoryMenuBtn").onclick=()=>{state="menu";show("menu")};
requestAnimationFrame(loop);
})();