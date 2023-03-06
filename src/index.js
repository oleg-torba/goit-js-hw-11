
import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
const gallery = document.querySelector('.gallery')
const input = document.querySelector('input')
const form = document.querySelector('.search-form');
let searchQuery = ''




form.addEventListener('submit', image);

function error(res){
    if(res.length === 0){
       
    }
}

async function resolveImage(searchQuery){
   const apiKey = "34025093-cc2dd49ea388fe86622ccaf7b";
   const BASE_URL = "https://pixabay.com/api/"
    const params = {
        key: `${apiKey}`,
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true'
       
      }
      try {
        const response = await axios.get(BASE_URL, {params})
        const res = await response.data.hits;
      
        
        
        return res
      } catch (error) {
        error =  Notify.info("Sorry, there are no images matching your search query. Please try again.");
       return error
      }
        
    
}



 function image(e){
e.preventDefault();
searchQuery = input.value;
console.log(searchQuery)

clearMarkup()
  resolveImage(searchQuery)
  .then(onSuccess)
  
 }
 
  
 function onSuccess(images){
    gallery.insertAdjacentHTML('beforeend', markupImage(images));
  
    const lightbox = new SimpleLightbox('.gallery__item', {showCounter: false});
    lightbox.refresh()
 }


function markupImage(images){

const markup = images.map(({largeImageURL,webformatURL,likes,views,comments,downloads})=>{
    return `
  
    <div class="photo-card">
   <a class="gallery__item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="image" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>${likes}</b>
      </p>
      <p class="info-item">
        <b>${views}</b>
      </p>
      <p class="info-item">
        <b>${comments}</b>
      </p>
      <p class="info-item">
        <b>${downloads}</b>
      </p>
    </div>
  </div>
    `

   
}).join('')
return markup

const lightbox = new SimpleLightbox(".gallery a", {
    captionPosition: "top",
    captionsData: "alt",
    captionDelay: 250,
    enableKeyboard: true,
    close: false,
    fadeSpeed: 300,
    overlayOpacity: 0.5,


})
}

function clearMarkup(){
    gallery.innerHTML = ''
}


