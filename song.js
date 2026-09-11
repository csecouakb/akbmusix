const root=document.getElementById('songRoot');
const slug=new URLSearchParams(location.search).get('slug');
const chromatic=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
let shift=0;let song=null;let showChords=true;let fontSize=16;

function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function transposeChord(chord,steps){return chord.replace(/[A-G](#|b)?/g,n=>{let idx=chromatic.indexOf(n.replace('Db','C#').replace('Eb','D#').replace('Gb','F#').replace('Ab','G#').replace('Bb','A#'));if(idx<0)return n;return chromatic[(idx+steps+120)%12];});}
function stripChords(line){return line.replace(/\[[^\]]+\]/g,'').replace(/\s+$/,'');}
function chordedLine(line){
  const rx=/\[([^\]]+)\]/g;let m;let last=0;let lyric='';let chordLine='';
  while((m=rx.exec(line))){
    const text=line.slice(last,m.index);lyric+=text;
    chordLine+=' '.repeat(Math.max(0,lyric.length-chordLine.length));
    const chord=transposeChord(m[1],shift);chordLine+=chord;
    last=rx.lastIndex;
  }
  lyric+=line.slice(last);
  if(!chordLine.trim())return `<div class="lyric-line">${esc(lyric)}</div>`;
  return `<div class="song-line"><div class="chord-line">${esc(chordLine)}</div><div class="lyric-line">${esc(lyric)}</div></div>`;
}
function formattedLyrics(){
  return song.lyrics.split('\n').map(line=>showChords?chordedLine(line):`<div class="lyric-line">${esc(stripChords(line))||'&nbsp;'}</div>`).join('');
}
function media(title,items){if(!items?.length)return '';return `<section class="media-box"><h2>${title}</h2><div class="media-list">${items.map(i=>`<a class="media-link" target="_blank" rel="noopener noreferrer" href="${esc(i.url)}"><span>${esc(i.label)}</span><span>↗</span></a>`).join('')}</div></section>`;}
function feedbackKey(){return `akbmusix-feedback-${slug}`;}
function loadFeedback(){try{return JSON.parse(localStorage.getItem(feedbackKey()))||{ratings:[],comments:[]};}catch{return{ratings:[],comments:[]};}}
function saveFeedback(data){localStorage.setItem(feedbackKey(),JSON.stringify(data));}
function averageRating(data){if(!data.ratings.length)return 'No ratings yet';const avg=data.ratings.reduce((a,b)=>a+b,0)/data.ratings.length;return `${avg.toFixed(1)} / 5 (${data.ratings.length})`;}
function commentsHtml(data){if(!data.comments.length)return '<p class="muted">এখনও কোনো মন্তব্য নেই।</p>';return data.comments.slice().reverse().map(c=>`<article class="comment"><strong>${esc(c.name||'Anonymous')}</strong><p>${esc(c.text)}</p></article>`).join('');}
function render(){
  const key=transposeChord(song.key,shift);const feedback=loadFeedback();
  document.title=`${song.title} Chords & Lyrics | AKBmusix`;
  document.querySelector('meta[name="description"]').setAttribute('content',`${song.title} by ${song.artist}. Lyrics, guitar chords, key ${key}, capo, strumming, tutorials and covers.`);
  root.innerHTML=`
    <h1 class="song-title">${esc(song.title)}</h1>
    <p class="song-meta">${esc(song.artist)} • Key ${esc(key)} • ${esc(song.capo)} • ${esc(song.language)}</p>
    <div class="toolbar">
      <label class="toggle-control"><input id="chordToggle" type="checkbox" ${showChords?'checked':''}> <span>Chords</span></label>
      <button class="btn" id="down">− Transpose</button><button class="btn" id="reset">Key ${esc(key)}</button><button class="btn" id="up">+ Transpose</button>
      <button class="btn" id="smaller">A−</button><button class="btn" id="larger">A+</button>
    </div>
    <section class="lyrics-box">
      <div class="section-head compact"><h2>${showChords?'Lyrics & Chords':'Lyrics'}</h2>${song.hasChords===false?'<span class="muted">Chords not added yet</span>':''}</div>
      ${showChords&&song.strumming?`<p><strong>Strumming:</strong> ${esc(song.strumming)}</p>`:''}
      <div id="lyrics" class="lyrics" style="font-size:${fontSize}px">${formattedLyrics()}</div>
    </section>
    ${media('Tutorials',song.tutorials)}${media('Covers',song.covers)}
    <section class="feedback-box">
      <h2>Rating & Comment</h2>
      <p class="rating-summary">${averageRating(feedback)}</p>
      <div class="rating-row" aria-label="Rate this song page">${[1,2,3,4,5].map(n=>`<button class="star-btn" data-rating="${n}" title="${n} star">★</button>`).join('')}</div>
      <form id="commentForm" class="stack-form">
        <input id="commentName" maxlength="60" placeholder="Name (optional)" />
        <textarea id="commentText" maxlength="800" required placeholder="কেমন হলো? ভুল থাকলে বা কোনো পরামর্শ থাকলে লিখুন..."></textarea>
        <button class="primary-btn" type="submit">Post Comment</button>
      </form>
      <div id="comments" class="comments">${commentsHtml(feedback)}</div>
      <p class="form-note">নাম না দিলে মন্তব্য Anonymous হিসেবে দেখাবে।</p>
    </section>`;
  document.getElementById('chordToggle').onchange=e=>{showChords=e.target.checked;render();};
  document.getElementById('down').onclick=()=>{shift--;render();};document.getElementById('up').onclick=()=>{shift++;render();};document.getElementById('reset').onclick=()=>{shift=0;render();};
  document.getElementById('smaller').onclick=()=>{fontSize=Math.max(13,fontSize-1);render();};document.getElementById('larger').onclick=()=>{fontSize=Math.min(30,fontSize+1);render();};
  document.querySelectorAll('.star-btn').forEach(btn=>btn.onclick=()=>{const d=loadFeedback();d.ratings.push(Number(btn.dataset.rating));saveFeedback(d);render();});
  document.getElementById('commentForm').onsubmit=e=>{e.preventDefault();const text=document.getElementById('commentText').value.trim();if(!text)return;const d=loadFeedback();d.comments.push({name:document.getElementById('commentName').value.trim(),text,date:new Date().toISOString()});saveFeedback(d);render();};
}
fetch('songs.json').then(r=>r.json()).then(data=>{song=data.find(s=>s.slug===slug);if(!song){root.innerHTML='<div class="empty">গানটি পাওয়া যায়নি।</div>';return;}render();}).catch(()=>root.innerHTML='<div class="empty">গান লোড করা যায়নি।</div>');