const API_TOKEN = "QLwUYs79xU9yp4c2WTRWAa9xuMVWXgJq"
const API_URL = "https://script.google.com/macros/s/AKfycbzyzIxQG0JsvZk3F6OI8eu9dbLQFTiYiygV-nBx1jlkOOnrga7dDSJi4zolWAGMU5Yo/exec"
const API_URL_WIFI = "https://script.google.com/macros/s/AKfycbzNmf-kCkQSdHZUG5jCs0B1BQCU57X6DAG7r-UAGm-w58r7eeAaKOCoAk1RqcfakCWN/exec"
var footerYear = new Date().getFullYear()

document.getElementById('footer-year').innerHTML = footerYear

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText)
}

function proper(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
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

 Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
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

function indexSlider(){
    var swiper = new Swiper(".main-slider", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

}

function getSliderImage(){
    var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=slider_image`)
    data.data.forEach(r=>{
      var res = `<div class="swiper-slide"><img src="${r.image}" alt="${r.id}"></div>`
      
      document.getElementById('main-slider').innerHTML += res;
    })

    var swiper = new Swiper(".main-slider", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
}

function getAllTrainingData(){
  var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=pelatihan`)

  function custom_sort(a, b) {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  }

  data.data.sort(custom_sort);
  data.data.reverse()

  data.data.forEach(r=>{
    var training_date = new Date(r.created_at)
    if(training_date > new Date()){
      var res = `<div class="col-lg-4 col-md-6 portfolio-item filter-${r.category}">
              <div class="portfolio-wrap">
                <img src="${r.media_1}" class="img-fluid" alt="">
                <div class="portfolio-info">
                  <h4>${r.name}</h4>
                  <p>${r.category}</p>
                  <div class="portfolio-links">
                    <a href="training-class.html?id=${r.id}" title="Learn More"><i class="bi bi-link"></i></a>
                  </div>
                </div>
              </div>
            </div>`
    
    document.getElementById('data-classes').innerHTML += res;
    } else {
      var res = `<div class="swiper-slide"><a href="training-class.html?id=${r.id}"><img src="${r.media_1}" class="img-fluid" alt=""></a></div>`
      document.getElementById('past-training').innerHTML += res;
    }
    
  })
}

function getPriorityTrainingData(){
    var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=pelatihan&priority=true`)
    data.data.forEach(r=>{
      var res = `<div class="col-lg-4 col-md-6 portfolio-item filter-${r.category}">
                <div class="portfolio-wrap">
                  <img src="${r.media_1}" class="img-fluid" alt="">
                  <div class="portfolio-info" style="cursor: pointer;" onclick="window.location='training-class.html?id=${r.id}';">
                    <h4>${r.name}</h4>
                    <p>${dateFormatter(r.created_at)}</p>
                    <p>${r.category}</p>
                    <div class="portfolio-links">
                      <a href="training-class.html?id=${r.id}" title="Learn More"><i class="bi bi-link"></i></a>
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
    if(!id){
        return window.location.href = "/index.html";
    }
    var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`)
    if(data.data.length == 0){
      window.location.href = "/index.html"
    } else {
    data.data.forEach(r=>{

      if(new Date(r.created_at) > new Date().addDays(-1)){
        setValueToElement('t-status', 'Tersedia')
        document.getElementById('t-status').classList.add("bg-success")
      } else {
        var content = `<div class="col-lg-12 d-flex justify-content-center">
                <a target="_top" href="/documentation.html?id=${id}" style="background-color: #ac812d; color: white; margin-top: 20px;" class="btn">Dokumentasi Pelatihan<i class="fa-solid fa-arrow-right"></i></a>
              </div> <br>`

        display('contact', 'none')
        setValueToElement('t-status', 'Sudah Berjalan')
        document.getElementById('t-status').classList.add("bg-warning")
        document.getElementById('t-status').classList.add("text-dark")
        setValueToElement('documentation', content)


      }
        var res = `<div class="swiper-slide">
                        <img src="${r.media_1}" alt="">
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
}

function getTrainingDataByIDForFeedback(){
  var url = new URL(window.location.href)
  var id = url.searchParams.get("id");
  if(!id){
      return window.location.href = "/index.html";
  }
  var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`)
  if(data.data.length == 0){
    window.location.href = "/index.html"
  } else {
  data.data.forEach(r=>{
      setValueToElement('t-name', r.name)
      document.getElementById('training-id').value = id
  })
}
}


function registerTraining(){
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
      notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.")
          display('submit-button', 'block')
    });
  });
  
}


function registerTrainingNeeds(){
document.getElementById('register-training-needs').addEventListener('submit', function (event) {

	event.preventDefault();
  
  if(document.getElementById('training_type').value == "0"){
    notification('warning', "Oops!", "Silahkan pilih tipe training.")
  }else {
    display('submit-button', 'none')
    
    var serializeForm = function (form) {
        var obj = {};
        var formData = new FormData(form);
        for (var key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    };

    fetch(API_URL+"?target=custom-register", {
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
          display('submit-button', 'block')
          setTimeout(function(){
              location.reload()
          }, 3000);
    }).catch(function (error) {
      console.warn(error);
      notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.")
          display('submit-button', 'block')
    });
  }
});
}

function setValueFeedbackForm(target, value){
  document.getElementById(target).value = value
}

function feedbackForm(){
  document.getElementById('feedback-form').addEventListener('submit', function (event) {

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
  
    fetch(API_URL+"?target=feedback", {
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
      notification('success', "Sukses!", "Terimakasih, atas penilaian anda.")
          document.getElementById("feedback-form").reset();
          display('submit-button', 'block')
          setTimeout(function(){
            window.location.href = "/index.html"
          }, 3000);
    }).catch(function (error) {
      console.warn(error);
      notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.")
          display('submit-button', 'block')
    });
  });
  
}

function absenceForm(){
  document.getElementById('absence-form').addEventListener('submit', function (event) {

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
  
    fetch(API_URL+"?target=absensi", {
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
      notification('success', "Sukses!", "Terimakasih, absensi berhasil.")
          document.getElementById("absence-form").reset();
          display('submit-button', 'block')
          setTimeout(function(){
            window.location.href = "/index.html"
          }, 3000);
    }).catch(function (error) {
      console.warn(error);
      notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.")
          display('submit-button', 'block')
    });
  });
  
}

function sendVerificationCode(){
  document.getElementById('get-verification').addEventListener('click', function (event) {
    display('get-verification', 'none')
    var email = document.getElementById('email').value
    var payload = {
      "email": email
    }
    fetch(API_URL+"?target=send-verif-email", {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'text/plain;charset=utf-8'
      }
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      if(data.status == 201){
        setValueToElement('get-verification', 'Verified ✔')
        document.getElementById("email").readOnly = true;
        document.getElementById("get-verification").disabled = true;
        document.getElementById("get-verification").style.background = "#6eff7a"
        document.getElementById("get-verification").style.color = "black"
        document.getElementById("get-verification").style.borderColor = "#6eff7a"

        var r_readOnly = document.getElementsByClassName('r-read-only')

        for(var i=0; i<r_readOnly.length; i++){
          r_readOnly[i].readOnly = false;
        }
       
        display('get-verification', 'block')
        display('submit-button', "block")
        notification('success', "Sukses!", "Email anda sudah terverifikasi.")
        
      } else if(data.status == 200){
        setValueToElement('get-verification', 'Check Status')
        display('get-verification', 'block')
        display('submit-button', "block")
        notification('success', "Sukses!", "Silahkan cek email Anda untuk verifikasi.")
        
      }

      
    })
  })
}

function emailVerificationPage(){
  var url = new URL(window.location.href)
  var id = url.searchParams.get("hash");

  var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=verif-email&id=${id}`)

  if(data.status == 200){
    display('success', 'block')
  } else {
    display('failed', 'block')
  }

  setTimeout(function(){
    window.location.href = "/index.html"
  }, 3000);

}


