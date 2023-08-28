const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const submitButton = document.getElementById("connexion");
const loginForm = document.querySelector("form");
const errorContainer = document.getElementById("error-container");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empecher le rechargement de la page

  let data = {
    email: inputEmail.value,
    password: inputPassword.value,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erreur dans l’identifiant ou le mot de passe");
      }
    })
    .then((response) => {
      // token storage + redirection si response 200
      localStorage.setItem("token", response.token);
      location.href = "index.html";
    })

    .catch((error) => {
      errorContainer.textContent =
        "Erreur dans l’identifiant ou le mot de passe";
      errorContainer.style.color = "red";
      console.error("Erreur dans l’identifiant ou le mot de passe", error);
    });
});



// Récupèrer la liste d'éléments
const navList = document.getElementById("navigation-list");

// Fonction pour mettre à jour l'affichage des boutons en fonction de la connexion
function updateNavForAuthState(isLoggedIn) {
  if (isLoggedIn) {
    document.querySelector('.login-text').textContent = 'logout';
  } else {
    document.querySelector('.login-text').textContent = 'login';
  }
}

// Lancer la fonction pour décider quel bouton montrer
updateNavForAuthState(!!localStorage.getItem("token"));

// Ajout clic pour la déconnexion

  navList.addEventListener('click', (event) => {
    if (event.target.classList.contains('login-text') && event.target.textContent === 'logout') {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  });
  