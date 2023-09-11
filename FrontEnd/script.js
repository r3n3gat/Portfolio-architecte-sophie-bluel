function updateGallery(works) {
  if (!Array.isArray(works)) {
    // verifie que works est un tableau
    console.error("Invalid data passed to updateGallery:", works)
    return;
  }
  const gallery = document.getElementsByClassName("gallery")[0]
  gallery.innerHTML = "" // vider la galerie
  // re-créér la galerie
  works.forEach((work) => {
    const figure = document.createElement("figure")
    figure.setAttribute('data-work-id', work.id)
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
    const works = await fetchWorks()
    allWorks = works
    updateGallery(works)
  } catch (error) {
    console.error("Failed to fetch and display works:", error)
  }
}

// Appel de la fonction finale galerie
fetchAndDisplayWorks()

let allWorks = []

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
    throw new Error("Erreur lors de la récupération des projets")
  }
  return (await response.json()) || []
}


function filterWorksByCategory(categoryId) {
  if (categoryId === "") {  // Attribut vide du html pour le bouton "Tous"
    updateGallery(allWorks);
    return;
  }

  const filtered = allWorks.filter(work => work.categoryId === parseInt(categoryId));
  updateGallery(filtered);
}

async function initProject() {
  try {
    allWorks = await fetchWorks()
  } catch (error) {
    console.error("Error during data initialization:", error)
  }
}

document.querySelectorAll('.filters button').forEach(button => {
  button.addEventListener('click', function() {
    const categoryId = this.getAttribute('data-category-id');
    filterWorksByCategory(categoryId);
  });
});

initProject();

const loginText = document.getElementById("loginText")

const userAuthenticated = !!localStorage.getItem("token")

if (userAuthenticated) {
  loginText.innerText = "logout"
  const hiddenElements = document.querySelectorAll(".hidden")
  hiddenElements.forEach((element) => {
    element.classList.remove("hidden")
  });
}
// Génération de la modale
const modal = document.getElementById("modal")
const workModal = document.getElementById("workModal")
const showModal = document.querySelectorAll(".show-modal")
const galleryModal = document.querySelector(".gallery-modal")

const openModal = () => {
  modal.showModal()
}

showModal.forEach((button) => {
  button.addEventListener("click", openModal)
});

// Fermer la modale avec la croix
const closeModalCross = document.querySelector(".close-modal")
//const closeModalOutside = document.querySelectorAll('.modal')
const closeModalCrossWorkModal = document.querySelector(".close-work-modal")
const backToModalButton = document.getElementById('backToModalButton')

closeModalCross.addEventListener("click", closeModal)
modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target === workModal) {
    closeModal()
  }
});

workModal.addEventListener("click", (event) => {
  if (event.target === workModal) {
    closeModal()
  }
});

function closeModal() {
  modal.close()
  workModal.close()
}

closeModalCrossWorkModal.addEventListener('click', closeModal)


// Retour fleche gauche
backToModalButton.addEventListener('click', function () {
    workModal.close()
})

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    const galleryModal = document.querySelector(".gallery-modal")
    works.forEach((work) => {
      const figure = document.createElement("figure")
      const image = document.createElement("img")
      image.src = work.imageUrl
      image.style.width = "78px"
      image.style.height = "104px"
      const figcaption = document.createElement("figcaption")
      figcaption.innerHTML = "éditer"
      const deleteSpan = document.createElement("span")
      deleteSpan.classList.add("delete-icon")
      const deleteIcon = document.createElement("i")
      deleteIcon.classList.add("fa-solid", "fa-trash-can")
      deleteSpan.appendChild(deleteIcon)
      figure.appendChild(image)
      figure.appendChild(figcaption)
      figure.appendChild(deleteSpan)
      galleryModal.appendChild(figure)
      deleteIcon.addEventListener('click', (event) => {
        event.preventDefault()
          deleteWork(work.id)
      })
    })
  })

// Effacer un projet du backend dans la modale 
function deleteWork(id) {
  const accessToken = localStorage.getItem("token")

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("work deleted")
        removeWorkOnGallery(id) // Effacer un projet de la galerie
      } else {
        console.error("Deletion failed")
      }
    })
    .catch((error) => {
      console.error("An error occurred", error)
    })
  }

function removeWorkOnGallery(workId) {
  const figure = document.querySelector(`.gallery-modal figure[data-work-id="${workId}"]`)
  if (figure) {
    figure.remove()
  }
}

// Ajouter un projet
const addWorkButton = document.getElementById('addWorkButton')
addWorkButton.addEventListener('click', openWorkModal)
function openWorkModal() {
    const modal = document.querySelector('.workModal')
    if (modal) {
        modal.showModal()
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
            console.log('An error occurred', error)
        })
}


// Ajout des categories à la liste
function addCategoriesToSelect(categories) {
  categories.forEach(category => {
      const option = document.createElement('option')
      option.value = category.id
      option.textContent = category.name
      categorySelectModal.appendChild(option)
  });
}

fetchCategoriesModal();

// preview dans la modale
const uploadButtonLabel = document.getElementById('uploadButtonLabel')
const photoPreview = document.getElementById('photo-preview')
let selectedImage = null

