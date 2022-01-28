const API_TOKEN = "asd"
const API_URL = "https://script.google.com/macros/s/AKfycbwFivaCGkG8hqREjwjK9d1nhgVD5V6ZYsDi-jaxpjKYjEuweTbllovlfz6z9YYgoJzi/exec"

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText)
}

function setValueToElement(id, val){
    document.getElementById(id).innerHTML = val
}

function display(id, val){
    document.getElementById(id).style.display = val;

}

function currencyFormatter(input){
    const formatter = new Intl.NumberFormat('id-ID', 
    { style: 'currency', 
    currency: 'IDR' })
    .format(input).replace(/\D00$/, '')

    return formatter
 }

 function dateFormatter(input){
    const newDate = new Date(input)
    const listOfMonth = ["Januari","Februari","Maret","April","May","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const listOfDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    var year = newDate.getFullYear()
    var month = listOfMonth[newDate.getMonth()];
    var date = newDate.getDate()
    var day = listOfDay[newDate.getDay()];

    var formatter = `${day}, ${date} ${month} ${year}`
    return formatter
 }

function notification(status, header, msg){
    Swal.fire(
        header,
        msg,
        status
      )
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
                      <a href="portfolio-details.html?id=${r.id}" title="More Details"><i class="bi bi-link"></i></a>
                    </div>
                  </div>
                </div>
              </div>`
      
      document.getElementById('data-classes').innerHTML += res;
    })
}

function getParamsFromURL(url, params){
    var url = new URL(url)
    var result = url.searchParams.get(params);
    return result
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
        setValueToElement('t-name-3', r.name)
        setValueToElement('t-category', r.category)
        setValueToElement('t-price', currencyFormatter(r.price))
        setValueToElement('t-created', dateFormatter(r.created_at))
        setValueToElement('t-description', r.description)
        document.getElementById('training-id').value = id
        document.getElementById('training-name').value = r.name
    })
}

document.getElementById('register-training').addEventListener('submit', function (event) {

	event.preventDefault();
    display('submit-button', 'none')
    
    var serializeForm = function (form) {
        var obj = {};
        var formData = new FormData(form);
        for (var key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    };

	fetch(API_URL+"?target=register", {
		method: 'POST',
		body: JSON.stringify(serializeForm(event.target)),
		headers: {
			'Content-type': 'text/plain;charset=utf-8'
		}
	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		return Promise.reject(response);
	}).then(function (data) {
		notification('success', "Sukses!", "Terimakasih. Data anda sudah berhasil kami terima. Tim kami akan segera menghubungi anda.")
        document.getElementById("register-training").reset();
        display('submit-button', 'block')
        setTimeout(function(){
            location.reload()
        }, 3000);
	}).catch(function (error) {
		console.warn(error);
		notification('danger', "Oops!", "Terjadi kesalahan, silahkan coba lagi.")
        display('submit-button', 'block')
	});
});
