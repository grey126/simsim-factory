import fs from 'node:fs';

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;');
const palettes=[
  ['#315cff','#d8ff67','#fffdf7'],['#ff6547','#ffd66b','#fff8e8'],['#36a878','#ffd6df','#fffaf3'],
  ['#7657d5','#bfefff','#fffdf7'],['#ec4770','#d8ff67','#fff8ed'],['#247d91','#ffcf73','#fffdf7']
];

function prop(kind,cx,cy,ink){
 const p={
  spark:`<path d="M${cx} ${cy-42}l9 25 25 9-25 9-9 25-9-25-25-9 25-9z" fill="#ffd63d" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>`,
  clipboard:`<rect x="${cx-28}" y="${cy-42}" width="56" height="74" rx="8" fill="#fff" stroke="${ink}" stroke-width="7"/><path d="M${cx-12} ${cy-45}h24v13h-24zM${cx-15} ${cy-8}h30M${cx-15} ${cy+8}h24" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`,
  heart:`<path d="M${cx} ${cy+30}C${cx-62} ${cy-3} ${cx-35} ${cy-45} ${cx} ${cy-18}C${cx+35} ${cy-45} ${cx+62} ${cy-3} ${cx} ${cy+30}z" fill="#ff6685" stroke="${ink}" stroke-width="7"/>`,
  book:`<path d="M${cx} ${cy-32}c-22-14-43-10-55-3v65c18-9 39-8 55 5 16-13 37-14 55-5v-65c-12-7-33-11-55 3z" fill="#fff" stroke="${ink}" stroke-width="7"/><path d="M${cx} ${cy-30}v63" stroke="${ink}" stroke-width="6"/>`,
  eye:`<path d="M${cx-55} ${cy}q55-55 110 0-55 55-110 0z" fill="#fff" stroke="${ink}" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="15" fill="${ink}"/>`,
  map:`<path d="M${cx-56} ${cy-32}l37-12 38 12 37-12v70l-37 12-38-12-37 12z" fill="#fff" stroke="${ink}" stroke-width="7"/><path d="M${cx-19} ${cy-44}v70M${cx+19} ${cy-32}v70" stroke="${ink}" stroke-width="5"/>`,
  peace:`<path d="M${cx-45} ${cy+20}q45-55 90 0" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><circle cx="${cx-45}" cy="${cy+18}" r="10" fill="#fff" stroke="${ink}" stroke-width="5"/><circle cx="${cx+45}" cy="${cy+18}" r="10" fill="#fff" stroke="${ink}" stroke-width="5"/>`,
  camera:`<rect x="${cx-52}" y="${cy-30}" width="104" height="68" rx="12" fill="#fff" stroke="${ink}" stroke-width="7"/><circle cx="${cx}" cy="${cy+4}" r="22" fill="#bfefff" stroke="${ink}" stroke-width="7"/><path d="M${cx-30} ${cy-30}l10-16h38l10 16" fill="#fff" stroke="${ink}" stroke-width="7"/>`,
  cup:`<path d="M${cx-38} ${cy-30}h72v65h-72zM${cx+34} ${cy-15}q35 0 20 35-8 12-20 8" fill="#fff" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>`,
  pencil:`<path d="M${cx-48} ${cy+25}l76-76 28 28-76 76-35 8z" fill="#ffd563" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>`,
  leaf:`<path d="M${cx-5} ${cy+42}q-10-80 70-90 7 77-70 90z" fill="#72cf67" stroke="${ink}" stroke-width="7"/><path d="M${cx-5} ${cy+42}q20-43 55-65" fill="none" stroke="${ink}" stroke-width="6"/>`,
  ball:`<circle cx="${cx}" cy="${cy}" r="48" fill="#ffd564" stroke="${ink}" stroke-width="7"/><path d="M${cx-45} ${cy-10}q45 25 90 0M${cx-10} ${cy-45}q25 45 0 90" fill="none" stroke="${ink}" stroke-width="6"/>`,
  sword:`<path d="M${cx-8} ${cy+44}l12-78 18-18 8 25-20 74zM${cx-25} ${cy+20}l48 8" fill="#e6edf3" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>`,
  shield:`<path d="M${cx} ${cy-48}l48 18v33q0 40-48 61-48-21-48-61v-33z" fill="#bfefff" stroke="${ink}" stroke-width="7"/><path d="M${cx} ${cy-29}v66M${cx-27} ${cy+3}h54" stroke="${ink}" stroke-width="6"/>`,
  potion:`<path d="M${cx-18} ${cy-48}h36v23q35 18 35 53 0 34-53 34t-53-34q0-35 35-53z" fill="#ff9bd0" stroke="${ink}" stroke-width="7"/><path d="M${cx-32} ${cy+13}q32 18 64 0" stroke="${ink}" stroke-width="5" fill="none"/>`,
  music:`<path d="M${cx+25} ${cy-48}v70q-15-10-33 0-16 10-7 25 9 14 29 4 11-6 11-22v-47l44-10v52q-15-10-33 0-16 10-7 25 9 14 29 4 11-6 11-22v-91z" fill="${ink}"/>`,
  bow:`<path d="M${cx-30} ${cy-55}q70 55 0 110M${cx-32} ${cy-55}v110M${cx-38} ${cy}h88l-18-14m18 14-18 14" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  wand:`<path d="M${cx-35} ${cy+45}l65-78" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="M${cx+38} ${cy-55}l8 19 20 1-16 13 5 20-17-11-17 11 5-20-16-13 20-1z" fill="#ffd63d" stroke="${ink}" stroke-width="6"/>`,
  dragon:`<path d="M${cx-58} ${cy+32}q28-70 67-34 27-55 71-15-29 0-28 32 1 34-38 34-25 0-34-15-18 10-38-2z" fill="#78d28b" stroke="${ink}" stroke-width="7"/><path d="M${cx+18} ${cy-10}l18-30 13 34" fill="#ffd563" stroke="${ink}" stroke-width="6"/><circle cx="${cx+48}" cy="${cy+2}" r="4" fill="${ink}"/>`
 };
 return p[kind]||p.spark;
}

function mascot({x,y,w,h,index,prop:kind='spark',palette,hat=false}){
 const ink='#232323',[main,accent,bg]=palette||palettes[index%palettes.length];
 const cx=x+w/2, ground=y+h*.87, headY=y+h*.35, headR=Math.min(w,h)*.19, bodyW=headR*1.45, bodyH=headR*1.25;
 const dots=Array.from({length:26},(_,i)=>`<circle cx="${x+22+(i*71)%Math.max(40,w-44)}" cy="${y+18+(i*47)%Math.max(40,h-36)}" r="1.5" fill="#232323" opacity=".09"/>`).join('');
 return `<g>${dots}<ellipse cx="${cx}" cy="${ground}" rx="${headR*1.15}" ry="${headR*.18}" fill="#232323" opacity=".12"/>
 <path d="M${cx-bodyW/2} ${ground-bodyH}q${bodyW/2} ${-bodyH*.28} ${bodyW} 0v${bodyH*.7}q-${bodyW/2} ${bodyH*.32}-${bodyW} 0z" fill="${main}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
 <path d="M${cx-bodyW*.25} ${ground-bodyH*.08}v${headR*.38}M${cx+bodyW*.25} ${ground-bodyH*.08}v${headR*.38}" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>
 <circle cx="${cx}" cy="${headY}" r="${headR}" fill="${accent}" stroke="${ink}" stroke-width="7"/>
 ${hat?`<path d="M${cx-headR*.82} ${headY-headR*.55}q${headR*.8-headR*.0} ${-headR*.85} ${headR*1.65} 0" fill="${main}" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`:''}
 <circle cx="${cx-headR*.34}" cy="${headY-headR*.02}" r="${headR*.075}" fill="${ink}"/><circle cx="${cx+headR*.34}" cy="${headY-headR*.02}" r="${headR*.075}" fill="${ink}"/>
 <path d="M${cx-headR*.13} ${headY+headR*.28}q${headR*.13} ${headR*.11} ${headR*.26} 0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
 <circle cx="${cx-headR*.57}" cy="${headY+headR*.24}" r="${headR*.11}" fill="#ff8d91" opacity=".65"/><circle cx="${cx+headR*.57}" cy="${headY+headR*.24}" r="${headR*.11}" fill="#ff8d91" opacity=".65"/>
 ${prop(kind,x+w*.23,y+h*.62,ink)}</g>`;
}

function sheet(file,cols,rows,cellW,cellH,items){
 const width=cols*cellW,height=rows*cellH;
 const cells=items.map((item,i)=>{const x=(i%cols)*cellW,y=Math.floor(i/cols)*cellH;return `<g><rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${item.bg||'#f4efe5'}"/>${mascot({x,y,w:cellW,h:cellH,index:i,...item})}</g>`;}).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f4efe5"/>${cells}</svg>`;
 fs.writeFileSync(new URL(`../assets/${esc(file)}`,import.meta.url),svg);
}

sheet('group-types.svg',3,2,512,512,[
 {prop:'spark',bg:'#dce5ff'},{prop:'clipboard',bg:'#eeffd2'},{prop:'heart',bg:'#ffe3e7'},
 {prop:'book',bg:'#e8e0ff'},{prop:'eye',bg:'#dff4f5'},{prop:'map',bg:'#fff0cb'}]);
sheet('extra-types.svg',2,2,512,768,[
 {prop:'peace',bg:'#daf3e6'},{prop:'camera',bg:'#fff0c9'},{prop:'cup',bg:'#f7e2d8'},{prop:'pencil',bg:'#e4e2ff'}]);
sheet('manual-types.svg',2,2,512,768,[
 {prop:'cup',bg:'#dfe8f7'},{prop:'heart',bg:'#ffe3e7'},{prop:'map',bg:'#fff1c9'},{prop:'clipboard',bg:'#e3f4df'}]);
sheet('manual-more-types.svg',2,1,768,1024,[{prop:'leaf',bg:'#dff2d2'},{prop:'ball',bg:'#ffe3a8'}]);
sheet('fantasy-types.svg',4,3,512,512,[
 {prop:'sword',bg:'#ffe1d5',hat:true},{prop:'shield',bg:'#dce7ff',hat:true},{prop:'heart',bg:'#e0f4e6',hat:true},{prop:'sword',bg:'#eee4ff'},
 {prop:'wand',bg:'#dfddff',hat:true},{prop:'bow',bg:'#e1f2d6'},{prop:'map',bg:'#e7e7ed',hat:true},{prop:'music',bg:'#ffe8bb'},
 {prop:'potion',bg:'#f1ddff'},{prop:'spark',bg:'#d9f0ff',hat:true},{prop:'shield',bg:'#dcebdd'},{prop:'dragon',bg:'#ffe0cf',hat:true}
]);
for(const file of ['group-chat.json','manual.json','fantasy-job.json']){
 const path=new URL(`../content/${file}`,import.meta.url);
 const next=fs.readFileSync(path,'utf8')
  .replaceAll('group-types.png','group-types.svg')
  .replaceAll('extra-types.png','extra-types.svg')
  .replaceAll('manual-types.png','manual-types.svg')
  .replaceAll('manual-more-types.png','manual-more-types.svg')
  .replaceAll('fantasy-types.png','fantasy-types.svg');
 fs.writeFileSync(path,next);
}
console.log('Cute vector mascot sheets created.');
