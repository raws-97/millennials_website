async function getPartnersLogos() {
  try {
      const data = await fetchDataPartnerLogos();

      const imageElements = data.data.map((partner) => createPartnerImageElement(partner));
      renderPartnerImages(imageElements);

      initializePartnerSwiper(".main-partners");

      return Promise.resolve();
  } catch (error) {
      return Promise.reject(error);
  }
}

async function fetchDataPartnerLogos() {
  const url = `${API_URL}?token=${API_TOKEN}&db=partners`;
  return await httpGetPromises(url);
}

function createPartnerImageElement(partner) {
  return `<div class="swiper-slide"><img src="${partner.image}" class="img-fluid" alt="${partner.id}"></div>`;
}

function renderPartnerImages(imageElements) {
  document.getElementById('main-partners').innerHTML = imageElements.join('');
}

function initializePartnerSwiper(selector) {
  new Swiper(selector, {
      spaceBetween: 40,
      centeredSlides: false,
      slidesPerView: 'auto',
  });
}
