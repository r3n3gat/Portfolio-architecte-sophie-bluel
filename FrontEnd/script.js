function updateGallery(works) {
  if (!Array.isArray(works)) { // verifie que works est un tableau
    console.error('Invalid data passed to updateGallery:', works);
    return;
  }  const gallery = document.getElementsByClassName("gallery")[0]
  gallery.innerHTML = "" // vider la galerie
  // re-créér la galerie
  works.forEach((work) => {
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    image.src = work.imageUrl
    const figcaption = document.createElement("figcaption")
    figcaption.textContent = work.title
    gallery.appendChild(figure)
    figure.appendChild(image)
    figure.appendChild(figcaption)
  })
}

//Création de la fonction recup et affichage
async function fetchAndDisplayWorks() {
  try {
    const works = await fetchWorks();
    updateGallery(works);
  } catch (error) {
    console.error('Failed to fetch and display works:', error);
  }
}

// Appel de la fonction finale galerie
fetchAndDisplayWorks()

let allWorks = []
let categories = []

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories")
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des catégories")
  }
  return await response.json()
}

async function fetchWorks() {
  const apiURL = "http://localhost:5678/api/works"
  const response = await fetch(apiURL)
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des œuvres")
  }
  return await response.json() || []
}

function filterAllClick() {
  updateGallery(allWorks)
}

function filterByCategory(categoryName) {
  const filtered = allWorks.filter(
    (work) =>
      work.categoryId ===
      categories.find((category) => category.name === categoryName).id
  );
  updateGallery(filtered)
}

async function initProject() {
  try {
    categories = await fetchCategories();
    allWorks = await fetchWorks();
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données:", error);
  }
}

document
  .getElementById("filters-all")
  .addEventListener("click", filterAllClick)
document
  .getElementById("filters-objects")
  .addEventListener("click", () => filterByCategory("Objets"))
document
  .getElementById("filters-appartments")
  .addEventListener("click", () => filterByCategory("Appartements"))
document
  .getElementById("filters-hotels")
  .addEventListener("click", () => filterByCategory("Hotels & restaurants"))

initProject();

const loginText = document.getElementById("login-text")

const userAuthenticated = typeof localStorage.getItem("token") === "string"

if (userAuthenticated) {
  loginText.innerText = "logout";
  const hiddenElements = document.querySelectorAll(".hidden")
  hiddenElements.forEach((element) => {
    element.classList.remove("hidden")
  })
}
// Génération de la modale
const modal = document.getElementById('modal')
const workModal = document.getElementById('workModal')
const showModal = document.querySelectorAll('.show-modal')
const closeModalCross = document.querySelector(".close-modal")
const closeModalOutside = document.querySelectorAll('.modal')
const closeModalCrossWorkModal = document.querySelector(".close-work-modal");


const openModal = () => {
    modal.showModal()
}

showModal.forEach((button) => {
    button.addEventListener('click', openModal)
})

// Fermer la modale avec la croix
closeModalCross.addEventListener('click', closeModal)
modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === workModal) {
        closeModal()
    }
})

closeModalCross.addEventListener('click', closeModal);
workModal.addEventListener('click', (event) => {
    if (event.target === workModal) {
        closeModal();
    }
});

closeModalCrossWorkModal.addEventListener('click', closeModal);
workModal.addEventListener('click', (event) => {
    if (event.target === workModal) {
        closeModal();
    }
});

function closeModal() {
  modal.close()
  workModal.close()
}

// Fermer la modale avec clic hors modale
/*closeModalCross.addEventListener('click', closeModal)
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal()
    }
})*/

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
        const galleryModal = document.querySelector('.gallery-modal')
        works.forEach(work => {
            const figure = document.createElement('figure')
            const image = document.createElement('img')
            image.src = work.imageUrl
            image.style.width = '78px'
            image.style.height = '104px'
            const figcaption = document.createElement('figcaption')
            figcaption.innerHTML = 'éditer'
            const deleteSpan = document.createElement('span');
            deleteSpan.classList.add('delete-icon');
            const deleteIcon = document.createElement('i')
            deleteIcon.classList.add('fa-solid', 'fa-trash-can')
            deleteSpan.appendChild(deleteIcon)
            figure.appendChild(image)
            figure.appendChild(figcaption)
            figure.appendChild(deleteSpan)
            galleryModal.appendChild(figure)
            deleteIcon.addEventListener('click', () => {
              // Ajout d'une fenêtre de confirmation de suppression ...
              if(window.confirm("Êtes-vous sûr de vouloir supprimer cette image?")) {
                  deleteWork(work.id)
                }
              })
        });
    });

// Effacer un projet dans la modale
function deleteWork(id) {
  const accessToken = localStorage.getItem('token')

  fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
          Authorization: `Bearer ${accessToken}`

      }
  })
      .then(response => {
          if (response.ok) {
              console.log('work deleted')
              removeWorkOnModal(id) // Effacer un projet dans la modale
              removeWorkOnGallery(id) // Effacer un projet de la galerie de projet

          }
          else {
              console.error('deletion failed')
          }
      })
      .catch(error => {
          console.error('une erreur est survenue', error)
      })
}

function removeWorkOnModal(workId) {
  const figure = document.querySelector(`.gallery-modal figure[data-work-id="${workId}"]`)
  if (figure) {
      figure.remove()
  }
}

function removeWorkOnGallery(workId) {
  const figure = document.querySelector(`.gallery figure[data-work-id="${workId}"]`)
  if (figure) {
      figure.remove()
  }
}

// Ajouter un projet
const addWorkButton = document.querySelector('.add-button')
console.log(addWorkButton);  // debugg (a effacer()
addWorkButton.addEventListener('click', openWorkModal)

function openWorkModal() {
  console.log("Function openWorkModal is triggered")  // debugg clic sur le bouton (a effacer)

  const modal = document.querySelector('.workModal')
  console.log(modal);  // debugg (a effacer)
  
  if (modal) {
      modal.showModal();
    }
}

// Récuperer les categories par l'API
const categorySelectModal = document.getElementById('workCategory')

function fetchCategoriesModal() {
    const apiURL = 'http://localhost:5678/api/categories'

    fetch(apiURL)
        .then(response => response.json())
        .then(categoriesData => {
            addCategoriesToSelect(categoriesData)
        })
        .catch(error => {
            console.log('une erreur est survenue', error)
        })
}

// Ajout des categories à la liste
function addCategoriesToSelect(categories) {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelectModal.appendChild(option);
    });
}

fetchCategoriesModal()

// Ajouter une photo via la modale
function triggerFileSelect() { // create dynamically the input element type 'file'
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg, image/png';

  fileInput.addEventListener('change', (event) => {
      const photo = event.target.files[0]; // recovery of the photo selected
      const photoPreview = document.getElementById('photo-preview');

      if (photo) {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
              const previewImage = document.createElement('img');
              previewImage.src = reader.result; // define the URL as a source
              photoPreview.innerHTML = ''; // reace 
              photoPreview.appendChild(previewImage);

          });

          reader.readAsDataURL(photo); // read the file as data URL

      }


      // Cacher les autres elements

      const elementsHidden = document.querySelectorAll('p, i')
      elementsHidden.forEach((element) => {
          element.style.display = 'none'
      })
      uploadButton.style.display = 'none'
  });

  fileInput.click();
}

uploadButton.addEventListener('click', triggerFileSelect);

