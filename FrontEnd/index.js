// ***** variables ***
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

//fonction pour retourner le tableaux des travaux
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works"); // attendre que le fetch soit fini
  if (!response.ok) {
    console.log("erreur dans la récupération des travaux");
  } else {
    return await response.json(); // convertir la reponse en json et la stocker dans responseJson
  }
}
getWorks();

// fonction pour afficher les works dans le DOM

async function displayWorks() {
  const works = await getWorks();
  const gallery = document.querySelector(".gallery"); // stocker les éléments html avec la classe gallery
  if (gallery) {
    gallery.innerHTML = ""; // Réinitialise le contenu de l'élément gallery, en supprimant tout son contenu HTML
    works.forEach((work) => {
      const workElement = createWorks(work);
      gallery.appendChild(workElement);
    });
  } else {
    console.log(
      "Erreur : Impossible de trouver des éléments avec la classe 'gallery'"
    );
  }
}
displayWorks();

// fonction pour créer et configurer un élément de travail
function createWorks(work) {
  //Le paramètre work permet de passer des informations spécifiques sur chaque travail à la fonction createWorks
  const figure = document.createElement("figure");
  const img = document.createElement("img"); // Crée un élément img
  const figcaption = document.createElement("figcaption"); // Crée un élément figcaption
  img.src = work.imageUrl; // Définit la source de l'image
  img.alt = work.title; // Définit le texte alternatif de l'image
  figcaption.textContent = work.title; // Définit le texte du figcaption
  figure.dataset.categoryId = work.categoryId; // Ajoute l'ID de la catégorie en tant que data attribute
  figure.classList.add("figure"); // Ajoute une classe css à l'élément figure
  figure.appendChild(img); // Ajoute l'image à la figure
  figure.appendChild(figcaption); // Ajoute le figcaption à la figure
  return figure; // figure est retourné pour être ajouté à la galerie dans la fonction displayWorks.
}

// fonction pour ajouter les boutons par catégorie
// récupération tableaux catégories
async function getCategory() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCategory(); // retourner la repone en JSon

async function displayButtons() {
  const categories = await getCategory(); // const categories stock le resultat de la promesse await getCategory

  // créer le bouton Tous avec un id 0 puis l'ajouter au filtres
  const allBtn = document.createElement("button");
  allBtn.id = "0";
  allBtn.textContent = "Tous";
  filters.appendChild(allBtn);
  categories.forEach((category) => {
    const btn = document.createElement("button"); // créer un élément bouton pour chaque catégorie
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
}
displayButtons();

async function filterCategory() {
  const works = await getWorks();
  const buttons = document.querySelectorAll(".filters button"); // sélectionner tous les btns dans filtres
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id; // récupérer l'id du bouton cliqué
      gallery.innerHTML = "";
      if (btnId === "0") {
        // Si le bouton "Tous" est cliqué, afficher tous les travaux
        works.forEach((work) => {
          // const workElement = createWorks(work);
          // gallery.appendChild(workElement);
          displayWorks();
        });
      } else {
        const filteredWorks = works.filter((work) => work.categoryId == btnId); // filtrer works par catégorie
        filteredWorks.forEach((work) => {
          const workElement = createWorks(work);
          gallery.appendChild(workElement);
        });
      }
    });
  });
}
filterCategory();

// recupération du token

// quand l'utilisateur est connecté

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token"); // afin de récupérer le token depuis le sessionStorage
  const logOut = document.querySelector("header nav .log-out");
  const modification = document.getElementById("modif-btn");
  const editionMode = document.querySelector(".edition-mode");
  const modalContainer = document.querySelector(".modals-container");
  const closingBtns = document.querySelector(".fa-xmark");
  const normalMode = document.querySelector(".mode-normal");
  const displayModal = document.querySelector(".modal-gallery");
  const addBtn = document.querySelector(".add-photo");
  const goBackBtn = document.querySelector(".back-btn");
  const closeModal = document.querySelector(".close-btn");
  const secondVueModal = document.querySelector(".add-photo-vue"); 

  if(token){ 
    logOut.textContent = "logout"; // remplacer login par logout quand on est connecté 
    editionMode.style.display = "flex"; // afficher le mode édition 
    modification.style.display = "block"; // afficher le bouton de modification 
    filters.style.display = "none"; // cacher les boutons pour filtrer 
  }
// afficher la modale au clic sur le bouton modifier ( première vue de la modale )

modification.addEventListener("click" , () =>{

  modalContainer.style.display = "flex";
  displayModal.style.display = "flex";
})
  
// fermeture de la modale en cliquant sur la croix 

closingBtns.addEventListener("click" , ()=>{
  modalContainer.style.display = "none";
  
})

//ouverture de la deuxième vue de la modale pour ajouter les photos 
addBtn.addEventListener("click" , ()=>{
  displayModal.style.display = "none";
  secondVueModal.style.display = "flex";
})

});
