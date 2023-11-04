async function getTrainingDataByID() {
    try {
        const id = getTrainingIdFromURL();
        const data = await fetchDataTrainingDataByID(id);

        if (data.data.length === 0) {
            redirectToIndexPage();
            return;
        }

        const training = data.data[0];

        updateTrainingStatus(training.created_at);
        updateDocumentation(training.created_at, id);
        updateImageSlider(training.media_1, training.media_2);
        updateTrainingInfo(training);

    } catch (error) {
        handleErrors(error);
    }
}

function getTrainingIdFromURL() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    if (!id) {
        throw new Error("ID not found");
    }

    return id;
}

async function fetchDataTrainingDataByID(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`;
    return await httpGetPromises(url);
}

function redirectToIndexPage() {
    window.location.href = "/index.html";
}

function updateTrainingStatus(created_at) {
    const statusElement = document.getElementById('t-status');
    const isNewTraining = new Date(created_at) > new Date().addDays(-1);
    statusElement.textContent = isNewTraining ? 'Tersedia' : 'Sudah Berjalan';
    statusElement.classList.add(isNewTraining ? 'bg-success' : 'bg-warning', 'text-dark');
}

function updateDocumentation(created_at, id) {
    const documentationElement = document.getElementById('documentation');
    if (new Date(created_at) <= new Date().addDays(-1)) {
        const content = `
            <div class="col-lg-12 d-flex justify-content-center">
                <a target="_top" href="/documentation.html?id=${id}" style="background-color: #ac812d; color: white; margin-top: 20px;" class="btn">Dokumentasi Pelatihan<i class="fa-solid fa-arrow-right"></i></a>
            </div> <br>`;
        documentationElement.innerHTML = content;
    } else {
        documentationElement.innerHTML = '';
    }
    display('contact', new Date(created_at) <= new Date().addDays(-1) ? 'none' : 'block');
}

function updateImageSlider(media1, media2) {
    const imgSrc = media2 || media1;
    const imageSliderElement = document.getElementById('image-slider');
    const res = `<div class="swiper-slide">
        <img src="${imgSrc}" alt="">
    </div>`;
    imageSliderElement.innerHTML = res;
}

function updateTrainingInfo(training) {
    setValueToElement('t-name', training.name);
    setValueToElement('t-name-2', training.name);
    setValueToElement('t-name-3', training.name);
    setValueToElement('t-category', training.category.toUpperCase());
    setValueToElement('t-price', currencyFormatter(training.price));
    setValueToElement('t-created', dateFormatter(training.created_at));
    setValueToElement('contact-number', training.contact_number);
    setValueToElement('t-description', training.description);

    const trainingIdElement = document.getElementById('training-id');
    const trainingNameElement = document.getElementById('training-name');
    trainingIdElement.value = training.id;
    trainingNameElement.value = training.name;
}