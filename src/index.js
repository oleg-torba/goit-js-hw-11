import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.addEventListener('click', onLoadMore);
form.addEventListener('submit', onSearch);

class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    const apiKey = '34025093-cc2dd49ea388fe86622ccaf7b';
    const BASE_URL = 'https://pixabay.com/api/';
    const params = {
      key: `${apiKey}`,
      q: `${this.searchQuery}`,
      page: `${this.page}`,
      per_page: '40',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };

    const response = await axios.get(BASE_URL, { params });
    const res = await response.data.hits;

    this.incrementPage();

    return res;
  }

  incrementPage() {
    this.page += 1;
  }
  resetIncrementPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

const newApiService = new NewApiService();

loadMoreBtn.classList.add('is-hidden');

async function onSearch(e) {
  clearMarkup();
  e.preventDefault();
  newApiService.query = e.currentTarget.elements.searchQuery.value;
  try {
    const fetch = await newApiService.fetchArticles().then(onSuccess);
  } catch (error) {
    error = Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return error;
  }
  newApiService.resetIncrementPage();
}

async function onLoadMore() {
  try {
    const fetch = await newApiService.fetchArticles().then(onSuccess);
  } catch (error) {
    error = Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return error;
  }
}

function onSuccess(images) {
  gallery.insertAdjacentHTML('beforeend', markupImage(images));

  const lightbox = new SimpleLightbox('.gallery__item', { showCounter: false });
  lightbox.refresh();

  loadMoreBtn.classList.remove('is-hidden');

  // Перевірка на кількість зображень
  if (images.length < 40) {
    loadMoreBtn.classList.add('is-hidden');
  }
}

function markupImage(images) {
  const markup = images
    .map(
      ({ largeImageURL, webformatURL, likes, views, comments, downloads }) => {
        return `
  
    <div class="photo-card">
   <a class="gallery__item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="image" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b><span class="icon">&#10084;</span>${likes}</b>
      </p>
      <p class="info-item">
        <b><span class="icon">&#128065;</span>${views}</b>
      </p>
      <p class="info-item">
        <b><span class="icon">&#128386;</span>${comments}</b>
      </p>
      <p class="info-item">
        <b><span class="icon">&infin;</span>${downloads}</b>
      </p>
    </div>
  </div>
    `;
      }
    )
    .join('');

  return markup;
}

function clearMarkup() {
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}
