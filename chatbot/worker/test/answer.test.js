import test from "node:test";
import assert from "node:assert/strict";
import { ANSWER_FORMAT, parseGroundedAnswer } from "../src/answer.js";
const src = [{title:"A"},{title:"B"}];
function model(points, status = "answer", limitations = "Dette er kun en faglig disposisjon; originalartikler er ikke evaluert.") {
  return { status:"completed", output:[{ content:[{type:"output_text", text: JSON.stringify({status, points, limitations})}] }] };
}
const claim=(kind="definisjon", ids=[1])=>({kind,text:"Tretthet og trettbarhet er begreper som må defineres hver for seg.",source_ids:ids});

test("schema er strengt og har ingen åpne ekstrafelt",()=>{
  assert.equal(ANSWER_FORMAT.type,"json_schema");
  assert.equal(ANSWER_FORMAT.strict,true);
  assert.equal(ANSWER_FORMAT.schema.additionalProperties,false);
  assert.equal(ANSWER_FORMAT.schema.properties.points.items.additionalProperties,false);
});
test("ett punkt blir merket med type, kilde og forbehold",()=>{
  const x=parseGroundedAnswer(model([claim()]),src);
  assert.equal(x.status,"answer");
  assert.match(x.answer,/Definisjon:/);
  assert.match(x.answer,/\[1\]/);
  assert.match(x.answer,/Begrensninger:/);
  assert.deepEqual(x.cited,[1]);
});
test("ulike påstandstyper og flere kilder",()=>{
  const p=[claim("observasjon",[2,1]),claim("fortolkning",[2,2])];
  const x=parseGroundedAnswer(model(p),src);
  assert.deepEqual(x.cited,[1,2]);
  assert.match(x.answer,/Observasjon:/);
  assert.match(x.answer,/Fortolkning:/);
});
test("insufficient kan returneres uten konklusjon",()=>{
  const x=parseGroundedAnswer(model([],"insufficient"),src);
  assert.equal(x.status,"insufficient");
  assert.deepEqual(x.cited,[]);
});
test("fraværende kilder eller falske kilde-ID-er avvises",()=>{
  assert.equal(parseGroundedAnswer(model([claim("definisjon",[])]),src),null);
  assert.equal(parseGroundedAnswer(model([claim("definisjon",[3])]),src),null);
});
test("ikke-gjennomført API-respons avvises",()=>{
  const x=model([claim()]);x.status="incomplete";
  assert.equal(parseGroundedAnswer(x,src),null);
});
test("refusals og JSON-feil avvises",()=>{
  assert.equal(parseGroundedAnswer({status:"completed",output:[{content:[{type:"refusal",refusal:"Nei"}]}]},src),null);
  assert.equal(parseGroundedAnswer({status:"completed",output:[{content:[{type:"output_text",text:"ikke JSON"}]}]},src),null);
});
test("modellens frie tekst kan ikke snevre inn kildevalidering",()=>{
  const p=claim();p.text="En påstand med falskt nettsted https://fake.invalid";
  assert.equal(parseGroundedAnswer(model([p]),src),null);
  const q=claim();q.text="Påstand med egne [99] kildehenvisninger";
  assert.equal(parseGroundedAnswer(model([q]),src),null);
});
test("svar uten eksplisitte forbehold avvises",()=>{
  assert.equal(parseGroundedAnswer(model([claim()],"answer",""),src),null);
});
test("kortmodus har maksimum tre påstander",()=>{
  assert.equal(parseGroundedAnswer(model([claim(),claim(),claim(),claim()]),src,"kort"),null);
  assert.notEqual(parseGroundedAnswer(model([claim(),claim(),claim(),claim()]),src,"fordypning"),null);
});
