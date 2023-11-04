function registerTrainingNeeds() {
    const formElement = document.getElementById('register-training-needs');
  
    formElement.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const trainingType = document.getElementById('training_type').value;
      if (trainingType === "0") {
        notification('warning', "Oops!", "Silahkan pilih tipe training.");
      } else {
        try {
          display('submit-button', 'none');
          display('loading', 'block');
  
          const formData = new FormData(formElement);
          const serializedForm = Object.fromEntries(formData);
  
          const response = await fetch(API_URL + "?target=custom-register", {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify(serializedForm),
            headers: {
              'Content-type': 'text/plain;charset=utf-8'
            }
          });
  
          if (response.ok) {
            await response.json();
            notification('success', "Sukses!", "Terimakasih. Data anda sudah berhasil kami terima. Tim kami akan segera menghubungi anda.");
            display('submit-button', 'block');
            display('loading', 'none');
            formElement.reset();
          } else {
            notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
            display('submit-button', 'block');
          }
        } catch (error) {
          console.warn(error);
          notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
          display('submit-button', 'block');
        }
      }
    });
  }
  