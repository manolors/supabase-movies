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

const loadButton = document.getElementById("load-data");
loadButton.addEventListener("click", () => {
  const messageContainer = document.querySelector(".message");
  fetch("./movies.json")
    .then(data => data.json())
    .then((data) => {
      data = data.movies;
      for (const movie of data) {
        supabase.from("movies").insert([movie])
          .then(response => {
            if (response.status === 200) {
              messageContainer.innerHTML += `<p>Película ${movie.title} insertada correctamente</p>`;
            } else {
              messageContainer.innerHTML += `<p>Error al insertar la película ${movie.title}</p>`;
            }
          })
          .catch(error => { messageContainer.innerHTML += `<p>${error}</p>`; });
      }
    }).catch(error => { messageContainer.innerHTML += `<p>${error}</p>`; });
});
