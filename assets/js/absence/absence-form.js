function absenceForm() {
    const absenceForm = document.getElementById('absence-form');

    absenceForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        display('submit-button', 'none');
        display('loading', 'block');

        try {
            const formData = new FormData(absenceForm);
            const data = await postAbsenceFormData(formData);

            handleSuccess(data);
        } catch (error) {
            handleFailure(error);
        }
    });
}

async function postAbsenceFormData(formData) {
    const response = await fetch(API_URL + "?target=absensi", {
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

function handleSuccess() {
    notification('success', "Sukses!", "Terimakasih, absensi berhasil.");
    document.getElementById("absence-form").reset();
    display('loading', 'none');
    display('submit-button', 'block');

    const url = new URL(window.location.href);
    const link = url.searchParams.get("url");
    setTimeout(() => {
        if (link != null) {
            window.location.href = link;
        }
    }, 3000);
}

function handleFailure(error) {
    console.warn(error);
    notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
    display('submit-button', 'block');
    display('loading', 'none');
}
