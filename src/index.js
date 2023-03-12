import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.classList.add('is-hidden');
form.addEventListener('submit', onSearch);

const lightbox = new SimpleLightbox('.gallery__item', { showCounter: false });

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

    const request = await axios.get(BASE_URL, { params });
    const response = await request.data;

    return response;
  }

  incrementPage() {
    this.page += 1;
    console.log(this.page);
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

async function onSearch(e) {
  clearMarkup();
  e.preventDefault();

  newApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (newApiService.searchQuery === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return clearMarkup();
  }
  newApiService.resetIncrementPage();
  const searchRequest = await onSearchRequest();
  return searchRequest;
}

async function onLoadMore() {
  const loadMoreRequest = await onLoadMoreRequest();
  return loadMoreRequest;
}

function onSuccess(images) {
  gallery.insertAdjacentHTML('beforeend', markupImage(images));
  lightbox.refresh();

  loadMoreBtn.classList.remove('is-hidden');
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
    <img src="${webformatURL}" alt="image" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b><span class="icon">&#10084;</span>${likes}</b>
      </p>
      <p class="info-item">
        <b><span class="icon">&#128065;</span>${views}</b>
      </p>
      <p class="info-item">
        <b><span class="icon">	
        &#128488;</span>${comments}</b>
      </p>
      <p class="info-item">
        <b><span class="icon">&#8595;</span>${downloads}</b>
      </p>
    </div>
  </div></a>
    `;
      }
    )
    .join('');

  return markup;
}

async function onSearchRequest() {
  try {
    const fetch = await newApiService.fetchArticles();
    const totalHits = await fetch.totalHits;
    onSuccess(fetch.hits);
    newApiService.incrementPage();

    if (totalHits) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } else if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreRequest() {
  newApiService.incrementPage();
  try {
    const fetch = await newApiService.fetchArticles();
    const totalHits = await fetch.totalHits;
    const numberOfPages = Math.ceil(totalHits / 40);
    if (numberOfPages < newApiService.page) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('is-hidden');
    }
    onSuccess(fetch.hits);
  } catch (error) {
    console.log(error);
  }
}

function clearMarkup() {
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}
