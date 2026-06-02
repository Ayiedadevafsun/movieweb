document.addEventListener("DOMContentLoaded", async () => {

  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    document.body.innerHTML = "ID tidak ditemukan";
    return;
  }

  try {

    const [movie, credits, videos, similar, popular, upcoming] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api}&language=en-US`).then(r=>r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api}&language=en-US`).then(r=>r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api}&language=en-US`).then(r=>r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${api}&language=en-US`).then(r=>r.json()),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api}&language=en-US&page=1`).then(r=>r.json()),
      fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api}&language=en-US&page=1`).then(r=>r.json())
    ]);

    const trailer = videos.results.find(v => 
      v.site === "YouTube" && v.type === "Trailer"
    );
const makeList = (data) =>
      (data.results || []).slice(0,8).map(m => `
        <a href="/p/movie.html?id=${m.id}" style="display:inline-block;width:140px;margin:8px;text-decoration:none;color:#fff;">
          <img src="https://image.tmdb.org/t/p/w300${m.poster_path}" style="width:100%;border-radius:8px">
          <div>${m.title}</div>
        </a>
      `).join("");

    document.getElementById("movie-container").innerHTML = `

      <div class="hero" style="
background:url('https://image.tmdb.org/t/p/original${movie.backdrop_path}');
background-size:cover;
background-position:center;
height:400px;
position:relative;
border-radius:15px;
margin-bottom:20px;
">

<div style="
position:absolute;
inset:0;
background:linear-gradient(to top,#111,transparent);
border-radius:15px;
"></div>

<div style="
position:absolute;
bottom:20px;
left:20px;
z-index:2;
">
<h1>${movie.title}</h1>
<p>${movie.tagline || ""}</p>
</div>

</div>

      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width="220">

      <p>${movie.tagline || ""}</p>
      <p>${movie.overview || "-"}</p>

      <table class="table table-striped">
  <tbody>
    <tr>
      <th>Release Date</th>
      <td>:</td>
      <td>${movie.release_date || "-"}</td>
    </tr>

    <tr>
      <th>Runtime</th>
      <td>:</td>
      <td>${movie.runtime ? movie.runtime + " min" : "-"}</td>
    </tr>

    <tr>
      <th>Status</th>
      <td>:</td>
      <td>${movie.status || "-"}</td>
    </tr>

    <tr>
      <th>Genres</th>
      <td>:</td>
      <td>${movie.genres?.map(g => g.name).join(", ") || "-"}</td>
    </tr>

    <tr><th>Rating</th>
      <td>:</td>
      <td>${movie.vote_average ? movie.vote_average.toFixed(1) : "-"}/10</td>
    </tr>

    <tr>
      <th>Language</th>
      <td>:</td>
      <td>${movie.original_language?.toUpperCase() || "-"}</td>
    </tr>

    <tr>
      <th>Popularity</th>
      <td>:</td>
      <td>${movie.popularity || "-"}</td>
    </tr>

    <tr>
      <th>Vote Count</th>
      <td>:</td>
      <td>${movie.vote_count || "-"}</td>
    </tr>

    <tr>
      <th>Budget</th>
      <td>:</td>
      <td>${movie.budget ? "$" + movie.budget.toLocaleString() : "-"}</td>
    </tr>

    <tr>
      <th>Revenue</th>
      <td>:</td>
      <td>${movie.revenue ? "$" + movie.revenue.toLocaleString() : "-"}</td>
    </tr>
  </tbody>
</table>

      <h2>Cast</h2>
      <div>${(credits.cast || []).slice(0,10).map(c =>
          `${c.name} as ${c.character || "-"}`
        ).join("<br>")}
      </div>

      <h2>Trailer</h2>
      ${
        trailer
        ? `<iframe width="100%" height="400"
            src="https://www.youtube.com/embed/${trailer.key}"
            frameborder="0"
            allowfullscreen></iframe>`
        : `<p>Trailer tidak tersedia</p>`
      }

      <h2>Similar Movies</h2>
      <div class="grid">${makeList(similar)}</div>

      <h2>Popular Movies</h2>
      <div class="grid">${makeList(popular)}</div>

      <h2>Upcoming Movies</h2>
      <div class="grid">${makeList(upcoming)}</div>
     <button id="bookmarkBtn">☆ Add Watchlist</button>
    `;
 const bookmarkBtn = document.getElementById("bookmarkBtn");

if(bookmarkBtn){

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

if(watchlist.find(m => m.id == movie.id)){
  bookmarkBtn.innerHTML = "★ Saved";
}
bookmarkBtn.addEventListener("click", function(){

  if(!watchlist.find(m => m.id == movie.id)){

    watchlist.push({
      id: movie.id,
      title: movie.title || movie.name,
      poster: movie.poster_path
    });

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    bookmarkBtn.innerHTML = "★ Saved";

    alert("Saved to Watchlist");
  }

});

}
    

  } catch (err) {
    console.log(err);
    document.body.innerHTML = "ERROR FETCH MOVIE";
  }

});