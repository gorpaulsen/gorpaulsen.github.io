// M2: hybrid 2D mechanics; one body mass and one recycled distal mass.
// Non-slip rigid-foot stance; explicit, work-accounted foot swing; plastic touchdown impulses.
// CRW 2017 used a different, measured-input reconstruction. Here we integrate Newton's equations.
// NOT a validated sprint model: no second anatomical foot, muscles, compliant impact waveform or automatic gait solution.
export function defaults2D(){
 return {mass:75,distalFraction:0.08,g:9.81,restLength:1.0,
 legStiffness:20000,legDamping:140,onset:0.005,mu:0.9,
 swingDuration:0.22,swingAhead:0.20,swingHeight:0.13,landingV:1.0,
 swingKx:1800,swingCx:160,swingKz:1900,swingCz:200,swingEnabled:true,
 footX:0.18,bodyX:0,bodyZ:0.88,bodyVX:5,bodyVZ:-0.5,
 dt:0.0001,duration:0.75,sampleEvery:5};
}
const pos=x=>Math.max(0,x);
export function leg2D(q,p,mode,rest){
 const dx=q[4]-q[0],dy=q[5]-q[1],l=Math.max(1e-9,Math.hypot(dx,dy));
 const ux=dx/l,uy=dy/l,Ldot=ux*(q[6]-q[2])+uy*(q[7]-q[3]);
 if(mode!=='stance')return {ux,uy,l,C:0,F:0,diss:0,Ldot};
 const C=pos(rest-l),kF=p.legStiffness*C;
 const F=pos(kF-p.legDamping*Ldot*C/(C+p.onset));
 return {ux,uy,l,C,F,diss:Math.max(0,(kF-F)*Ldot),Ldot};
}
export function swing2D(q,t,p,sw){
 if(!sw||!p.swingEnabled||t<sw.t0||t>=sw.t0+p.swingDuration)return {fx:0,fy:0,power:0};
 const T=p.swingDuration,u=Math.min(1,Math.max(0,(t-sw.t0)/T));
 const S=u*u*(3-2*u),Sd=6*u*(1-u)/T,Sdd=(6-12*u)/(T*T);
 const dx=sw.xTarget-sw.x0;
 const tx=sw.x0+dx*S,tvx=dx*Sd,tax=dx*Sdd;
 const ty=p.swingHeight*Math.sin(Math.PI*u)**2+p.landingV*T*u*u*(1-u);
 const tvy=p.swingHeight*Math.PI*Math.sin(2*Math.PI*u)/T+p.landingV*(2*u-3*u*u);
 const tay=2*p.swingHeight*Math.PI**2*Math.cos(2*Math.PI*u)/(T*T)+p.landingV*(2-6*u)/T;
 const mf=p.mass*p.distalFraction;
 const fx=mf*tax+p.swingKx*(tx-q[0])+p.swingCx*(tvx-q[2]);
 const fy=mf*(p.g+tay)+p.swingKz*(ty-q[1])+p.swingCz*(tvy-q[3]);
 return {fx,fy,power:fx*(q[2]-q[6])+fy*(q[3]-q[7]),targetX:tx,targetZ:ty};
}
export function forces2D(q,t,p,mode,sw,rest){
 const leg=leg2D(q,p,mode,rest),swing=mode==='flight'?swing2D(q,t,p,sw):{fx:0,fy:0,power:0};
 const mf=p.mass*p.distalFraction;
 return {leg,swing,groundX:mode==='stance'?leg.F*leg.ux:0,
 groundY:mode==='stance'?mf*p.g+leg.F*leg.uy:0};
}
export function derivative2D(q,t,p,mode,sw,rest){
 const f=forces2D(q,t,p,mode,sw,rest),mf=p.mass*p.distalFraction,mb=p.mass-mf;
 return [mode==='stance'?0:q[2],mode==='stance'?0:q[3],
 mode==='stance'?0:f.swing.fx/mf,mode==='stance'?0:f.swing.fy/mf-p.g,
 q[6],q[7],(f.leg.F*f.leg.ux-f.swing.fx)/mb,
 (f.leg.F*f.leg.uy-f.swing.fy)/mb-p.g,
 f.leg.diss,f.swing.power,pos(f.swing.power),pos(-f.swing.power),
 f.groundX,f.groundY,0];
}
export function rk4_2D(q,t,h,p,mode,sw,rest){
 const add=(a,k,c)=>a.map((v,i)=>v+c*k[i]);
 const k1=derivative2D(q,t,p,mode,sw,rest),k2=derivative2D(add(q,k1,h/2),t+h/2,p,mode,sw,rest);
 const k3=derivative2D(add(q,k2,h/2),t+h/2,p,mode,sw,rest),k4=derivative2D(add(q,k3,h),t+h,p,mode,sw,rest);
 return q.map((v,i)=>v+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);
}
export function energy2D(q,p,mode,rest){
 const mf=p.mass*p.distalFraction,mb=p.mass-mf,leg=leg2D(q,p,mode,rest);
 const kinetic=(mf*(q[2]**2+q[3]**2)+mb*(q[6]**2+q[7]**2))/2;
 const potential=p.g*(mf*q[1]+mb*q[5])+0.5*p.legStiffness*leg.C**2;
 return {kinetic,potential,mechanical:kinetic+potential,losses:q[8],
   actuatorWork:q[9],balance:kinetic+potential+q[8]-q[9]};
}
export function validate2D(p){
 const keys=['mass','distalFraction','g','restLength','legStiffness','legDamping','onset','mu',
 'swingDuration','swingAhead','swingHeight','landingV','swingKx','swingCx','swingKz','swingCz',
 'footX','bodyX','bodyZ','bodyVX','bodyVZ','dt','duration','sampleEvery'];
 for(const key of keys)if(!Number.isFinite(p[key]))throw Error('Invalid parameter '+key);
 if(p.mass<=0||p.distalFraction<=0||p.distalFraction>=1||p.g<=0||p.restLength<=0||
 p.legStiffness<=0||p.legDamping<0||p.onset<=0||p.mu<0||p.swingDuration<=0||
 p.swingHeight<0||p.landingV<0||p.swingKx<0||p.swingCx<0||p.swingKz<0||
 p.swingCz<0||p.dt<=0||p.dt>0.001||p.duration<=0||p.duration>2||
 p.sampleEvery<1||!Number.isInteger(p.sampleEvery)||p.duration/p.dt>30000)
 throw Error('Unsupported parameter range');
}
export function simulate2D(options={}){
 const p={...defaults2D(),...options};validate2D(p);
 const mf=p.mass*p.distalFraction,mb=p.mass-mf;
 let q=[p.footX,0,0,0,p.bodyX,p.bodyZ,p.bodyVX,p.bodyVZ,0,0,0,0,0,0,0];
 let mode='stance',rest=p.restLength,sw=null;
 const events=[{type:'initial_stance',t:0,x:q[0]}],series=[];
 const initE=energy2D(q,p,mode,rest).balance,px0=mb*q[6],py0=mb*q[7];
 const n=Math.round(p.duration/p.dt);let peak=0,peakTime=0,maxEnergyError=0,maxFrictionUsage=0,invalid=null;
 let toeoffs=0,touchdowns=0;
 for(let i=0;i<=n;i++){
  const t=i*p.dt,f=forces2D(q,t,p,mode,sw,rest),E=energy2D(q,p,mode,rest);
  maxEnergyError=Math.max(maxEnergyError,Math.abs(E.balance-initE));
  if(mode==='stance'){
   const ratio=Math.abs(f.groundX)/(p.mu*f.groundY+1e-12);
   maxFrictionUsage=Math.max(maxFrictionUsage,ratio);
   if(ratio>1.001&&!invalid)invalid='static_friction_limit_exceeded';
   if(f.groundY<0&&!invalid)invalid='negative_normal_reaction';
  }
  if(q[5]<0&&!invalid)invalid='body_point_below_ground';
  if(f.groundY>peak){peak=f.groundY;peakTime=t;}
  if(i%p.sampleEvery===0||i===n)series.push({t,mode,footX:q[0],footZ:q[1],
   bodyX:q[4],bodyZ:q[5],footVX:q[2],footVZ:q[3],bodyVX:q[6],bodyVZ:q[7],
   comX:(mf*q[0]+mb*q[4])/p.mass,comZ:(mf*q[1]+mb*q[5])/p.mass,
   grfX:f.groundX,grfZ:f.groundY,legForce:f.leg.F,
   actuatorPower:f.swing.power,dissipated:q[8],actuatorWork:q[9],energyError:E.balance-initE});
  if(i===n)break;
  let next=rk4_2D(q,t,p.dt,p,mode,sw,rest);
  if(mode==='stance'){
   const L=leg2D(next,p,mode,rest);
   if(L.C<1e-7&&next[4]>next[0]&&L.Ldot>0){
    mode='flight';toeoffs++;
    sw={t0:t+p.dt,x0:next[0],
      xTarget:next[4]+next[6]*(p.swingDuration+0.02)+p.swingAhead};
    events.push({type:'toeoff',t:t+p.dt,footX:next[0],bodyX:next[4],
      bodyVX:next[6],bodyVZ:next[7]});
   }
  } else if(q[1]>=-1e-10&&next[1]<=0&&next[3]<0){
   // Find the touchdown instant by substepping, preventing artificial potential jumps.
   let lo=0,hi=p.dt;
   for(let j=0;j<25;j++){const mid=(lo+hi)/2;
    if(rk4_2D(q,t,mid,p,'flight',sw,rest)[1]>0)lo=mid;else hi=mid;}
   const hit=rk4_2D(q,t,hi,p,'flight',sw,rest),hitT=t+hi;
   const Jx=-mf*hit[2],Jy=-mf*hit[3],collisionLoss=0.5*mf*(hit[2]**2+hit[3]**2);
   // Reconfigure leg slack at touchdown: no spring energy is created on engagement.
   const newRest=Math.min(p.restLength,Math.hypot(hit[4]-hit[0],hit[5]));
   events.push({type:'touchdown',t:hitT,footX:hit[0],footVX:hit[2],
     footVZ:hit[3],impactLoss:collisionLoss,impulseX:Jx,impulseY:Jy,restLength:newRest});
   hit[1]=0;hit[2]=0;hit[3]=0;hit[8]+=collisionLoss;hit[14]+=collisionLoss;
   hit[12]+=Jx;hit[13]+=Jy;
   rest=newRest;mode='stance';sw=null;touchdowns++;
   next=rk4_2D(hit,hitT,p.dt-hi,p,mode,null,rest);
  }
  q=next;if(q.some(v=>!Number.isFinite(v)))throw Error('Numerical divergence near '+t);
 }
 const last=series.at(-1),T=n*p.dt;
 const px=mf*q[2]+mb*q[6],py=mf*q[3]+mb*q[7];
 return {p,series,events,summary:{toeoffs,touchdowns,peakBW:peak/(p.mass*p.g),peakTime,
   maxFrictionUsage,maxEnergyError,impulseX:q[12],impulseY:q[13],
   impulseResidualX:q[12]-(px-px0),impulseResidualY:q[13]-(py-py0+p.mass*p.g*T),
   dissipation:q[8],collisionLoss:q[14],actuatorWork:q[9],
   positiveActuatorWork:q[10],negativeActuatorWork:q[11],finalBodyZ:q[5],
   comTravel:last.comX-series[0].comX,finalMode:mode,invalid}};
}
