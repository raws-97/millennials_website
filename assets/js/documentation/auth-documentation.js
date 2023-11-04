function authDocumentation() {
  const authForm = document.getElementById('auth');

  authForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const submitButton = document.getElementById('submit-button');
      const loading = document.getElementById('loading');

      submitButton.style.display = 'none';
      loading.style.display = 'block';

      const formData = new FormData(authForm);
      const serializedData = Object.fromEntries(formData);

      try {
          const response = await fetch(`${API_URL}?target=auth-documentation`, {
              method: 'POST',
              body: JSON.stringify(serializedData),
              headers: {
                  'Content-type': 'text/plain;charset=utf-8',
              },
          });

          if (response.ok) {
              const data = await response.json();

              if (data.status === 200) {
                  let content = `<div class="col-lg-12 d-flex justify-content-center">
                      <a target="_blank" href="${data.url_documentation}" style="background-color: #ac812d; color: white; margin-top: 20px;" class="btn">Dokumentasi Pelatihan Lain<i class="fa-solid fa-arrow-right"></i></a>
                  </div> <br>`;

                  data.link.forEach((r) => {
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
                      <br>`;
                  });

                  setValueToElement('content', content);
                  display('authSection', 'none');
                  display('portfolio-details', 'block');
              } else {
                  notification('error', "Oops!", "Oopss.. Password salah! Silahkan coba lagi.");
                  submitButton.style.display = 'block';
                  loading.style.display = 'none';
              }
          } else {
              notification('error', "Oops!", "Oops terjadi kesalahan. Silahkan coba lagi.");
              console.warn(response);
              submitButton.style.display = 'block';
              loading.style.display = 'none';
          }
      } catch (error) {
          console.error(error);
          notification('error', "Oops!", "Oops terjadi kesalahan. Silahkan coba lagi.");
          submitButton.style.display = 'block';
          loading.style.display = 'none';
      }
  });
}
