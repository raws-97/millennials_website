const API_TOKEN = "asd"
const API_URL = "https://script.google.com/macros/s/AKfycbz9d4pdPaTlp3fkQjPIiOZ2Rimr69lg7wzPz85_9cZ3ASI6BF8M6PPKZLRccXrZ76t9/exec"

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText)
}

function setValueToElement(id, val){
    document.getElementById(id).innerHTML = val
}

function currencyFormatter(input){
    const formatter = new Intl.NumberFormat('id-ID', 
    { style: 'currency', 
    currency: 'IDR' })
    .format(input).replace(/\D00$/, '')

    return formatter
 }

 function dateFormatter(input){
    const formatter = new Date(input)
 }

function getPriorityTrainingData(){
    var data = httpGet(`${API_URL}?token=${API_TOKEN}&priority=true`)
    data.data.forEach(r=>{
      var res = `<div class="col-lg-4 col-md-6 portfolio-item filter-${r.category}">
                <div class="portfolio-wrap">
                  <img src="${r.media_1}" class="img-fluid" alt="">
                  <div class="portfolio-info">
                    <h4>${r.name}</h4>
                    <p>${r.category}</p>
                    <div class="portfolio-links">
                      <a href="${r.media_2}" data-gallery="portfolioGallery" class="portfokio-lightbox" title="${r.name}"><i class="bi bi-plus"></i></a>
                      <a href="portfolio-details.html?id=${r.id}" title="More Details"><i class="bi bi-link"></i></a>
                    </div>
                  </div>
                </div>
              </div>`
      
      document.getElementById('data-classes').innerHTML += res;
    })
}

function getTrainingDataByID(){
    var url = new URL(window.location.href)
    var id = url.searchParams.get("id");
    var data = httpGet(`${API_URL}?token=${API_TOKEN}&id=${id}`)

    data.data.forEach(r=>{
        var res = `<div class="swiper-slide">
                        <img src="${r.media_1}" alt="">
                    </div>
                    <div class="swiper-slide">
                        <img src="${r.media_2}" alt="">
                    </div>`
        document.getElementById('image-slider').innerHTML += res;
        setValueToElement('t-name', r.name)
        setValueToElement('t-name-2', r.name)
        setValueToElement('t-category', r.category)
        setValueToElement('t-price', currencyFormatter(r.price))
        setValueToElement('t-created', r.created_at)
        setValueToElement('t-description', r.description)
    })
}