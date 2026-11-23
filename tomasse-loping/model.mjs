// Independent vertical two-mass touchdown model: not Clark–Ryan–Weyand (2017) equations.
// Distal mass m1 and body mass m2 interact through a compression-only leg spring and closing-only damping that engages continuously with compression.
// Ground compression is unilateral; energy includes cumulative damping dissipation.
// Input speed is VERTICAL foot/body velocity, not horizontal running speed.

function defaults(){return {mass:75,distalFraction:0.08,legStiffness:16000,legDamping:200,groundStiffness:240000,groundDamping:1300,dampingOnset:0.005,restLength:0.93,initialFootHeight:0.05,initialFootVelocity:-2.0,initialBodyVelocity:-0.7,g:9.81,dt:0.0001,duration:0.30};}

function forces(s,p){const [z1,v1,z2,v2]=s;const compression=Math.max(0,p.restLength-(z2-z1)),closeLeg=Math.max(0,v1-v2),penetration=Math.max(0,-z1),closeGround=Math.max(0,-v1);const leg=p.legStiffness*compression+p.legDamping*closeLeg*compression/(compression+p.dampingOnset),ground=p.groundStiffness*penetration+p.groundDamping*closeGround*penetration/(penetration+p.dampingOnset);const diss=p.legDamping*closeLeg*closeLeg*compression/(compression+p.dampingOnset)+p.groundDamping*closeGround*closeGround*penetration/(penetration+p.dampingOnset);return {leg,ground,diss,compression,penetration};}

function derivatives(s,p){const {leg,ground,diss}=forces(s,p),m1=p.mass*p.distalFraction,m2=p.mass-m1;return [s[1],(ground-leg)/m1-p.g,s[3],leg/m2-p.g,diss];}

function rk4(s,p){const h=p.dt,k1=derivatives(s,p),plus=(a,k,c)=>a.map((v,i)=>v+k[i]*c),k2=derivatives(plus(s,k1,h/2),p),k3=derivatives(plus(s,k2,h/2),p),k4=derivatives(plus(s,k3,h),p);return s.map((v,i)=>v+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);}

function energy(s,p){const m1=p.mass*p.distalFraction,m2=p.mass-m1,f=forces(s,p);return 0.5*m1*s[1]**2+0.5*m2*s[3]**2+p.g*(m1*s[0]+m2*s[2])+0.5*p.legStiffness*f.compression**2+0.5*p.groundStiffness*f.penetration**2+s[4];}

function simulateTwo(options={}){const p={...defaults(),...options};if(!(p.mass>0&&p.distalFraction>0&&p.distalFraction<1&&p.dt>0&&p.duration>0&&p.legStiffness>0&&p.groundStiffness>0&&p.legDamping>=0&&p.groundDamping>=0&&p.dampingOnset>0))throw Error("Invalid parameters");let s=[p.initialFootHeight,p.initialFootVelocity,p.initialFootHeight+p.restLength,p.initialBodyVelocity,0],E0=energy(s,p),rows=[],maxDrift=0,n=Math.round(p.duration/p.dt),m1=p.mass*p.distalFraction,m2=p.mass-m1;for(let i=0;i<=n;i++){const t=i*p.dt,f=forces(s,p),E=energy(s,p);maxDrift=Math.max(maxDrift,Math.abs(E-E0));rows.push({t,zFoot:s[0],vFoot:s[1],zBody:s[2],vBody:s[3],force:f.ground,legForce:f.leg,compression:f.compression,dissipated:s[4],energyError:E-E0,comVelocity:(m1*s[1]+m2*s[3])/p.mass});if(i<n)s=rk4(s,p);}return {p,rows,maxDrift};}

function simulateOne(options={}){const p={...defaults(),...options},m1=p.mass*p.distalFraction,m2=p.mass-m1,n=Math.round(p.duration/p.dt);let z=p.initialFootHeight+p.restLength,v=(m1*p.initialFootVelocity+m2*p.initialBodyVelocity)/p.mass, dissipated=0,rows=[];function derivative(x){const [z,v]=x,c=Math.max(0,p.restLength-z),closing=Math.max(0,-v),F=p.legStiffness*c+p.legDamping*closing*c/(c+p.dampingOnset);return [v,F/p.mass-p.g,p.legDamping*closing*closing*c/(c+p.dampingOnset)];}function force(x){const c=Math.max(0,p.restLength-x[0]);return p.legStiffness*c+p.legDamping*Math.max(0,-x[1])*c/(c+p.dampingOnset);}let x=[z,v,0];for(let i=0;i<=n;i++){rows.push({t:i*p.dt,force:force(x),z:x[0],v:x[1],dissipated:x[2]});if(i<n){const h=p.dt,k1=derivative(x),sum=(a,k,c)=>a.map((y,j)=>y+c*k[j]),k2=derivative(sum(x,k1,h/2)),k3=derivative(sum(x,k2,h/2)),k4=derivative(sum(x,k3,h));x=x.map((v,j)=>v+h*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);}}return {p,rows};}

function summarize(result){const p=result.p,rows=result.rows,contact=rows.find(r=>r.force>0),t0=contact?contact.t:null,peak=rows.reduce((a,r)=>r.force>a.force?r:a,rows[0]);let impulse=0;for(let i=1;i<rows.length;i++)impulse+=0.5*(rows[i-1].force+rows[i].force)*p.dt;const first=rows[0],last=rows.at(-1),deltaCOMVelocity=last.comVelocity-first.comVelocity,expected=p.mass*(deltaCOMVelocity+p.g*(last.t-first.t));return {contactTime:t0,peakForce:peak.force,peakBW:peak.force/(p.mass*p.g),timeOfPeak:peak.t,groundImpulse:impulse,impulseResidual:impulse-expected,dissipatedEnergy:last.dissipated,energyDrift:result.maxDrift};}

export { defaults, forces, derivatives, rk4, energy, simulateTwo, simulateOne, summarize };
