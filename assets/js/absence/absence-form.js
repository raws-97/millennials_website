function absenceForm() {
    const absenceForm = document.getElementById('absence-form');

    absenceForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        display('submit-button', 'none');
        display('loading', 'block');

        try {
            const email = document.getElementById('email').value
            const fullName = document.getElementById('full_name').value
            const phoneNumber = document.getElementById('phone_number').value
            const companySelect = document.getElementById('company')
            const company = companySelect.options[companySelect.selectedIndex].text
            const urlTest = document.getElementById('company').value

            const data = await postAbsenceFormData(email, fullName, phoneNumber, company);

            handleSuccess(data, email, fullName, urlTest);
        } catch (error) {
            handleFailure(error);
        }
    });
}

async function postAbsenceFormData(email, fullName, phoneNumber, company) {
    const response = await fetch(API_URL + "?target=absensi", {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            full_name: fullName,
            training_id: new URL(window.location.href).searchParams.get("id"),
            phone: phoneNumber,
            company: company
        }),
        headers: {
            'Content-type': 'text/plain;charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

function handleSuccess(data, email, fullName, urlTest) {
    notification('success', "Sukses!", "Terimakasih, absensi berhasil.");
    
    display('loading', 'none');
    display('submit-button', 'block');

    document.getElementById("absence-form").reset();
    const fixedLink = urlTest.replace("REPLACE_NAME", fullName).replace("REPLACE_EMAIL", email)
    setTimeout(() => {
        if (urlTest != null) {
            window.location.href = fixedLink;
        } else {
            window.location.href = window.location.href;
        }
    }, 3000);

}

function handleFailure(error) {
    console.warn(error);
    notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
    display('submit-button', 'block');
    display('loading', 'none');
}
