import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluate} from '../../evals/assert.mjs';
import {observe} from '../../references/broken.mjs';
test('repeated reads must not overwhelm claims-core',()=>{
 const requests=Array.from({length:60},(_,i)=>({customerCode:'CUS-000123',atMs:i*10}));
 assert.equal(evaluate(observe(requests)).pass,false);
});
