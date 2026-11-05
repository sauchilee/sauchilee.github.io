
var LS={s:{},add:function(o){for(var k in o)this.s[k]=o[k]},idx:null,B:{},W:null,loaded:{},wait:{}};
LS.load=function(sh,cb){if(LS.loaded[sh])return cb();(LS.wait[sh]=LS.wait[sh]||[]).push(cb);if(LS.wait[sh].length>1)return;
 var s=document.createElement('script');s.src='d/'+sh+'.js';s.onload=function(){LS.loaded[sh]=1;LS.wait[sh].forEach(function(f){f()});LS.wait[sh]=[]};
 s.onerror=function(){LS.loaded[sh]=1;LS.wait[sh].forEach(function(f){f()});LS.wait[sh]=[]};document.head.appendChild(s)};
// 搜尋紀錄 search history (his asks 2 Nov 08:0x: "remember like the past 100s of some historical searching keywords ... or searching history"): in this browser only, never sent anywhere
LS.hist={K:'ls.searchHistory',MAX:500,
 get:function(){try{var a=JSON.parse(localStorage.getItem(this.K)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}},
 put:function(a){try{localStorage.setItem(this.K,JSON.stringify(a.slice(0,this.MAX)))}catch(e){}},
 add:function(q,n,firm){q=q.trim();if(!q||(q.length<2&&q.charCodeAt(0)<128))return;var l=q.toLowerCase(),a=this.get(),now=Date.now(),c=1,f=a[0],keep=!!firm;
  if(f&&now-f.t<30000){var o=f.q.toLowerCase();
   if(o!==l&&o.indexOf(l)===0&&!firm)return;
   if(o!==l&&l.indexOf(o)===0&&!f.f&&(f.c||1)<2)a.shift()}
  a=a.filter(function(x){if(x.q.toLowerCase()===l){c=(x.c||1)+(now-x.t>60000?1:0);keep=keep||!!x.f;return false}return true});
  var e={q:q,t:now,c:c};if(n!=null)e.n=n;if(keep)e.f=1;a.unshift(e);this.put(a)},
 del:function(q){var l=q.toLowerCase();this.put(this.get().filter(function(x){return x.q.toLowerCase()!==l}))},
 clear:function(){try{localStorage.removeItem(this.K)}catch(e){}}};
LS.search=function(box,res,prefix){if(!box)return;var t=null,ts=null,last={q:'',n:null},MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 function esc(s){return String(s).replace(/[&<>"]/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})}
 function when(v){var d=new Date(v);return d.getDate()+' '+MON[d.getMonth()]+(d.getFullYear()!==new Date().getFullYear()?' '+d.getFullYear():'')}
 function row(x){return '<div class="qh" data-q="'+esc(x.q)+'"><button type="button" class="qhw">'+esc(x.q)+'</button><span class="qhm">'+((x.c||1)>1?x.c+'× · ':'')+when(x.t)+(x.n!=null?' · '+x.n+' 項':'')+'</span><button type="button" class="qhx" title="刪除 Remove" aria-label="刪除 Remove '+esc(x.q)+'">×</button></div>'}
 function past(){var a=LS.hist.get();if(!a.length){res.hidden=true;res.innerHTML='';return}res.hidden=false;
  res.innerHTML='<div class="n">搜尋紀錄 <i lang="en">Search history</i>: '+a.length+'</div>'+a.map(row).join('')+'<div class="qhf"><button type="button" class="qhc">清除全部 <span lang="en">Clear all</span></button></div>'}
 function keep(firm){var v=box.value.trim();if(v)LS.hist.add(v,last.q===v?last.n:null,firm)}
 function run(){var q=box.value.trim().toLowerCase();if(!q){past();return}
  if(!LS.idx){if(!LS.idxWait){LS.idxWait=1;var s=document.createElement('script');s.src='d/search.js';s.onload=run;document.head.appendChild(s)}return}
  var words=q.split(/\s+/),out=[],n=0;for(var i=0;i<LS.idx.length;i++){var x=LS.idx[i],l=x[1].toLowerCase(),ok=true;
   for(var j=0;j<words.length;j++)if(l.indexOf(words[j])<0){ok=false;break}if(ok){n++;if(out.length<80)out.push(x)}}
  res.hidden=false;last={q:box.value.trim(),n:n};
  var before=LS.hist.get().filter(function(x){var l=x.q.toLowerCase();return l!==q&&l.indexOf(q)>=0}).slice(0,5);
  res.innerHTML=(before.length?'<div class="n">從前搜尋 <i lang="en">Searched before</i></div>'+before.map(row).join(''):'')+'<div class="n">'+n+' 項 found</div>'+out.map(function(x){var c=x[2]?(LS.B[x[2]]||{}).col:'#6f665b';
   return '<a href="'+prefix+'#i'+x[0]+'"><span class="ch" style="--c:'+c+'">'+x[2]+'</span><span>'+LS.flipT(x[1],LS.lang()).replace(/[<&]/g,function(m){return m==='<'?'&lt;':'&amp;'})+'</span></a>'}).join('')}
 function walk(step){var l=[].slice.call(res.querySelectorAll('a,.qhw')),i=l.indexOf(document.activeElement)+step;if(!l.length||res.hidden)return;if(i<0||(step<0&&document.activeElement===box))return box.focus();if(i<l.length)l[i].focus()}
 function keys(e){if(e.key==='ArrowDown'){e.preventDefault();walk(1)}else if(e.key==='ArrowUp'){e.preventDefault();walk(-1)}else if(e.key==='Escape'){res.hidden=true;box.focus()}}
 box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(run,120);clearTimeout(ts);ts=setTimeout(function(){keep(false)},1500)});box.addEventListener('focus',run);
 box.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();clearTimeout(ts);clearTimeout(t);run();keep(true)}else keys(e)});res.addEventListener('keydown',keys);
 document.addEventListener('click',function(e){if(e.target!==box&&!res.contains(e.target))res.hidden=true});
 res.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.qhc,.qhx,.qhw');
  if(c){e.stopPropagation();var r=c.closest('.qh'),v=r?r.dataset.q:'';
   if(c.classList.contains('qhc')){if(c.dataset.sure){LS.hist.clear();past()}else{c.dataset.sure='1';c.textContent='再按一次確定 Click again to clear all'}return}
   if(c.classList.contains('qhx')){LS.hist.del(v);run();box.focus();return}
   box.value=v;clearTimeout(ts);run();keep(true);box.focus();return}
  clearTimeout(ts);keep(true);res.hidden=true})};
