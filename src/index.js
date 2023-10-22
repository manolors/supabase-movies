import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || false;
const SUPABASE_SECRET = import.meta.env.VITE_SUPABASE_SECRET || false;
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

async function login() {
  const email = "";
  const password = "";
  const { data, error } = supabase.auth.signInWithPassword({ email, password });
  if (!error) {
    console.log(data);
  } else {
    console.error(error);
  }
}

await login();
const messageContainer = document.querySelector(".message");
const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => { messageContainer.innerHTML = ""; });

const loadButton = document.getElementById("load-data");

loadButton.addEventListener("click", () => {
  fetch("./movies.json")
    .then(data => data.json())
    .then((data) => {
      data = data.movies;
      for (const movie of data) {
        supabase.from("movies").insert([movie])
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              messageContainer.innerHTML += `<p>Película ${movie.title} insertada correctamente</p>`;
            } else {
              messageContainer.innerHTML += `<p>Error al insertar la película ${movie.title} [${response.error.message}]</p>`;
            }
          })
          .catch(error => { messageContainer.innerHTML += `<p>${error}</p>`; });
      }
    }).catch(error => { messageContainer.innerHTML += `<p>${error}</p>`; });
});

const loadMovies = document.getElementById("load-movies");

loadMovies.addEventListener("click", async () => {
  // añadir el código para mostrar las peliculas
  // puedes usar la función renderMovie para ayudarte a renderizarlas
});

const searchMovie = document.getElementById("search-button");
searchMovie.addEventListener("click", async () => {
  const searchTitle = document.getElementById("search-title");

  // añadir el código para buscar por titulo
});

function renderMovie(movie) {
  let genresHtml = "";
  for (const genre of movie.genres) {
    genresHtml += `<li>${genre}</li>`;
  }
  return `
    <div class="movie" id="movie-${movie.id}">
      <div class="title">${movie.title} <span>(${movie.year})</span></div>
      <div class="directed-by">Directed by: ${movie.director}</div>
      <div>Genres:</div>
      <ul class="genres">
        ${genresHtml}
      </ul>
      <p class="plot">${movie.plot}</p>
      <object class="poster-url" data="${movie.posterUrl}">
        <img src="icon-image-not-found-free-vector.jpg" />
      </object>
      <img src=>
    </div><hr>`;
}
