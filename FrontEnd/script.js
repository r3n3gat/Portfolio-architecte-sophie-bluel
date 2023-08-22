/* Premiere version de la fonction pour l'étape 1.1 :

//Création de la fonction juste de récupération
async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) {
            throw new Error("Erreur de réponse de l'API");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des œuvres :", error);
    }
}

// Création de la fonction de vidage et update galerie
function updateGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0];
    gallery.innerHTML = "";  // Nettoyer le contenu précédent de la galerie

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
        gallery.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(figcaption);
    });
}

//Création de la fonction finale
async function fetchAndDisplayWorks() {
    const works = await fetchWorks();
    updateGallery(works);
}

// Appel de la fonction
fetchAndDisplayWorks();*/

// Nouvelle version pour l'étape 1.2 : eliminer repetition/ gerer erreur

// Création de la fonction de vidage et update galerie

function updateGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0];
    gallery.innerHTML = "";  // vider la galerie
    // re-créér la galerie
    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
        gallery.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(figcaption);
    });
}

//Création de la fonction recup et affichage
async function fetchAndDisplayWorks() {
    const works = await fetchWorks();
    updateGallery(works);
}

// Appel de la fonction finale galerie
fetchAndDisplayWorks();

let allWorks = [];
let categories = [];

async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
    }
    return await response.json();
}

async function fetchWorks() {
    const apiURL = 'http://localhost:5678/api/works';
    const response = await fetch(apiURL);
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des œuvres");
    }
    allWorks = await response.json();
    updateGallery(allWorks);
}

function filterAllClick() {
    updateGallery(allWorks);
}

function filterByCategory(categoryName) {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === categoryName).id);
    updateGallery(filtered);
}

async function initProject() {
    try {
        categories = await fetchCategories();
        await fetchWorks();
    } catch (error) {
        console.error("Erreur lors de l'initialisation des données:", error);
    }
}

document.getElementById('filters-all').addEventListener('click', filterAllClick);
document.getElementById('filters-objects').addEventListener('click', () => filterByCategory('Objets'));
document.getElementById('filters-appartments').addEventListener('click', () => filterByCategory('Appartements'));
document.getElementById('filters-hotels').addEventListener('click', () => filterByCategory('Hotels & restaurants'));

initProject();