// the four language choices: lampstand_draw.LANG_JS, one source with the public draft (job titlepage). The levels, languages and voice of a quoted verse moved to the key drawer (his words 4 Nov 08:07-08:08; job keylevels): nothing about them here.
LS.langCSS="";
LS.collar=function(){var co=document.querySelector('.stand .co-zh');if(!co||!co.dataset.z)return;var d=co.dataset,mode=LS.lang();co.textContent={zh:d.z,en:d.e,ez:d.e+' '+d.z}[mode]||d.z+' '+d.e;co.style.fontSize='';var w=co.getComputedTextLength&&co.getComputedTextLength();if(w>166)co.style.fontSize=(parseFloat(getComputedStyle(co).fontSize)*166/w)+'px'};
LS.lang=function(){try{var v=localStorage.getItem('ls-lang');return /^(zh|en|ze|ez)$/.test(v)?v:'ze'}catch(e){return 'ze'}};
LS.flipT=function(t,mode){var m=/^((?:↪ *)?(?:[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] +)?(?:[0-9]+(?:[.][0-9]+)* +)?)([^]*)$/.exec(t);if(!m)return t;
 var bar=/^([^|㐀-鿿]+) [|] ([^|]*[㐀-鿿][^|]*)$/.exec(m[2]);if(bar)return m[1]+(mode==='zh'?bar[2]:mode==='en'?bar[1]:mode==='ez'?bar[1]+' '+bar[2]:bar[2]+' '+bar[1]);
 return m[1]+m[2].split(/( - | – | — | · )/).map(function(seg,i){if(i%2)return seg;
  var tail='',p=/ *(?:[(（][^()（）]*[)）]|[.][a-zA-Z0-9]{1,5}) *$/.exec(seg);if(p&&p.index>0){tail=p[0];seg=seg.slice(0,p.index)}
  var zh=[],la=[];seg.split(/([㐀-鿿豈-﫿　-〿・＀-￯]+(?: +[㐀-鿿豈-﫿　-〿・＀-￯]+)*)/).forEach(function(r,j){r=r.trim();if(r)(j%2?zh:la).push(r)});
  if(!zh.length||!la.length||!/[A-Za-z]/.test(la.join('')))return seg+tail;
  return (mode==='zh'?zh:mode==='en'?la:mode==='ez'?la.concat(zh):zh.concat(la)).join(' ')+tail}).join('')};