function roomsRedirect(){
  var url = new URL(window.location.href)
  var id = url.searchParams.get("id");

  var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`)
  if(data.data.length == 0){
    window.location.href = "/index.html"
  } else {
  data.data.forEach(r=>{
    setValueToElement('t-name', r.name)

    if(new Date(r.created_at) > new Date().addDays(-1)){
      setTimeout(function(){
        window.location.href = r.zoom_link
      }, 1500);
      
    } else {
      display('success', 'none')
      display('failed', 'block')
    }
  })
}
}

function getCompanyForAbsence(){
  var url = new URL(window.location.href)
  var id = url.searchParams.get("id");
  if(!id){
      return window.location.href = "/index.html";
  }
  var res = document.getElementById('company').innerHTML
  var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=get-company&id=${id}`)

  data.data.forEach(r => {
    res += `<option>${r.company}</option>`
  })
  setValueToElement('company', res)
}


function registerWifi(){
  document.getElementById('register-wifi-form').addEventListener('submit', function(event){
    event.preventDefault();
    display('submit-button', 'none')
    display('loading', 'block')
      
    var serializeForm = function (form) {
        var obj = {};
        var formData = new FormData(form);
        for (var key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    };

    fetch(API_URL_WIFI+"?route=createPayment", {
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
      console.log(data)
      notification('success', "Sukses!", "Terimakasih. Kami sudah mengirimkan pesan Whatsapp pada nomor yang tertera.")
          document.getElementById("register-wifi-form").reset();
          display('submit-button', 'block')
          display('loading', 'none')
          // setTimeout(function(){
          //     location.reload()
          // }, 3000);
    }).catch(function (error) {
      console.warn(error);
      notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.")
          display('submit-button', 'block')
          display('loading', 'none')
    });
  })
}

function paymentMethodWifi(){
  fetch(API_URL_WIFI+"?route=payment_methods").then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    document.getElementById('payment_method').addEventListener('change', function(event){
      display('payment-avail', 'block')
      const value = data.filter(function(item){
        return item.payment_method == event.target.value;         
      })[0]

      var imageHTML = ''
      value.payment.forEach(img =>{
        imageHTML += `<div class="swiper-slide"><img src="assets/img/payment_methods/${img}.png" class="img-fluid" alt=""></div>`
      })
      
      document.getElementById('payment_type').innerHTML = proper(value.payment_method.replace("-", " "))
      document.getElementById('price').innerHTML = currencyFormatter(value.price)
      document.getElementById('fee').innerHTML = currencyFormatter(value.fee)
      document.getElementById('total').innerHTML = currencyFormatter(value.price + value.fee)
      document.getElementById('payment_slider').innerHTML = imageHTML
      
      
      
    })
  })

  
}

