import assert from 'node:assert/strict';
import {defaults,forces,derivatives,energy,simulateTwo,simulateOne,summarize} from '../model.mjs';

const close=(a,b,tolerance,label)=>assert.ok(Math.abs(a-b)<=tolerance,`${label}: ${a} != ${b} (tolerance ${tolerance})`);
const d=defaults();
assert.equal(d.distalFraction,0.08);
assert.equal(d.mass,75);
assert.ok(d.dampingOnset>0,'continuous damping activation length must be positive');
const f0=forces([0,-2,d.restLength,-0.7,0],d);
const fPen=forces([-1e-7,-2,d.restLength-1e-7,-0.7,0],d);
assert.equal(f0.ground,0);
assert.ok(fPen.ground<1,'ground reaction engages continuously at zero compression');


const two=simulateTwo(d),one=simulateOne(d),s=summarize(two);
assert.equal(two.rows.length,Math.round(d.duration/d.dt)+1);
assert.equal(one.rows.length,two.rows.length);
assert.ok(two.rows.every(r=>Number.isFinite(r.force)&&r.force>=0),'ground does not pull');
assert.ok(two.rows.every(r=>Number.isFinite(r.legForce)&&r.legForce>=0),'compression-only leg');
assert.ok(s.contactTime!==null && s.contactTime>0,'landing detected');
assert.ok(s.peakBW>0 && s.peakBW<12,'finite force');
close(s.groundImpulse,d.mass*(two.rows.at(-1).comVelocity-two.rows[0].comVelocity+d.g*d.duration),0.12,'vertical impulse-momentum');
assert.ok(s.energyDrift<0.01,`total mechanical+loss energy drift ${s.energyDrift} J`);

const sHalf=summarize(simulateTwo({...d,dt:d.dt/2}));
assert.ok(Math.abs(sHalf.peakBW-s.peakBW)/sHalf.peakBW<0.02,'peak force converges within 2% when halving dt');
assert.ok(sHalf.energyDrift<s.energyDrift*2+0.001,'refined time step stable');

const slow=summarize(simulateTwo({...d,initialFootVelocity:-1}));
const fast=summarize(simulateTwo({...d,initialFootVelocity:-3}));
assert.ok(fast.peakBW>slow.peakBW,'faster distal impact yields greater peak force in default example');

const undamped=simulateTwo({...d,legDamping:0,groundDamping:0});
assert.ok(undamped.maxDrift<0.02,`conservative energy error ${undamped.maxDrift} J`);
const damped=simulateTwo(d);
assert.ok(damped.rows.at(-1).dissipated>0,'positive accumulated dissipation');

const x=[-0.01,-1,0.90,-0.5,0];
const p={...d,groundDamping:0,legDamping:0};
const q=forces(x,p),a=derivatives(x,p),m1=p.mass*p.distalFraction,m2=p.mass-m1;
close(m1*(a[1]+p.g)+m2*(a[3]+p.g),q.ground,1e-9,'sum of Newton equations');
assert.ok(Number.isFinite(energy(x,p)));

console.log(JSON.stringify({tests:'passed',mass:d.mass,distal_fraction:d.distalFraction,peak_BW:s.peakBW,force_impulse_Ns:s.groundImpulse,impulse_residual_Ns:s.impulseResidual,energy_residual_J:s.energyDrift,half_step_peak_BW:sHalf.peakBW,undamped_energy_drift_J:undamped.maxDrift},null,2));
