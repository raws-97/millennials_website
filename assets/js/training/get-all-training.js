async function getAllTrainingData() {
    try {
        const data = await fetchDataAllTraining();
        const sortedData = sortTrainingData(data.data);

        const dataClassesElement = document.getElementById('training-class');
        const pastTrainingElement = document.getElementById('past-training');
        const headerHTML = generateHeader();
        const portfolioItems = [];

        sortedData.forEach((training) => {
            const imgSrc = training.media_2 || training.media_1;
            const trainingDate = new Date(training.created_at);

            if (trainingDate > new Date()) {
                const res = createPortfolioItem(training, imgSrc);
                portfolioItems.push(res);
            } else {
                const res = createPastTrainingSlide(training, imgSrc);
                pastTrainingElement.innerHTML += res;
            }
        });

        const allTrainingHTML = generateAllTrainingHTML(portfolioItems);
        const finalHTML = headerHTML + allTrainingHTML;
        dataClassesElement.innerHTML = finalHTML;
    } catch (error) {
        console.error(error);
    }
}

async function fetchDataAllTraining() {
    const url = `${API_URL}?token=${API_TOKEN}&db=pelatihan`;
    return await httpGetPromises(url);
}

function generateHeader() {
    return `
        <header class="section-header">
            <p>Pelatihan Tersedia</p>
        </header>
    `;
}

function sortTrainingData(data) {
    return data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).reverse();
}

function createPortfolioItem(training, imgSrc) {
    return `
        <div class="col-lg-4 col-md-6 portfolio-item filter-${training.category}">
            <div class="portfolio-wrap">
                <img src="${imgSrc}" class="img-fluid" alt="">
                <div class="portfolio-info">
                    <h4>${training.name}</h4>
                    <p>${training.category}</p>
                    <div class="portfolio-links">
                        <a href="training-class.html?id=${training.id}" title="Learn More"><i class="bi bi-link"></i></a>
                    </div>
                </div>
            </div>
        </div>`;
}

function createPastTrainingSlide(training, imgSrc) {
    return `
        <div class="swiper-slide">
            <a href="training-class.html?id=${training.id}">
                <img src="${imgSrc}" class="img-fluid" alt="">
            </a>
        </div>`;
}

function generateAllTrainingHTML(portfolioItems) {
    return `<div id="data-classes" class="row gy-4 portfolio-container">${portfolioItems.join('')}</div>`;
}
