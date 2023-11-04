async function getSliderImage() {
    try {
        const data = await fetchData();
        const imageElements = createImageElements(data);
        renderSliderImages(imageElements);
        initializeSwiperSliderImage(".main-slider");
    } catch (error) {
        console.error(error);
    }
}

async function fetchData() {
    const url = `${API_URL}?token=${API_TOKEN}&db=slider_image`;
    return await httpGetPromises(url);
}

function createImageElements(data) {
    return data.data.map((imageData) => createSliderImageElement(imageData));
}

function createSliderImageElement(imageData) {
    return `<div class="swiper-slide"><img src="${imageData.image}" alt="${imageData.id}"></div>`;
}

function renderSliderImages(imageElements) {
    document.getElementById('main-slider').innerHTML = imageElements.join('');
}

function initializeSwiperSliderImage(selector) {
    new Swiper(selector, {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
