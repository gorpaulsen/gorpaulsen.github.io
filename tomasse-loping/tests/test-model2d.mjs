import assert from 'node:assert/strict';
import {defaults2D,simulate2D,leg2D} from '../model2d.mjs';
const near=(x,y,tol,label)=>assert.ok(Math.abs(x-y)<tol,`${label}: got ${x}, expected ${y} ± ${tol}`);
const d=defaults2D(),r=simulate2D(),s=r.summary,ev=r.events;
assert.equal(d.mass,75);
assert.equal(d.distalFraction,.08);
assert.equal(s.invalid,null,'default satisfies sticking/ground feasibility');
assert.ok(s.toeoffs>=2&&s.touchdowns>=2,'two complete swing/landing events');
assert.deepEqual(ev.slice(0,5).map(x=>x.type),['initial_stance','toeoff','touchdown','toeoff','touchdown']);
assert.ok(s.maxFrictionUsage<1,'static friction within Coulomb bound');
assert.ok(s.peakBW>0&&s.peakBW<6,'illustrative finite support force');
assert.ok(r.series.every(x=>Number.isFinite(x.grfZ)&&x.grfZ>=0),'nonnegative stance normal force');
assert.ok(r.series.filter(x=>x.mode==='stance').every(x=>Math.abs(x.footZ)<1e-10),'sticking foot stays at ground');
assert.ok(s.dissipation>0&&s.collisionLoss>0,'explicit dissipation and collision loss');
assert.ok(s.positiveActuatorWork>0&&s.negativeActuatorWork>0,'swing actuator positive and negative work');
near(s.positiveActuatorWork-s.negativeActuatorWork,s.actuatorWork,1e-4,'signed actuator work');
near(s.impulseResidualX,0,.01,'horizontal momentum balance');
near(s.impulseResidualY,0,.01,'vertical momentum balance');
assert.ok(s.maxEnergyError<.003,`energy closure ${s.maxEnergyError} J`);
for(const e of ev.filter(x=>x.type==='touchdown')){
 assert.ok(e.impulseY>=0,'plastic impact normal impulse');
 near(e.impactLoss,.5*d.mass*d.distalFraction*(e.footVX**2+e.footVZ**2),1e-8,'impact energy loss');
 assert.ok(e.restLength<=d.restLength,'no axial spring preload jump');
 assert.ok(Math.abs(e.impulseX)<=d.mu*e.impulseY,'default sticking collision friction feasible');
}
const fine=simulate2D({dt:d.dt/2}),f=fine.summary;
near(f.peakBW,s.peakBW,.03,'half time step peak force convergence');
near(fine.events[2].t,ev[2].t,.005,'half time step landing event');
assert.ok(f.maxEnergyError<.003,'refined step energy accounting');
const passive=simulate2D({swingEnabled:false,duration:.35});
near(passive.summary.actuatorWork,0,1e-10,'motor off means no actuation');
near(passive.summary.positiveActuatorWork,0,1e-10,'motor off means no positive work');
assert.ok(passive.summary.maxEnergyError<.005,'passive energy accounting');
assert.equal(simulate2D({mu:.05,duration:.35}).summary.invalid,'static_friction_limit_exceeded','reject infeasible stick');
assert.ok(leg2D([0,0,0,0,0,.92,0,-.5],d,'stance',d.restLength).F>0,'compressive stance spring');
assert.equal(leg2D([0,0,0,0,0,.92,0,-.5],d,'flight',d.restLength).F,0,'unloaded swing leg');
console.log(JSON.stringify({status:'PASS',peakBW:s.peakBW,landings:s.touchdowns,
 energyErrorJ:s.maxEnergyError,impulseResidualXNs:s.impulseResidualX,
 impulseResidualYNs:s.impulseResidualY,actuatorWorkJ:s.actuatorWork},null,2));
