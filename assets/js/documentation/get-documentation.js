async function getTrainingDocumentation() {
    const passwordField = document.getElementById("password")
    const submitButton = document.getElementById('submit-button')
    try {
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");

        if (!id) {
            return Promise.reject("ID not found");
        }

        const data = await fetchDataTrainingById(id);

        if (data.data.length === 0) {
            window.location.href = "/index.html";
            return;
        }

        const r = data.data[0];

        setValueToElement('t-name', r.name);
        setValueToElement('t-name-3', r.name);
        setValueToElement('t-category', r.category);
        setValueToElement('t-price', currencyFormatter(r.price) + ' / Peserta');
        setValueToElement('t-created', dateFormatter(r.created_at));

        document.getElementById('training-id').value = id;
        passwordField.disabled = false
        submitButton.disabled = false
        display('submit-button', 'block')
        display('loading', 'none')
    } catch (error) {
        console.error(error);
    }
}

async function fetchDataTrainingById(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`;
    return await httpGetPromises(url);
}