function authDocumentation(){
  document.getElementById('auth').addEventListener('submit', function (event) {

    event.preventDefault();
    display('submit-button', 'none')
    display('loading', 'block')
      
    var serializeForm = function (form) {
        var obj = {};
        var formData = new FormData(form);
        for (var key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    };
  
    fetch(API_URL+"?target=auth-documentation", {
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
      if(data.status == 200){
        var content = `<div class="col-lg-12 d-flex justify-content-center">
                <a target="_blank" href="${data.url_documentation}" style="background-color: #ac812d; color: white; margin-top: 20px;" class="btn">Dokumentasi Pelatihan Lain<i class="fa-solid fa-arrow-right"></i></a>
              </div> <br>`

        data.link.forEach(r => {
          content += `<div class="row gy-4">
                        <center>
                        <div class="col-lg-8">
                          <iframe width="100%" height="600px" 
                          src="https://youtube.com/embed/${r}?modestbranding=1&controls=1&amp;" 
                          frameborder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe>
                        </div> 
                      </center>
                      </div>
                      <br>`
        })

        setValueToElement('content', content)
        display('authSection', 'none')
        display('portfolio-details', 'block')
        
      }else{
        notification('error', "Oops!", "Oopss.. Password salah! Silahkan coba lagi.")
        display('submit-button', 'block')
        display('loading', 'none')
      }
    }).catch(function (error) {
      console.warn(error);
      notification('error', "Oops!", "Oops terjadi kesalahan. Silahkan coba lagi.")
      display('submit-button', 'block')
      display('loading', 'none')
    });
  });
  
}

function getTrainingDataByIDDocumentation(){
  var url = new URL(window.location.href)
  var id = url.searchParams.get("id");
  if(!id){
      return window.location.href = "/index.html";
  }
  var data = httpGet(`${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`)
  if(data.data.length == 0){
    window.location.href = "/index.html"
  } else {
  data.data.forEach(r=>{
      setValueToElement('t-name', r.name)
      setValueToElement('t-name-3', r.name)
      setValueToElement('t-category', r.category)
      setValueToElement('t-price', currencyFormatter(r.price))
      setValueToElement('t-created', dateFormatter(r.created_at))
      document.getElementById('training-id').value = id
  })
}
}