LS.pairs=function(root,mode){if(!root||mode==='ze')return;root.querySelectorAll('[lang=en]').forEach(function(x){if(x.closest('.lgskip'))return;
 var br=null,p=x.previousSibling,z=null;while(p&&p.nodeType===3&&!p.nodeValue.trim())p=p.previousSibling;if(p&&p.nodeName==='BR'){br=p;p=p.previousSibling}
 if(p&&p.nodeType===1&&/kg-zh|kg-kz|br-zh/.test(p.className))z=p;
 else if(p&&p.nodeType===1&&p.tagName==='A'&&p.lastChild&&p.lastChild.nodeType===3&&/[㐀-鿿]/.test(p.lastChild.nodeValue)){var zt=p.lastChild.nodeValue,et=x.textContent;
  if(mode==='zh')x.style.display='none';else if(mode==='en'){p.lastChild.nodeValue=' '+et;x.style.display='none'}else{p.lastChild.nodeValue=' '+et;x.textContent=zt.trim()}return}
 else if(p&&p.nodeType===3&&/[㐀-鿿]/.test(p.nodeValue)){var m=/^([^㐀-鿿]*)([㐀-鿿][^]*)$/.exec(p.nodeValue);z=document.createElement('span');z.className='zt';z.textContent=m[2].replace(/ +$/,'');p.nodeValue=m[1];p.parentNode.insertBefore(z,p.nextSibling)}
 if(!z)return;
 if(mode==='zh'){x.style.display='none';if(br)br.style.display='none'}else if(mode==='en'){z.style.display='none';if(br)br.style.display='none'}
 else{var par=z.parentNode;par.insertBefore(x,z);par.insertBefore(br||document.createTextNode(' '),z)}})};
LS.langInit=function(){var mode=LS.lang(),h=document.documentElement;h.classList.add('lg-'+mode);
 var st=document.createElement('style');st.textContent='.langtop .langsw button{color:#3a3226!important;border-color:#8f8467}.langtop .langsw button[aria-pressed="true"]{color:#2a2622!important}.langtop.dark .langsw button{color:#f6ecd4!important;border-color:rgba(236,202,99,.5)}.langtop.dark .langsw button[aria-pressed="true"]{color:#2d1f06!important}.langsw{display:inline-flex;flex-wrap:wrap;gap:3px;align-items:center;font-size:13px;line-height:1.4}.langsw button{font:inherit;color:#f6ecd4;background:transparent;border:1px solid #8f8467;border-radius:7px;padding:1px 7px;cursor:pointer;white-space:nowrap}.langsw button[aria-pressed=true]{background:#ecca63;border-color:#ecca63;color:#2d1f06;font-weight:600}.langtop{display:flex;flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:4px 8px;padding:6px 10px 0}'
 +(LS.langCSS||'')
 +'.lg-zh .stand .le,.lg-zh .stand .kn-en,.lg-zh .stand .ba-en{display:none}.lg-zh .stand .kn-zh{transform:translateY(8px)}.lg-zh .stand .ba-zh{transform:translateY(12px)}'
 +'.lg-en .stand .lz,.lg-en .stand .kn-zh,.lg-en .stand .ba-zh{display:none}.lg-en .stand .le{font-size:20px}.lg-en .stand .kn-en{display:block;font-size:18px;transform:translateY(-12px)}.lg-en .stand .ba-en{display:block;font-size:20px;transform:translateY(-12px)}'
 +'.lg-ez .stand .lz{transform:translateY(42px)}.lg-ez .stand .le{transform:translateY(-126px)}.lg-ez .stand .le.l1{transform:translateY(-105px)}.lg-ez .stand .kn-zh{transform:translateY(22px)}.lg-ez .stand .kn-en{transform:translateY(-28px)}.lg-ez .stand .ba-zh{transform:translateY(29px)}.lg-ez .stand .ba-en{transform:translateY(-29px)}'
 +'@media (max-width:760px){.lg-en .stand .kn-en{font-size:26px;transform:translateY(-11px)}.lg-en .stand .knop[data-k="2"] .kn-en{transform-box:fill-box;transform-origin:center;transform:translateY(-11px) scaleX(.7)}.lg-en .stand .ba-en{font-size:23px;transform:translateY(-5px)}.lg-ez .stand .kn-zh{transform:translateY(9px)}.lg-ez .stand .ba-zh{transform:translateY(12px)}}'
 +'.lg-zh .ve{display:none}.lg-en .vz{display:none}';document.head.appendChild(st);
 var host=document.getElementById('langsw');if(host){host.innerHTML=[['zh','中文','只有中文 Chinese only'],['en','English','English only 只有英文'],['ze','中文 English','中文在前 Chinese first, then English'],['ez','English 中文','English first, then Chinese 英文在前']].map(function(o){return '<button type="button" data-lg="'+o[0]+'" aria-label="'+o[2]+'" aria-pressed="'+(o[0]===mode)+'" translate="no">'+o[1]+'</button>'}).join('');
  host.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem('ls-lang',b.dataset.lg)}catch(e){}location.reload()})})}
 return mode};
