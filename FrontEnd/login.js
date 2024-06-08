const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
// Récupération du span avec la classe error-msg
const error = document.querySelector(".error-msg");

// Initialisation du message d'erreur
error.innerText = "";

// Création de la fonction de redirection vers la page d'accueil
function redirectToHome() {
  window.location.href = "./index.html";
}

// Ajout d'un écouteur d'événement pour la soumission du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Pour prévenir le comportement par défaut du navigateur (soumission auto)

  // Récupération des valeurs des champs du formulaire
  const users = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  const requestData = JSON.stringify(users);  
  console.log(requestData);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestData,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur lors de la requête");
    } else {
      return response.json();  
    }
  })
  .then((data) => {
    sessionStorage.setItem("token", data.token); 
    redirectToHome();
  })
  .catch((error) => {
    console.log(error);
    error.innerText = "Échec de la connexion. Veuillez vérifier vos informations.";
  });
  
});