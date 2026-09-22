export const VERSION = 1;
export function encodeChallenge(name, answers) {
  const payload = JSON.stringify({v:VERSION,n:name.trim(),a:answers});
  return btoa(String.fromCharCode(...new TextEncoder().encode(payload))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
export function decodeChallenge(code, questions) {
  if (!code || code.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(code)) throw new Error('올바르지 않은 초대 링크예요. 친구에게 링크를 다시 받아 주세요.');
  try {
    const bytes=Uint8Array.from(atob(code.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
    const p=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    if(p.v!==VERSION || typeof p.n!=='string' || !p.n.trim() || [...p.n].length>16 || /[\u0000-\u001f\u007f]/u.test(p.n) || !Array.isArray(p.a) || p.a.length!==questions.length || !p.a.every((a,i)=>Number.isInteger(a)&&a>=0&&a<questions[i].options.length)) throw new Error();
    return {name:p.n,answers:p.a};
  } catch {throw new Error('올바르지 않은 초대 링크예요. 친구에게 링크를 다시 받아 주세요.');}
}
export function scoreQuiz(questions, answers, results) {
  if(answers.length!==questions.length) throw new Error('모든 질문에 답해 주세요.');
  const scores=Object.fromEntries(results.map(r=>[r.id,0]));
  answers.forEach((a,i)=>{const o=questions[i]?.options[a];if(!o)throw new Error('잘못된 답변');for(const [id,value] of Object.entries(o.scores)){if(!(id in scores))throw new Error('잘못된 결과 유형');scores[id]+=value;}});
  // Equal scores use the published result order for reproducibility.
  return results.reduce((best,r)=>scores[r.id]>scores[best.id]?r:best,results[0]);
}
export function matchScore(expected,actual){if(!expected.length||expected.length!==actual.length)throw new Error('답변 수 불일치');return Math.round(expected.filter((v,i)=>v===actual[i]).length/expected.length*100);}
export const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validName(name){return name.trim().length>0 && [...name.trim()].length<=16 && !/[\u0000-\u001f\u007f]/u.test(name);}
