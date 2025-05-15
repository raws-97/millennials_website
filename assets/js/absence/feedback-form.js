function feedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');

    feedbackForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        display('submit-button', 'none');
        display('loading', 'block');

        try {
            const formData = new FormData(feedbackForm);
            const data = await postFeedbackData(formData);

            handleSuccess(data);
        } catch (error) {
            handleFailure(error);
        }
    });
}

async function postFeedbackData(formData) {
    const response = await fetch(API_URL + "?target=feedback", {
        method: 'POST',
        body: JSON.stringify(serializeFormData(formData)),
        headers: {
            'Content-type': 'text/plain;charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

function serializeFormData(formData) {
    const obj = {};
    for (const key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
}

function handleSuccess(data) {
    notification('success', "Sukses!", "Terimakasih, atas penilaian anda.");
    document.getElementById("feedback-form").reset();
    display('submit-button', 'block');
    display('loading', 'none');
    console.log(data)
    // setTimeout(() => {
    //     window.location.href = "/index.html";
    // }, 3000);
}

function handleFailure(error) {
    console.warn(error);
    notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
    display('loading', 'none');
    display('submit-button', 'block');
}

function setValueFeedbackForm(target, value){
    document.getElementById(target).value = value
  }