export default class Widget {
    constructor(container, url) {
      this.container = container;
      this.url = url;
    }

    async init() {
        this.registerServiceWorker();
        await this.newsRendering();
      }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js', { scope: './' })
              .then((req) => {
                console.log('Registration succeeded. Scope is ' + req.scope);
              }).catch((error) => {
                console.log('Registration failed with error: ' + error);
              });
            }
    }

    async getNews() {
      let response;
      
      response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },);

      return await response.json();
    }

    async newsRendering() {
      let news;
      let loadingPlug = this.container.querySelector('.loading-plug');
      let offlineBanner = this.container.querySelector('.offline-banner');
      
      try {
        news = await this.getNews();
      
      for(let el of news) {
        this.renderNews(el)
      }

      loadingPlug.classList.add('unactive');
      } catch (error) {
        console.log(error);
        offlineBanner.classList.remove('unactive');
      }
    }

    renderNews(news) {
      const newsCell = document.createElement('div');
      this.widgetBody = this.container.querySelector('.widget-body');
      newsCell.classList.add('news-cell');
      newsCell.id = news.id;
      
      newsCell.innerHTML = `
      <span class="news-header">${news.heading}</span>
      <div class="news-body">
        <img src="${news.image}" class="news-image">
        <span class="news-text">${news.body}</span>
      </div>
      `;

      this.widgetBody.append(newsCell);
    }
  
      
}