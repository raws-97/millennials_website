async function getPriorityTrainingData() {
    const dataClassesElement = document.getElementById('training-class');
    
    try {
        const data = await fetchDataPriorityTraining();

        const headerHTML = generateHeader();
        const allTrainingLinkHTML = generateAllTrainingLink();
        const portfolioItemsHTML = generatePortfolioItems(data);

        const finalHTML = headerHTML + allTrainingLinkHTML + portfolioItemsHTML;
        dataClassesElement.innerHTML = finalHTML;

    } catch (error) {
        handleErrors(error);
    }
}

async function fetchDataPriorityTraining() {
    const url = `${API_URL}?token=${API_TOKEN}&db=pelatihan&priority=true`;
    return await httpGetPromises(url);
}

function generateHeader() {
    return `
        <header class="section-header">
            <p>Pelatihan Prioritas</p>
        </header>
    `;
}

function generateAllTrainingLink() {
    return `
        <div class="col-lg-12 d-flex justify-content-center">
            <a href="/all-training.html" style="background-color: #ac812d; color: white; margin-bottom: 20px;" class="btn">Lihat Semua Pelatihan <i class="fa-solid fa-arrow-right"></i></a>
        </div>
    `;
}

function generatePortfolioItems(data) {
    const portfolioItems = data.data.map(r => {
        const imgSrc = r.media_2 || r.media_1;
        return `
            <div class="col-lg-4 col-md-6 portfolio-item filter-${r.category}">
                <div class="portfolio-wrap">
                    <img src="${imgSrc}" class="img-fluid" alt="">
                    <div class="portfolio-info" style="cursor: pointer;" onclick="window.location='training-class.html?id=${r.id}';">
                        <h4>${r.name}</h4>
                        <p>${dateFormatter(r.created_at)}</p>
                        <p>${r.category}</p>
                        <div class="portfolio-links">
                            <a href="training-class.html?id=${r.id}" title="Learn More"><i class="bi bi-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    return `<div id="data-classes" class="row gy-4 portfolio-container">${portfolioItems.join('')}</div>`;
}