// ***** variables ***
const token = sessionStorage.getItem("token");
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
  // éxécute le code après le chargement du html
  const token = sessionStorage.getItem("token"); // afin de récupérer le token depuis le sessionStorage
  const logOut = document.querySelector("header nav .log-out");
  const modification = document.getElementById("modif-btn");
  const editionMode = document.querySelector(".edition-mode");
  const modalContainer = document.querySelector(".modals-container");
  const closingBtns = document.querySelectorAll(".fa-xmark");
  const normalMode = document.querySelector(".mode-normal");
  const displayModal = document.querySelector(".modal-gallery");
  const addBtn = document.querySelector(".add-photo");
  const goBackBtn = document.getElementById("back-btn");
  const closeModal = document.querySelector(".close-btn");
  const secondVueModal = document.querySelector(".add-photo-vue");

  

  if (token) {
    logOut.textContent = "logout"; // remplacer login par logout quand on est connecté
    editionMode.style.display = "flex"; // afficher le mode édition
    modification.style.display = "block"; // afficher le bouton de modification
    filters.style.display = "none"; // cacher les boutons pour filtrer
  }
  // afficher la modale au clic sur le bouton modifier ( première vue de la modale )

  modification.addEventListener("click", () => {
    modalContainer.style.display = "flex";
    displayModal.style.display = "flex";
    secondVueModal.style.display = "none";
  });

  // fermeture de la modale en cliquant sur la croix

  closingBtns.forEach((btn) => {
    // pour chaque bouton fermer la modale en cliquant sur le bouton
    btn.addEventListener("click", () => {
      modalContainer.style.display = "none";
    });
  });

  //ouverture de la deuxième vue de la modale pour ajouter les photos
  addBtn.addEventListener("click", () => {
    displayModal.style.display = "none";
    secondVueModal.style.display = "flex";
  });
  //fermer la modale en cliquant n'importe où en dehors de celle ci
  window.onclick = function (event) {
    if (event.target == modalContainer) {
      modalContainer.style.display = "none";
    }
  };
  // redirection vers la page de déconnexion  au clic sur logout

  logOut.addEventListener("click", () => {
    sessionStorage.removeItem("token"); // supprimer le token de sessionStorage
    window.location.href = "login.html"; // redirige vers la page de connexion
  });

  // redirection vers la page précédente au clic sur le bouton retour

  goBackBtn.addEventListener("click", () => {
    secondVueModal.style.display = "none";
    displayModal.style.display = "flex";
  });
});

//affichage des photos dans la modale

async function displayModalPhotos() {
  const works = await getWorks(); // on attend que getWorks récupère les travaux 

  // séléctionner l'élément qui contiendra les imgs et icones de la corbeille
  const photosModal = document.querySelector(".gallery-container");
  if (photosModal) {
   //Si on a photosModal, on vide le contenu pour ne pas dupliquer pas les img 
    photosModal.innerHTML = '';

    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const trashcanIcon = document.createElement("span");
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can");
      trashcanIcon.appendChild(trash);
      trashcanIcon.classList.add("trash-can"); // Ajout de classe pour le style
      trashcanIcon.setAttribute("data-id", work.id); // Attribution de l'id à l'icone
      trashcanIcon.addEventListener("click", async (event) => {
        try {
          await deleteWork(event, work.id);
        } catch (error) {
          console.error("erreur de suppression:", error);
        }
      });
      img.src = work.imageUrl;
      img.alt = work.title;
      figure.appendChild(img); // Ajout de l'image à la figure
      figure.appendChild(trashcanIcon); // Ajout de l'icône de corbeille à la figure
      photosModal.appendChild(figure); // Ajout de la figure à la galerie
    });
  } else {
    console.error("aucun élément n'a été trouvé")
  }
}

displayModalPhotos();

// suppression de l'image 
async function deleteWork(event, id) {
  try {
    const response = await fetch("http://localhost:5678/api/works/" + id, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const parentFigure = event.target.closest("figure");
      if (parentFigure) {
        parentFigure.remove();
        alert("Suppression réussie");
      }
      displayModalPhotos();
      displayWorks();
    } else {
      console.error("la suppression a échoué");
    }
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    alert("Une erreur s'est produite lors de la suppression de l'image.");
  }
}

// Ajout de projets

document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.querySelector(".upload-form"); // récup le form
  const inputFile = document.getElementById("image");
  const labelFile = document.getElementById("label-image");
  const photoPreview = document.getElementById("photo-preview");
  const iconeFile = document.getElementById("image-icone");
  const photoTitle = document.getElementById("title-modal-photo");
  const paragraph = document.querySelector(".img-type");
  const validationBtn = document.getElementById("validation-btn");
  const errorMessage = document.querySelector(".erreur");
  const title = document.querySelector(".img-title");
  const category = document.querySelector(".img-category");

  inputFile.addEventListener("change", (event) => {
    const file = inputFile.files[0]; // récupérer les éléments de l'input
    if (file) {
      if (file.size < 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.src = e.target.result;
          photoPreview.style.display = "flex";
          labelFile.style.display = "none";
          paragraph.style.display = "none";
          iconeFile.style.display = "none";
        };
        reader.readAsDataURL(file);
      } else {
        alert("Le fichier sélectionné est trop volumineux. La taille maximale est de 4 Mo.");
      }
    }
  });

  // créer les catégories
  async function createCategories() {
    const select = document.querySelector("select");
    try {
      const categories = await getCategory();
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  }
  createCategories();

  // vérification si les tous les champs sont remplis
  formElement.addEventListener("input", () => {
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") {
      validationBtn.style.backgroundColor = "#1D6154";
      validationBtn.disabled = false;
      errorMessage.textContent = "";
    } else {
      validationBtn.style.backgroundColor = "#CCCCCC";
      validationBtn.disabled = true;
      errorMessage.textContent = "Veuillez remplir tous les champs du formulaire.";
    }
  });

  // requête POST pour l'ajout des photos
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // éviter le comportement par défaut
    const formData = new FormData(formElement); // Crée un objet FormData à partir du formulaire

    try {
      const response = await fetch("http://localhost:5678/api/works/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // Inclut le token dans l'en-tête
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Requête échouée");
      } else {
        alert("Votre formulaire a bien été envoyé");
      }

      const data = await response.json();
      console.log(data);
      displayModalPhotos();
      displayWorks();

      resetForm(); // Réinitialiser les champs du formulaire

    } catch (error) {
      console.error(error);
    }
  });

  // fonction pour réinitialiser les champs du formulaire
  function resetForm() {
    formElement.reset(); // Réinitialiser les champs du formulaire
    photoPreview.src = "";
    photoPreview.style.display = "none";
    labelFile.style.display = ""; // garder le style initial 
    paragraph.style.display = "";
    iconeFile.style.display = "";
    validationBtn.style.backgroundColor = "#CCCCCC";
    validationBtn.disabled = true;
  }
});