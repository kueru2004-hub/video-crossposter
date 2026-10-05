import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
function setup(){
  const nodes=new Map(),revoked=[],uploads=[];
  const node=id=>{
    if(!nodes.has(id))nodes.set(id,{value:'',checked:false,hidden:false,textContent:'',files:[],options:[],
      append(){},pause(){this.paused=true},load(){this.loaded=true},removeAttribute(name){delete this[name]},
      getContext(){return{clearRect:()=>{this.cleared=true}}}});
    return nodes.get(id);
  };
  const targets=[{value:'youtube',checked:true},{value:'tiktok',checked:false}];
  node('#pl').options=[{value:'',textContent:'追加しない'},{value:'genshin',textContent:'原神'}];
  node('#f').reset=()=>{for(const [id,n] of nodes){if(['#t','#d','#v','#yth','#ya','#tagName','#tagText','#tp'].includes(id)){n.value='';n.files=[]}n.checked=false}node('#tm').value='direct';node('#yp').value='private';targets.forEach(x=>x.checked=true)};
  const context=vm.createContext({document:{querySelector:node,querySelectorAll:s=>s==='[name=x]'?targets:s==='[name=x]:checked'?targets.filter(x=>x.checked):[],createElement:()=>({append(){}})},
    fetch:()=>new Promise(()=>{}),localStorage:{getItem:()=>null,setItem(){}},URL:{revokeObjectURL:url=>revoked.push(url)},Date,JSON,console,setTimeout,uploads});
  vm.runInContext(source,context);
  vm.runInContext("youtube=async (...args)=>{uploads.push(args);return {url:'https://youtu.be/test',scheduled:args[4]}};saveYoutubeHistory=(title,url)=>{globalThis.savedHistory={title,url}}",context);
  function fill(title='first'){
    node('#v').files=[{name:title+'.mp4'}];node('#v').value='video';node('#t').value=title;node('#d').value='description';node('#ya').value='2026-10-06T19:30';node('#yth').files=[{name:'image.jpg'}];node('#yth').value='image';node('#tiktokConsent').checked=true;node('#tp').value='SELF_ONLY';
    vm.runInContext("previewUrl='blob:old';selectedDuration=37;selectedThumbnailFile={name:'frame.jpg'}",context);
    node('#preview').src='blob:old';node('#thumbnailFrameStatus').textContent='selected';
  }
  return{node,targets,context,revoked,uploads,fill,submit:()=>node('#f').onsubmit({preventDefault(){}})};
}
test('scheduled success clears all per-video state but preserves result, history and destination',async()=>{
  const s=setup();s.fill();await s.submit();
  for(const id of ['#v','#t','#d','#yth','#ya','#tp'])assert.equal(s.node(id).value,'',id);
  assert.equal(s.node('#preview').src,undefined);assert.equal(s.node('#preview').hidden,true);
  assert.equal(s.node('#thumbnailFramePreview').cleared,true);
  assert.equal(s.node('#downloadThumbnailFrame').hidden,true);
  assert.equal(s.node('#thumbnailFrameStatus').textContent,'');
  assert.equal(s.node('#tiktokConsent').checked,false);
  assert.equal(s.node('#pl').value,'genshin');assert.equal(s.targets[1].checked,false);
  assert.deepEqual(s.revoked,['blob:old']);
  assert.equal(vm.runInContext('selectedThumbnailFile',s.context),null);
  assert.equal(vm.runInContext('selectedDuration',s.context),0);
  assert.equal(s.node('#youtubeResult').hidden,false);
  assert.equal(s.context.savedHistory.title,'first');
  assert.ok(JSON.parse(s.node('#r').textContent).youtube.scheduled);
  s.fill('second');await s.submit();assert.equal(s.uploads.length,2);assert.equal(s.uploads[1][1],'second');assert.equal(s.node('#t').value,'');
});
test('immediate success also resets',async()=>{const s=setup();s.fill();s.node('#ya').value='';await s.submit();assert.equal(s.node('#t').value,'')});
test('upload failure retains inputs',async()=>{const s=setup();s.fill();vm.runInContext("youtube=async()=>{throw Error('network failure')}",s.context);await s.submit();assert.equal(s.node('#t').value,'first');assert.equal(s.node('#ya').value,'2026-10-06T19:30');assert.equal(s.revoked.length,0)});
test('partial failure retains inputs and successful YouTube URL',async()=>{const s=setup();s.fill();s.targets[1].checked=true;s.node('#tm').value='draft';vm.runInContext("tiktok=async()=>{throw Error('failed')}",s.context);await s.submit();assert.equal(s.node('#t').value,'first');assert.equal(s.node('#youtubeResult').hidden,false)});
for(const status of ['FAILED','PROCESSING'])test('TikTok '+status+' does not reset',async()=>{const s=setup();s.fill();s.targets[1].checked=true;s.node('#tm').value='draft';vm.runInContext(`tiktok=async()=>({status:'${status}'})`,s.context);await s.submit();assert.equal(s.node('#t').value,'first')});