function triggerFileSelect() {
  const fileInput = document.getElementById('uploadButton')
  fileInput.type = 'file'
  fileInput.accept = 'image/jpeg, image/png'

  fileInput.addEventListener("change", (event) => {
    const photo = event.target.files[0]

    if (photo && photo.size > 4 * 1024 * 1024) {
      alert('la taille maximale est de 4 mo')
      return
  }

    if (photo) {
      selectedImage = photo
      const reader = new FileReader()

      reader.addEventListener("load", () => {
        const previewImage = new Image()

        previewImage.onload = () => {
          const maxHeight = 169 // Photo max height

          console.log(previewImage.height)

          // Redimensionnement de la preview
          const scaleFactor = maxHeight / previewImage.height
          const width = previewImage.width * scaleFactor
          const height = previewImage.height * scaleFactor
          // Appliquer les nouvelles dimensions
          previewImage.width = width;
          previewImage.height = height;
          // Effacer la preview et afficher la nouvelle 
          photoPreview.innerHTML = ''
          photoPreview.appendChild(previewImage)
        }
        // source de la preview
      previewImage.src = reader.result
    })
    
    reader.readAsDataURL(photo)
    uploadButton.style.display = 'none'
    }

    // Cacher les autres elements dans la modale

    const elementsHidden = document.querySelectorAll('.modal p, .modal i.fa-image')
      elementsHidden.forEach((element) => {
        element.style.display = 'none'
    })
    uploadButtonLabel.style.display = 'none'
  })

  fileInput.click();
}

uploadButton.addEventListener('click', triggerFileSelect)

//conditions à remplir pour l'envoie du nouveau projet
document.addEventListener('DOMContentLoaded', function () {
    const photoInput = document.getElementById('uploadButton')
    const titleInput = document.getElementById('workTitle')
    const categoryInput = document.getElementById('workCategory')
    const submitButtonModal = document.getElementById('submitButtonModal')

    function checkFields() {
        const photoValue = photoInput.value.trim()
        const titleValue = titleInput.value.trim()
        const categoryValue = categoryInput.value.trim()

        if (photoValue !== '' && titleValue !== '' && categoryValue !== "") {
            submitButtonModal.classList.add('submit-button-active')
            submitButtonModal.removeAttribute('disabled') // bouton submit cliquable
        } else {
            submitButtonModal.classList.remove('submit-button-active')
            submitButtonModal.setAttribute('disabled', 'disabled') // bouton submit desactivé
        }
    }

    photoInput.addEventListener('input', checkFields)
    titleInput.addEventListener('input', checkFields)
    categoryInput.addEventListener('change', checkFields)

})

// Envoyer un nouveau projet dans la galerie 
const submitButtonModal = document.getElementById('submitButtonModal')

// Envoyer un nouveau projet dans le backend avec la modale
function createWork() {

    const titleInput = document.getElementById('workTitle')
    const categoryInput = document.getElementById('workCategory')

    const image = selectedImage //photo enregistrée
    const title = titleInput.value.trim() //title enregistré et nettoyé
    const category = parseInt(categoryInput.value.trim())// Id de categorie en int et nettoyé

    const formData = new FormData() // creer un formdata pour envoyer les données

    formData.append('image', image) //photo ajoutée au formdata
    formData.append('title', title) //title ajoutée au formdata
    formData.append('category', category) //categorie ajoutée au formdata

    const accessToken = localStorage.getItem('token')

    // Envoyer la requete POST <========== ****
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    })
        .then(response => response.json())
        .then(newWork => {
          console.log(newWork)
          addWorkToGallery(newWork) // Ajouter le nouveau projet à la galerie
        })
        .catch(error => {
          console.error('An error occurred', error)
        })
}

// Envoie du nouveau travail
submitButtonModal.addEventListener('click', (event) => {
  event.preventDefault()
  createWork()
})

// Ajout d'un nouveau projet en js via l'API dans la galerie html
function addWorkToGallery(work) {
    const gallery = document.getElementById('galleryContainer')
    const figure = document.createElement('figure')
    const image = document.createElement('img')
    const figcaption = document.createElement('figcaption')

    image.addEventListener('load', () => {
        figure.appendChild(image)
        figure.appendChild(figcaption)
        gallery.appendChild(figure)
    })

    image.src = work.imageUrl
    figcaption.textContent = work.title

    image.addEventListener('error', () => {
        console.error('loading image error')
    })


}


// BLOC POUR LE LOGOUT :

const navList = document.getElementById("navigation-list")

function updateNavForAuthState(isLoggedIn) {
  const loginTextElement = document.getElementById('loginText')
  
  if (loginTextElement) {
    if (isLoggedIn) {
      loginTextElement.textContent = 'logout'
      loginTextElement.href = "index.html" // redirection vers l'acceuil
    } else {
      loginTextElement.textContent = 'login'
      loginTextElement.href = "login.html" // Redirection vers la page de connexion
    }
  }
}

updateNavForAuthState(!!localStorage.getItem("token"))

navList.addEventListener('click', (event) => {
  if (event.target.id === 'loginText' && event.target.textContent === 'logout') {
    event.preventDefault()  // empeche le rechargement
    localStorage.removeItem("token")
    updateNavForAuthState(false)
    window.location.href = "index.html"
  }
});
