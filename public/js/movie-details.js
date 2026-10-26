function qs(name){const p=new URLSearchParams(location.search);return p.get(name);}
async function init(){
  const id=qs("id");
  const content=document.getElementById("content");
  try{
    const {movie}=await MB.api("/movies/"+id);
    const {shows}=await MB.api("/theatres/movie/"+id);
    content.innerHTML=`
      <div class="movie-detail">
        <img src="${movie.poster}" alt="${movie.title}" />
        <div>
          <h1>${movie.title}</h1>
          <div class="meta"><span>${movie.genre.join(", ")}</span><span>⭐ ${movie.rating}</span><span>${movie.duration} min</span><span>${movie.language}</span><span>${movie.releaseDate}</span></div>
          <p style="margin:14px 0;color:var(--muted)">${movie.synopsis}</p>
          <div class="cast">${(movie.cast||[]).map(c=>`<span>${c}</span>`).join("")}</div>
          <h3 style="margin-top:20px">Available Shows</h3>
          <div class="show-list" id="shows"></div>
        </div>
      </div>`;
    const showsEl=document.getElementById("shows");
    const now=new Date();
    const available=shows.filter(s=>new Date(s.date+"T"+s.time)>=now);
    if(!available.length){ showsEl.innerHTML='<div class="empty">No upcoming shows</div>'; return; }
    showsEl.innerHTML=available.map(s=>`
      <div class="show-card">
        <div>
          <strong>${s.theatre.name}</strong><br>
          <span class="meta">${s.date} • ${s.time} • ${s.theatre.city}</span>
        </div>
        <a class="btn primary" href="/seats.html?show=${s.id}">Book Tickets</a>
      </div>`).join("");
  }catch(e){ content.innerHTML='<div class="empty">'+e.message+'</div>'; }
}
init();
