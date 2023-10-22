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
const moviesContainer = document.querySelector(".movies");

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  messageContainer.innerHTML = "";
});

const loadButton = document.getElementById("load-data");

loadButton.addEventListener("click", () => {
  fetch("./movies.json")
    .then((data) => data.json())
    .then((data) => data.movies)
    .then((data) => {
      for (const movie of data) {
        supabase
          .from("movies")
          .insert([movie])
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              messageContainer.innerHTML += `<p>Película ${movie.title} insertada correctamente</p>`;
            } else {
              messageContainer.innerHTML += `<p>Error al insertar la película ${movie.title} [${response.error.message}]</p>`;
            }
          })
          .catch((error) => {
            messageContainer.innerHTML += `<p>${error}</p>`;
          });
      }
    })
    .catch((error) => {
      messageContainer.innerHTML += `<p>${error}</p>`;
    });
});

const loadMovies = document.getElementById("load-movies");

loadMovies.addEventListener("click", async () => {
  const { data: movies, error } = await supabase.from("movies").select("*");
  if (!error) {
    moviesContainer.innerHTML = "";
    for (const movie of movies) {
      moviesContainer.innerHTML += renderMovie(movie);
    }
  } else {
    messageContainer.innerHTML += `<p>${error}</p>`;
  }
});

const searchMovie = document.getElementById("search-button");
searchMovie.addEventListener("click", async () => {
  const searchTitle = document.getElementById("search-title");
  const { data: movies, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("title", `%${searchTitle.value}%`);
  if (!error) {
    moviesContainer.innerHTML = "";
    for (const movie of movies) {
      moviesContainer.innerHTML += renderMovie(movie);
    }
  } else {
    messageContainer.innerHTML += `<p>${error}</p>`;
  }
});

function renderMovie(movie) {
  const genresHtml = [];
  for (const genre of movie.genres) {
    genresHtml.push(` <span class="genre">${genre}</span>`);
  }
  return `
    <div class="movie" id="movie-${movie.id}">
      <div class="title">${movie.title} <span>(${movie.year})</span></div>
      <div class="directed-by">Directed by: ${movie.director}</div>
      <div class="genres">
        ${genresHtml}
      </div>
      <p class="plot">${movie.plot}</p>
      <object class="poster-url" data="${movie.posterUrl}">
        <img src="icon-image-not-found-free-vector.jpg" />
      </object>
      <img src=>
    </div>`;
}

supabase
  .channel("custom-delete-channel")
  .on(
    "postgres_changes",
    { event: "DELETE", schema: "public", table: "movies" },
    (payload) => {
      deleteMovie(payload);
    }
  )
  .subscribe();

function deleteMovie(payload) {
  console.log(payload);
  console.log(payload.old);
  const idToDelete = payload?.old?.id || false;

  if (idToDelete) {
    const movie = document.getElementById(`movie-${idToDelete}`);
    movie.classList.add("removed");
    setTimeout(() => movie.remove(), 1000);
  }
}
