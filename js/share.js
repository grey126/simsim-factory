export function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3500);}
export async function copyLink(url){try{await navigator.clipboard.writeText(url);toast('링크를 복사했어요. 친구에게 보내 주세요!');}catch{const d=document.querySelector('#info');document.querySelector('#info-content').innerHTML='<h2>링크 복사</h2><p>아래 링크를 길게 눌러 복사해 주세요.</p><textarea readonly aria-label="공유 링크" rows="4"></textarea>';d.querySelector('textarea').value=url;d.showModal();d.querySelector('textarea').select();}}
export async function shareLink(title,url){if(navigator.share){try{await navigator.share({title,text:title,url});return;}catch(e){if(e.name==='AbortError')return;}}await copyLink(url);}

function wrap(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const c of text){if(ctx.measureText(line+c).width>maxWidth&&line){ctx.fillText(line,x,y);line=c;y+=lineHeight;}else line+=c;}if(line)ctx.fillText(line,x,y);return y+lineHeight;}
function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});}
function seedNoise(ctx){let n=731;ctx.fillStyle='rgba(18,18,18,.07)';for(let i=0;i<900;i++){n=(n*48271)%2147483647;const x=n%1080;n=(n*48271)%2147483647;const y=n%1920;ctx.fillRect(x,y,1+(i%2),1+(i%3===0));}}
async function drawCharacter(ctx,sprite,x,y,w,h){if(!sprite)return false;try{const image=await loadImage(sprite.src);const columns=sprite.columns||1,rows=sprite.rows||1,index=sprite.index||0;const sw=image.naturalWidth/columns,sh=image.naturalHeight/rows;const sx=(index%columns)*sw,sy=Math.floor(index/columns)*sh;const scale=Math.min(w/sw,h/sh),dw=sw*scale,dh=sh*scale,dx=x+(w-dw)/2,dy=y+(h-dh)/2;ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,18);ctx.clip();ctx.fillStyle='#fffdf6';ctx.fillRect(x,y,w,h);ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);ctx.restore();ctx.strokeStyle='#121212';ctx.lineWidth=5;ctx.strokeRect(x,y,w,h);return true;}catch{return false;}}

export async function drawCard({title,subtitle,tags=[],traits=[],name='',code='',keyword='',character='',accent='#ff5a36',sprite=null}){
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#f3efe6';ctx.fillRect(0,0,1080,1920);seedNoise(ctx);
 ctx.fillStyle='#121212';ctx.fillRect(0,0,1080,142);ctx.fillStyle='#caff45';ctx.fillRect(0,142,1080,18);
 ctx.fillStyle='#fffdf6';ctx.font='900 38px sans-serif';ctx.fillText('OLTD / ORUWAN',60,88);ctx.font='700 24px sans-serif';ctx.fillText('TYPE ARCHIVE · 2026',760,85);
 const color=accent||'#ff5a36';ctx.fillStyle=color;ctx.fillRect(55,218,970,64);ctx.fillStyle='#121212';ctx.font='900 30px sans-serif';ctx.fillText(`${code||'MY TYPE'} / ${keyword||'RESULT'}`,78,262);
 ctx.strokeStyle='#121212';ctx.lineWidth=5;ctx.strokeRect(55,318,970,585);
 ctx.fillStyle='#121212';ctx.font='800 27px sans-serif';ctx.fillText(name?`${name} 님의 결과`:'오늘 발견한 나',82,375);
 ctx.font='900 70px sans-serif';const parts=String(title).split('·').map(v=>v.trim());let ty=475;ty=wrap(ctx,parts[0]||title,82,ty,410,82);if(parts[1]){ctx.font='900 48px sans-serif';ty=wrap(ctx,parts[1],82,ty+8,410,62);}
 ctx.fillStyle=color;ctx.fillRect(82,ty+18,390,10);
 ctx.fillStyle='#35312d';ctx.font='30px sans-serif';wrap(ctx,subtitle,82,ty+88,400,48);
 const hasCharacter=await drawCharacter(ctx,sprite,545,355,430,500);
 if(!hasCharacter){ctx.fillStyle=color;ctx.fillRect(545,355,430,500);ctx.fillStyle='#121212';ctx.font='900 120px sans-serif';ctx.textAlign='center';ctx.fillText(keyword||'TYPE',760,620);ctx.textAlign='left';}
 if(character){ctx.fillStyle='#121212';ctx.fillRect(545,803,430,52);ctx.fillStyle='#fffdf6';ctx.font='800 25px sans-serif';ctx.fillText(`CHARACTER / ${character}`,568,838);}
 ctx.font='800 25px sans-serif';ctx.fillStyle='#121212';let tagX=62;for(const tag of tags){const label=`#${tag}`;const width=ctx.measureText(label).width+34;if(tagX+width>1010)break;ctx.fillStyle='#fffdf6';ctx.strokeStyle='#121212';ctx.lineWidth=3;ctx.fillRect(tagX,944,width,54);ctx.strokeRect(tagX,944,width,54);ctx.fillStyle='#121212';ctx.fillText(label,tagX+17,980);tagX+=width+12;}
 let y=1070;for(const [label,text] of traits){ctx.fillStyle=color;ctx.fillRect(60,y-34,212,50);ctx.fillStyle='#121212';ctx.font='900 25px sans-serif';ctx.fillText(label,78,y);ctx.strokeStyle='#121212';ctx.lineWidth=3;ctx.strokeRect(60,y-34,960,190);ctx.fillStyle='#26231f';ctx.font='34px sans-serif';wrap(ctx,text,82,y+65,900,52);y+=230;}
 ctx.fillStyle='#121212';ctx.fillRect(0,1770,1080,150);ctx.fillStyle='#fffdf6';ctx.font='900 34px sans-serif';ctx.fillText('오늘도 가볍게, 내 캐릭터 찾기.',58,1830);ctx.fillStyle='#caff45';ctx.font='700 23px sans-serif';ctx.fillText('오루완 · OLTD · 재미로 즐기는 캐릭터 테스트',58,1877);return canvas;
}

export async function saveCard(card){try{const canvas=await drawCard(card);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`오루완-${card.keyword||'결과'}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('결과 이미지를 저장했어요. 다운로드 목록을 확인해 주세요.');}catch{toast('이미지 저장에 실패했어요. 다시 시도해 주세요.');}}
export async function shareCard(card,url){try{const canvas=await drawCard(card);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const file=new File([blob],'simsim-result.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:card.title,text:`나는 ${card.keyword||card.title}! 너는 어떤 타입이야? ${url}`});return;}await saveCard(card);toast('이미지를 저장한 뒤 원하는 SNS에 올려 주세요.');}catch(e){if(e.name!=='AbortError')await saveCard(card);}}