LS.langPage=function(){var mode=LS.langInit();if(mode!=='ze')document.querySelectorAll('.motto small').forEach(function(s){if(mode!=='zh')[].forEach.call(s.childNodes,function(n){if(n.nodeType===3)n.nodeValue=n.nodeValue.replace(/；/g,'; ')})});if(mode!=='ze')document.querySelectorAll('.motto small .vr,.spirit').forEach(function(e){var n=e.lastChild;if(!n||n.nodeType!==3)return;n.nodeValue=n.nodeValue.replace(/([㐀-鿿]+) ((?:[0-9] )?[A-Za-z]+) ([0-9:.-]+)/g,function(_,z,en,num){return mode==='zh'?z+' '+num:mode==='en'?en+' '+num:en+' '+z+' '+num});if(mode!=='zh')n.nodeValue=n.nodeValue.replace(/；/g,'; ')});
 document.querySelectorAll('.holy h1,.motto,.spirit,.v-ref,.kg,.kg-grid,.keygrid,.card,.foot,.quiet,.back,.ovsec,.draftbar').forEach(function(r){LS.pairs(r,mode)});
 if(mode==='ez')document.querySelectorAll('.ve').forEach(function(e){var z=e.previousElementSibling;if(z&&z.classList.contains('vz'))e.parentNode.insertBefore(e,z)});return mode};

LS.ilHome=function(){};
LS.langHome=function(){var mode=LS.langPage();document.querySelectorAll('.card .last a').forEach(function(a){var n=a.lastChild;if(n&&n.nodeType===3)n.nodeValue=LS.flipT(n.nodeValue,mode)});
 LS.collar()};
