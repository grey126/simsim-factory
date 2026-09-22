import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {encodeChallenge,decodeChallenge,matchScore,scoreQuiz,escapeHTML,validName} from '../js/core.js';
const read=id=>JSON.parse(fs.readFileSync(new URL(`../content/${id}.json`,import.meta.url),'utf8'));
const challenge=read('know-me');
test('Korean/emoji names and every answer round trip through fragment',()=>{for(const name of ['심심이','친구 😄','<script>']){const a=challenge.questions.map((_,i)=>i%4);assert.deepEqual(decodeChallenge(encodeChallenge(name,a),challenge.questions),{name,answers:a});}});
test('Malformed, oversized, outdated and invalid answer payloads rejected',()=>{for(const value of ['', '###','a'.repeat(2001),btoa('{}'),btoa(JSON.stringify({v:2,n:'a',a:Array(8).fill(0)})),encodeChallenge('a',Array(8).fill(99)),encodeChallenge('',Array(8).fill(0)),encodeChallenge('a',[]),encodeChallenge('a'.repeat(17),Array(8).fill(0))])assert.throws(()=>decodeChallenge(value,challenge.questions));});
test('Friend scores calculate 0, partial and perfect correctly',()=>{assert.equal(matchScore([0,1,2,3],[0,1,2,3]),100);assert.equal(matchScore([0,1,2,3],[1,2,3,0]),0);assert.equal(matchScore([0,1,2,3],[0,1,0,0]),50);assert.throws(()=>matchScore([],[]));});
test('Untrusted names escaped for rendering',()=>{assert.equal(escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');assert.equal(validName('  '),false);assert.equal(validName('a'.repeat(17)),false);});
for(const id of ['group-chat','manual']){
 const d=read(id);
 test(`${id}: content references and every result reachable`,()=>{assert.equal(d.questions.length,id==='group-chat'?12:8);const ids=d.results.map(r=>r.id);assert.equal(new Set(ids).size,ids.length);for(const q of d.questions){assert.ok(q.text);assert.ok(q.options.length>=2);for(const o of q.options){assert.ok(o.text);for(const [k,v] of Object.entries(o.scores)){assert.ok(ids.includes(k));assert.ok(Number.isFinite(v));}}}for(const r of d.results){const answers=d.questions.map(q=>{const index=q.options.findIndex(o=>o.scores[r.id]);return index<0?0:index;});assert.equal(scoreQuiz(d.questions,answers,d.results).id,r.id);assert.ok(r.traits.length===3);}});
 test(`${id}: repeat scoring deterministic and incomplete answers rejected`,()=>{const a=d.questions.map(()=>0);assert.deepEqual(scoreQuiz(d.questions,a,d.results),scoreQuiz(d.questions,a,d.results));assert.throws(()=>scoreQuiz(d.questions,[],d.results));});
}
test('No third-party scripts or tracking dependencies',()=>{const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.doesNotMatch(html,/<script[^>]*src=["']https?:/);const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url)));assert.equal(Object.keys(pkg.dependencies||{}).length,0);});
