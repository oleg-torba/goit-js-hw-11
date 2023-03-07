
import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
const gallery = document.querySelector('.gallery')
const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more')
loadMoreBtn.addEventListener("click", onLoadMore)
form.addEventListener('submit', onSearch);


class NewApiService{
    constructor(){
        this.searchQuery = '';
        this.page = 1
    }

  async fetchArticles(){
console.log(this)
    const apiKey = "34025093-cc2dd49ea388fe86622ccaf7b";
    const BASE_URL = "https://pixabay.com/api/"
    const params = {
        key: `${apiKey}`,
        q: `${this.searchQuery}`,
        page: `${this.page}`,
        per_page: '40', 
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true'
       
      }
      try {
        const response = await axios.get(BASE_URL, {params})
        const res = await response.data.hits;
      this.incrementPage()
      return res
      } catch (error) {
        error =  Notify.info("Sorry, there are no images matching your search query. Please try again.");
       return error
      }
  }  
incrementPage(){
    this.page +=1
}
resetIncrementPage(){
    this.page = 1
}
  get query(){
    return this.searchQuery
  }

  set query(newQuery){
   this.searchQuery = newQuery
  }
}

const newApiService = new NewApiService()

function onSearch(e){
clearMarkup()
e.preventDefault();
newApiService.query = e.currentTarget.elements.searchQuery.value;
newApiService.resetIncrementPage()
newApiService.fetchArticles()
.then(onSuccess)
}

function onLoadMore(){
   
    newApiService.fetchArticles()
   
  .then(onSuccess) 
  .then(showLoadMoreBtn)
    
}
  
 function onSuccess(images){
    gallery.insertAdjacentHTML('beforeend', markupImage(images));

  
    const lightbox = new SimpleLightbox('.gallery__item', {showCounter: false});
    lightbox.refresh()
  showLoadMoreBtn()

   
 }


function markupImage(images){

const markup = images.map(({largeImageURL,webformatURL,likes,views,comments,downloads})=>{
    return `
  
    <div class="photo-card">
   <a class="gallery__item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="image" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>&#10084;${likes}</b>
      </p>
      <p class="info-item">
        <b>&#128065;${views}</b>
      </p>
      <p class="info-item">
        <b>&#128386;${comments}</b>
      </p>
      <p class="info-item">
        <b>&infin;${downloads}</b>
      </p>
    </div>
  </div>
    `

   
}).join('')


return markup
}




// function loadMoreMarkup(){
//   const buttoMarkup =  `<button type="button" class="load-more">Load more</button>`
//   return buttoMarkup
   
// }

function clearMarkup(){
    gallery.innerHTML = ''
}


function showLoadMoreBtn(){
    if(markupImage){
        loadMoreBtn.style.display = 'block'
    }
}