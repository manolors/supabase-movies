import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || false;
const SUPABASE_SECRET = import.meta.env.VITE_SUPABASE_SECRET || false;
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

const logoutButton = document.querySelector("input[name=logout]");
logoutButton.addEventListener("click", await logout);

const loginButton = document.querySelector("input[name=login]");
loginButton.addEventListener("click", await login);

async function checkUserLogged() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    return;
  }
  if (!data.session) {
    showLoginForm();
    return;
  }
  console.log(data.session.user.email);
  const userLogged = document.querySelector(".logged-user");
  userLogged.innerText = `(${data.session.user.email})`;
  hideLoginForm();
}

function showLoginForm() {
  const loginForm = document.querySelector(".login-form");
  loginForm.classList.add("active");

  const logoutForm = document.querySelector(".logout-form");
  logoutForm.classList.remove("active");
}

function hideLoginForm() {
  const loginForm = document.querySelector(".login-form");
  loginForm.classList.remove("active");
  const logoutForm = document.querySelector(".logout-form");
  logoutForm.classList.add("active");
}

async function logout(e) {
  console.log("loggin out!");
  e.preventDefault();
  await supabase.auth.signOut();
  checkUserLogged();
}

async function login(e) {
  e.preventDefault();
  const email = document.querySelector("input[name=email]").value || false;
  const password = document.querySelector("input[name=password]").value || false;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error) {
    console.log(`Usuario logeado correctamente:${JSON.stringify(data)}`);
  } else {
    console.error(error);
  }
  checkUserLogged();
}

await checkUserLogged();

const messageContainer = document.querySelector(".message");
const moviesContainer = document.querySelector(".movies");
const clearButton = document.getElementById("clear");

clearButton.addEventListener("click", () => {
  messageContainer.innerHTML = "";
  moviesContainer.innerHTML = "";
});

const loadButton = document.getElementById("load-data");
loadButton.addEventListener("click", ImportMovies);

function ImportMovies() {
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
}

const showMovies = document.getElementById("show-movies");
showMovies.addEventListener("click", async () => {
  // añadir código para mostrar las películas cargándolas de supabase
});

const searchMovie = document.getElementById("search-button");
searchMovie.addEventListener("click", async () => {
  const searchTitle = document.getElementById("search-title");

  // añadir el código para buscar por titulo
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
