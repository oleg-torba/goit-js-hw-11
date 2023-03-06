export default class NewApiService{
    constructor(){}

  async fetchArticles(searchQuery){
    const apiKey = "34025093-cc2dd49ea388fe86622ccaf7b";
    const BASE_URL = "https://pixabay.com/api/"
    const params = {
        key: `${apiKey}`,
        q: `${searchQuery}`,
        page: 1,
        per_page:40, 
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
}