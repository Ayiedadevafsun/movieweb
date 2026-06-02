const id = new URLSearchParams(window.location.search).get("id");

Promise.all([
fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=7ffbe295b76c93fdb96b5b4afc97fd32&language=en-US`).then(r=>r.json()),
fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=7ffbe295b76c93fdb96b5b4afc97fd32&language=en-US`).then(r=>r.json())
])
.then(async ([data,credits])=>{

document.getElementById("watchTitle").innerText="Watch "+data.name+" Full Episode";

document.getElementById("backdrop").src="https://image.tmdb.org/t/p/w1280"+data.backdrop_path;
document.getElementById("poster").src="https://image.tmdb.org/t/p/w500"+data.poster_path;

document.getElementById("air").innerText=data.first_air_date;
document.getElementById("season").innerText=data.number_of_seasons;
document.getElementById("episode").innerText=data.number_of_episodes;
document.getElementById("status").innerText=data.status;
document.getElementById("genre").innerText=data.genres.map(g=>g.name).join(", ");
document.getElementById("story").innerText=data.overview;

document.getElementById("cast").innerHTML=
credits.cast.slice(0,15).map(c=>c.name+" as "+(c.character||"-")).join("<br>");

let seasonHTML="";

for(let i=0;i<data.seasons.length;i++){

let s=data.seasons[i];

const seasonData=await fetch(
`https://api.themoviedb.org/3/tv/${id}/season/${s.season_number}?api_key=7ffbe295b76c93fdb96b5b4afc97fd32&language=en-US`
).then(r=>r.json());

seasonHTML +=
"<div style='background:#111;padding:15px;margin:15px 0;border-radius:10px'>" +
"<b>Season "+s.season_number+"</b><br>" +
"Air Date: "+(s.air_date||"-")+"<br>" +
"Episodes: "+s.episode_count+"<br><br>";

for(let j=0;j<seasonData.episodes.length;j++){

let ep=seasonData.episodes[j];

seasonHTML +=
"<div style='margin:8px 0'>" +
`<a href="/p/tv.html?id=${id}&season=${s.season_number}&episode=${ep.episode_number}" target="_blank" style="color:#4da6ff;text-decoration:none">` +
"Episode "+ep.episode_number+" - "+ep.name +
"</a></div>";
}

seasonHTML += "</div>";
}

document.getElementById("seasonList").innerHTML=seasonHTML;
const similar = await fetch(
`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${api}&language=en-US`
).then(r=>r.json());

document.getElementById("similarList").innerHTML =
similar.results
.filter(show => show.poster_path)
.slice(0,8)
.map(show => `
<a href="/2026/06/tv-show.html?id=${show.id}" style="text-decoration:none;color:#fff">
<div style="display:inline-block;width:160px;margin:10px;background:#111;padding:10px;border-radius:10px;vertical-align:top">
<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" style="width:100%;border-radius:8px">
<div style="margin-top:8px;font-size:14px">${show.name}</div>
</div>
</a>
`).join("");
});