LS.viewer=function(){var M=document.getElementById('M');LS.langInit();LS.pairs(document.querySelector('.vt'),LS.lang());
 var P=document.getElementById('pills');
 P.innerHTML=Object.keys(LS.B).map(function(n){var b=LS.B[n],t=n+' '+b.zh+' '+b.en;var nm='<span class="bn"><span class="bz">'+b.zh+'</span><span class="be">'+b.en+'</span></span>';return b.id?'<a href="#i'+b.id+'" data-b="'+n+'" style="--c:'+b.col+'" title="'+t+'"><b>'+n+'</b>'+nm+'</a>':'<span class="dk" title="'+t+'"><b>'+n+'</b>'+nm+'</span>'}).join('');
 function acr(el){var n=+el.dataset.b;var b=LS.B[n];if(!b){el.innerHTML='<a href="index.html">↑ 燈臺 The Lampstand</a>';return}var o=[];
  if(b.partner)o.push(['同一球的另一枝 The other branch on this knop',b.partner]);if(n!==1)o.push(['幹，也是根 The shaft and root',1]);if(n!==10)o.push(['織入每一枝 Woven into every branch',10]);
  var d=el.closest('details');o=o.filter(function(a){return (LS.B[a[1]]||{}).id});if(d&&!o.length){d.hidden=true;return}el.innerHTML=o.filter(function(a,i){return o.findIndex(function(z){return z[1]===a[1]})===i}).map(function(a){var x=LS.B[a[1]];return '<a href="#i'+x.id+'" title="'+a[0]+'"><span class="ch" style="--c:'+x.col+'">'+a[1]+'</span>'+x.zh+' '+x.en+'</a>'}).join('')}
 function flipAll(){var mode=LS.lang();M.querySelectorAll('ul.ls > li > a, h1, .cr a').forEach(function(a){var n=a.lastChild;if(!n||n.nodeType!==3||[].some.call(a.children,function(c){return !c.classList.contains('m')}))return;if(a.dataset.t0===undefined)a.dataset.t0=n.nodeValue;n.nodeValue=LS.flipT(a.dataset.t0,mode)})}
 function lists(){flipAll();M.querySelectorAll('ul.ls').forEach(function(u){var li=[].slice.call(u.children);if(li.length<2)return;var f=document.createElement('div'),big=li.length>=13;f.className='lsf';
   var hasN=li.some(function(e){return e.dataset.n}),hasF=li.some(function(e){return e.classList.contains('lf')}),hasL=li.some(function(e){return !e.classList.contains('lf')}),pair=function(k,z,en,a1,a2){var at=k==='s'?'data-st':'data-k';return '<span class="srt">'+z+' <i lang="en">'+en+'</i><button type="button" '+at+'="'+k+'" data-d="1" title="'+a1+'" aria-label="'+en+' ascending" aria-pressed="false">▲</button><button type="button" '+at+'="'+k+'" data-d="-1" title="'+a2+'" aria-label="'+en+' descending" aria-pressed="false">▼</button></span>'};
   var sorts='<span class="srts">排序 <i lang="en">Sort</i>'+(hasF&&hasL?'<span class="srt">先放 <i lang="en">First</i><button type="button" data-first="f" aria-pressed="false">資料夾 <i lang="en">Folders</i></button><button type="button" data-first="n" aria-pressed="false">檔案 <i lang="en">Files</i></button></span>':'')+pair('t','名稱','Name','升序 Ascending','降序 Descending')+pair('m','日期','Date','舊的先 Oldest first','新的先 Newest first')+(hasN?pair('n','數量','Count','少的先 Fewest first','多的先 Most first'):'')+'</span>';
   if(!big){f.innerHTML=sorts}else f.innerHTML='<input type="search" placeholder="在這裡篩選 Filter here" aria-label="篩選 Filter"><span class="n"></span>'+sorts;
   u.parentNode.insertBefore(f,u);var inp=f.querySelector('input'),on={},idx=new Map(li.map(function(e,i){return [e,i]}));
   var RANK={d:0,r:1,p:2},dated=li.filter(function(e){return /^[ ↪]*[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/.test(e.querySelector('a').textContent.trim())}).length*2>=li.length,KEY=dated?'ls-sort-dated':'ls-sort';
   function state(){var st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}return {k:st.k||(dated?'m':'t'),d:st.d||(dated?-1:1),st:st.st||0,first:st.first||(dated?'a':'f')}}
   function save(st){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}sortNow()}
   function sortNow(){var st=state(),k=st.k==='n'&&!hasN?'t':st.k,lg=LS.lang(),co=new Intl.Collator(lg==='en'||lg==='ez'?'en':'zh-Hant',{numeric:true,sensitivity:'base'}),nm=new Map(li.map(function(e){return [e,e.querySelector('a').textContent]}));
    li.slice().sort(function(a,b){var fa=a.classList.contains('lf')?0:1,fb=b.classList.contains('lf')?0:1,c=0;if(fa!==fb&&st.first!=='a')return (fa-fb)*(st.first==='n'?-1:1);
     if(st.st){var ra=RANK[a.dataset.st||a.dataset.s],rb=RANK[b.dataset.st||b.dataset.s];if(ra!==rb)return (ra-rb)*st.st}
     if(k==='m'){var x=dated&&!a.classList.contains('dn')?'':a.dataset.m||'',y=dated&&!b.classList.contains('dn')?'':b.dataset.m||'';if(!x||!y){if(x!==y)return x?-1:1}else c=x<y?-1:x>y?1:0}else if(k==='n')c=(+a.dataset.n||0)-(+b.dataset.n||0);else c=co.compare(nm.get(a),nm.get(b));
     return c?c*st.d:idx.get(a)-idx.get(b)}).forEach(function(e){u.appendChild(e)});
    u.classList.toggle('bydate',k==='m');
    f.querySelectorAll('button[data-k]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.k===k&&+b.dataset.d===st.d?'true':'false')});
    f.querySelectorAll('button[data-st]').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.d===st.st?'true':'false')});
    f.querySelectorAll('button[data-first]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.first===st.first?'true':'false')})}
   f.querySelectorAll('button[data-k]').forEach(function(b){b.addEventListener('click',function(){var st=state();st.k=b.dataset.k;st.d=+b.dataset.d;save(st)})});
   f.querySelectorAll('button[data-st]').forEach(function(b){b.addEventListener('click',function(){var st=state(),d=+b.dataset.d;st.st=st.st===d?0:d;save(st)})});
   f.querySelectorAll('button[data-first]').forEach(function(b){b.addEventListener('click',function(){var st=state();st.first=b.dataset.first;save(st)})});sortNow();
   if(!big)return;
   function go(){var q=inp.value.trim().toLowerCase(),any=Object.keys(on).some(function(k){return on[k]}),n=0;
    li.forEach(function(e){var s=e.dataset.s,a0=e.querySelector('a'),tx=(e.textContent+' '+(a0&&a0.dataset.t0||'')).toLowerCase(),m=(!q||tx.indexOf(q)>=0)&&(!any||(s&&on[s]));e.hidden=!m;if(m)n++});f.querySelector('.n').textContent=n+' / '+li.length}
   inp.addEventListener('input',go);f.querySelectorAll('button[data-s]').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.s;on[k]=!on[k];b.setAttribute('aria-pressed',on[k]?'true':'false');go()})})})}
 function show(it,id,anc){if(!it){M.innerHTML='<h1>找不到 Not found</h1><p><a href="index.html">↑ 燈臺 The Lampstand</a></p>';document.title='找不到 Not found';return}
  M.innerHTML=it.h;M.dataset.b=it.b;document.title=it.t+' · 燈臺';M.querySelectorAll('.acr').forEach(acr);lists();(function(md){var fi=M.querySelector('.lsf input');if(fi)fi.placeholder=LS.flipT(fi.placeholder,md);M.querySelectorAll('.lsf,.cr,.topopen,.role').forEach(function(r){LS.pairs(r,md)})})(LS.lang());
  P.querySelectorAll('a').forEach(function(a){a.classList.toggle('on',+a.dataset.b===it.b)});
  var t=anc?document.getElementById(decodeURIComponent(anc)):null;if(t)t.scrollIntoView();else window.scrollTo(0,0)}
 function route(){var h=location.hash.slice(1);if(!h){M.innerHTML='<h1>燈臺 <i lang="en">The Lampstand</i></h1><p><a href="index.html">↑ 燈臺 The Lampstand</a></p><ul class="ls">'+Object.keys(LS.B).filter(function(n){return LS.B[n].id}).map(function(n){var b=LS.B[n];return '<li class="lf"><a href="#i'+b.id+'"><span class="ch" style="--c:'+b.col+'">'+n+'</span>'+b.zh+' '+b.en+'</a></li>'}).join('')+'</ul>';document.title='燈臺 The Lampstand';return}
  var m=/^i([0-9a-f]{10})(?:~(.*))?$/.exec(h);if(!m)return;var id=m[1],sh=id.slice(0,2);LS.load(sh,function(){show(LS.s[id],id,m[2])})}
 window.addEventListener('hashchange',route);route();
 M.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var h=a.getAttribute('href').slice(1);if(/^i[0-9a-f]{10}/.test(h))return;
  e.preventDefault();var t=document.getElementById(decodeURIComponent(h));if(t)t.scrollIntoView()});
 LS.search(document.getElementById('q'),document.getElementById('qr'),'')};
// the small free counter (job viewers; his word 5 Nov 09:30: "You can add a small free counter to the public page"). No cookie: only which of the three pages, and whether this browser is new today. Never a test browser, never localhost.
(function(){try{var q=location.search;if(/[?&]nocount=1/.test(q))localStorage.setItem('ls-nocount','1');if(/[?&]nocount=0/.test(q))localStorage.removeItem('ls-nocount');
if(navigator.webdriver||/HeadlessChrome/.test(navigator.userAgent)||location.protocol!=='https:'||localStorage.getItem('ls-nocount')||!navigator.sendBeacon)return;
var f=location.pathname.split('/').pop(),p=(!f||f==='index.html')?'home':f==='overview.html'?'overview':f==='v.html'?'viewer':'';if(!p)return;
var d=new Date(Date.now()-288e5).toISOString().slice(0,10),v=0;if(localStorage.getItem('ls-seen')!==d){localStorage.setItem('ls-seen',d);v=1}
navigator.sendBeacon('https://ls-count.lampstand.workers.dev/hit?p='+p+'&v='+v)}catch(e){}})();
