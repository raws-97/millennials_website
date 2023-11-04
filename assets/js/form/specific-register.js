function registerTraining() {
    const formElement = document.getElementById('register-training');
    const submitButton = document.getElementById('submit-button');
    const loadingElement = document.getElementById('loading');
  
    formElement.addEventListener('submit', async function (event) {
      event.preventDefault();
      submitButton.style.display = 'none';
      loadingElement.style.display = 'block';
  
      try {
        const formData = new FormData(formElement);
        const serializedForm = Object.fromEntries(formData);
  
        const response = await fetch(API_URL + "?target=register", {
          method: 'POST',
          body: JSON.stringify(serializedForm),
          headers: {
            'Content-type': 'text/plain;charset=utf-8'
          }
        });
  
        if (response.ok) {
          await response.json();
          notification('success', "Sukses!", "Terimakasih. Data anda sudah berhasil kami terima. Tim kami akan segera menghubungi anda.");
          formElement.reset();
          submitButton.style.display = 'block';
          loadingElement.style.display = 'none';
        } else {
          notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
          submitButton.style.display = 'block';
          loadingElement.style.display = 'none';
        }
      } catch (error) {
        console.warn(error);
        notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
        submitButton.style.display = 'block';
      }
    });
  }
  