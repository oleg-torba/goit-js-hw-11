
import { Notify } from 'notiflix';
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
        response.searchQuery = searchQuery
        
        
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
  
    
 }


function markupImage(images){

const markup = images.map(({largeImageURL,webformatURL,likes,views,comments,downloads})=>{
    return `
  
    <div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="image" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments:${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>
    `

   
})
return markup
}


function clearMarkup(){
    gallery.innerHTML = ''
}