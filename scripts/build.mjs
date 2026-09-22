import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
for(const name of ['index.html','assets','js','content'])fs.cpSync(name,`dist/${name}`,{recursive:true});
fs.writeFileSync('dist/.nojekyll','');
fs.writeFileSync('dist/404.html','<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>페이지를 찾을 수 없어요 | 오루완</title><body style="font:18px sans-serif;text-align:center;padding:80px 20px"><h1>페이지를 찾을 수 없어요</h1><p>오루완 홈에서 놀이를 다시 골라 주세요.</p><a href="/simsim-factory/">오루완으로 가기</a></body></html>');
console.log('Static site ready in dist/');
