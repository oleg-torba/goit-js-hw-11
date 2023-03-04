
import { Notify } from 'notiflix';
import axios from 'axios';
const gallery = document.querySelector('.gallery')
// import galleryCard from './templates'
const form = document.querySelector('.search-form');
let searchQuery = ''


form.addEventListener('submit', image);


// class Gallery{
//     #searchQuery
//     constructor(){
//         this.searchQuery = ''
//     }
   

//     

//     async getImages(searchQuery = this.#searchQuery) {
//         this.searchQuery = searchQuery;
    
//         if(this.#searchQuery !== '') {
//           const params = {
//             key: `${apiKey}`,
//             q: `${searchQuery}`,
//             image_type: 'photo',
//             orientation: 'horizontal',
           
//           }
    
      
      
        
        
//       }
//  }}

// const apiService = new Gallery
// async function getImage(value){

async function resolveImage(searchQuery){
    apiKey = "34025093-cc2dd49ea388fe86622ccaf7b";
    BASE_URL = "https://pixabay.com/api/"
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
        throw new Error("Ошибка")
     }
}

 function image(e){
e.preventDefault();
searchQuery = e.currentTarget.searchQuery.value;
console.log(searchQuery)
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

// getImage()
// // let inputValue = '';
// // const key = `34025093-cc2dd49ea388fe86622ccaf7b`;


// async function getImage() {
//   const options = `key = ${key},q=${inputValue}`
  

//   const response = await axios.get(`${BASE_URL}[, ${config}]`)
//   const res = await response.json();
//   return res
//   console.log(res)
// }


// // axios.get(BASE_URL).then(response => {
// //   if (response.ok) {
// //     return response.json();
// //   }
// // });

// function searchImg(e){
//     e.preventDefault()
//     const inputValue = e.target.value
//   getImage()
// }

// // function uuu(images){
// //    const img = Object.values(images)

// // }

// // uuu()
