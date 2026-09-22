export function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3500);}
export async function copyLink(url){try{await navigator.clipboard.writeText(url);toast('링크를 복사했어요. 친구에게 보내 주세요!');}catch{const d=document.querySelector('#info');document.querySelector('#info-content').innerHTML='<h2>링크 복사</h2><p>아래 링크를 길게 눌러 복사해 주세요.</p><textarea readonly aria-label="공유 링크" rows="4"></textarea>';d.querySelector('textarea').value=url;d.showModal();d.querySelector('textarea').select();}}
export async function shareLink(title,url){if(navigator.share){try{await navigator.share({title,text:title,url});return;}catch(e){if(e.name==='AbortError')return;}}await copyLink(url);}
function wrap(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const c of text){if(ctx.measureText(line+c).width>maxWidth&&line){ctx.fillText(line,x,y);line=c;y+=lineHeight;}else line+=c;}if(line)ctx.fillText(line,x,y);return y+lineHeight;}
export function drawCard({title,subtitle,tags=[],traits=[],name='',code=''}){
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#5637e8';ctx.fillRect(0,0,1080,1920);ctx.fillStyle='#d7fa70';ctx.font='bold 34px sans-serif';ctx.fillText('SIMSIM FACTORY',80,112);ctx.font='bold 30px sans-serif';ctx.fillText('심심공장',850,112);
 ctx.fillStyle='#ffffff';ctx.beginPath();ctx.roundRect(60,190,960,1540,44);ctx.fill();
 ctx.fillStyle='#6c618b';ctx.font='28px sans-serif';ctx.fillText(code||'나를 발견하는 작은 놀이',110,275);
 ctx.fillStyle='#5637e8';ctx.font='bold 36px sans-serif';let y=wrap(ctx,name?name+' 님의 결과':'오늘 발견한 나',110,365,860,50);
 ctx.fillStyle='#25232b';ctx.font='bold 76px sans-serif';y=wrap(ctx,title,110,y+95,850,104);
 ctx.fillStyle='#655979';ctx.font='34px sans-serif';y=wrap(ctx,subtitle,110,y+45,850,55);
 ctx.fillStyle='#5637e8';ctx.font='bold 29px sans-serif';y=wrap(ctx,tags.map(t=>'#'+t).join('  '),110,y+45,850,48);
 for(const [label,text] of traits){y+=55;ctx.fillStyle='#5637e8';ctx.font='bold 27px sans-serif';ctx.fillText(label,110,y);y+=49;ctx.fillStyle='#342d44';ctx.font='33px sans-serif';y=wrap(ctx,text,110,y,850,51);}
 ctx.fillStyle='#ffffff';ctx.font='bold 35px sans-serif';ctx.fillText('심심한 틈에, 새로운 나.',80,1825);ctx.font='24px sans-serif';ctx.fillText('재미로 즐기는 테스트 · simsim-factory',80,1874);return canvas;
}
export async function saveCard(card){try{const canvas=drawCard(card);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='심심공장-결과.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('결과 이미지를 저장했어요. 다운로드 목록을 확인해 주세요.');}catch{toast('이미지 저장에 실패했어요. 다시 시도해 주세요.');}}
export async function shareCard(card,url){try{const canvas=drawCard(card);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const file=new File([blob],'simsim-result.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:card.title,text:'심심공장에서 내 결과도 확인해 봐! '+url});return;}await saveCard(card);toast('이미지를 저장한 뒤 원하는 SNS에 올려 주세요.');}catch(e){if(e.name!=='AbortError')await saveCard(card);}}
