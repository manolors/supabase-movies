// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, set, child } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY || false,
  authDomain: import.meta.env.VITE_AUTHDOMAIN || false,
  databaseURL: import.meta.env.VITE_DATABASEURL || false,
  projectId: import.meta.env.VITE_PROJECTID || false,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET || false,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID || false,
  appId: import.meta.env.VITE_APPID || false,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

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
        let title = movie.title;
        title = title.replace(/\.|\s|#|\$|\[|\]|&|'|·|:|-/ig, "").toLowerCase();
        set(ref(db, `movies/${title}`), movie).then(() => {
          messageContainer.innerHTML += `<p>Película ${movie.title} insertada correctamente</p>`;
        }).catch((e) => {
          messageContainer.innerHTML += `<p>Error al insertar la película ${movie.title}: ${e}</p>`;
        });
      }
    }).catch(error => { messageContainer.innerHTML += `<p>${error}</p>`; });
}

const showMovies = document.getElementById("show-movies");
showMovies.addEventListener("click", async () => {
  const dbref = ref(db);
  get(child(dbref, "movies")).then((snapshot) => {
    if (snapshot.exists()) {
      const movies = snapshot.val();
      for (const movie of Object.keys(movies)) {
        moviesContainer.innerHTML += renderMovie(movies[movie]);
      }
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
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
