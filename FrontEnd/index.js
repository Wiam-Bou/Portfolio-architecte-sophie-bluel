const gallery = document.querySelector(".gallery");



async function getWorks() {
  console.log("Tentative de récupération des travaux depuis l'API");
  const response = await fetch("http://localhost:5678/api/works");
  if (response.ok) {
    console.log("Réponse de l'API obtenue avec succès !");
    return await response.json();
    
  } else {
    console.error("Échec de la récupération des works depuis l'API");
  }
}

async function affichageWorks() {
  const works = await getWorks(); // les données recupérées sont stockées dans la variables works 
  const gallery = document.querySelector(".gallery"); //selection des éléments avec la classe gallery
  if (gallery) { 
      gallery.innerHTML = ""; // Efface le contenu précédent de la galerie, en vérifiant si la gallerie existe 
     console.log(works);
      works.forEach((element) => { // on parcourt chaque élément de works 
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          const figcaption = document.createElement("figcaption");
          img.src = element.imageUrl;
          figcaption.textContent = element.title;
          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure); // l'élement figure est ajouté comme enfant de gallery 
      });
  } else {
      console.error("Erreur : Impossible de trouver des éléments avec la classe 'gallery'");
  }
}
affichageWorks(); // exécution de la fonction 

// ajout des filtres 

// récupération des catégories 

const getCategory = await fetch ("http://localhost:5678/api/categories");
categories = await getCategory.json(); // convertir la réponse au format json et l'assigner à la variable categories

