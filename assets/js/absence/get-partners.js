async function getPartners() {
    const id = getParameterFromURL("id");
    if (!id) return redirectToIndexPage();

    const companies = await fetchCompaniesById(id);
    updateCompanyDropdown(companies);

    $('#company').select2();
}

function getParameterFromURL(paramName) {
    return new URL(window.location.href).searchParams.get(paramName);
}

function redirectToIndexPage() {
    window.location.href = "/index.html";
}

async function fetchCompaniesById(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=get-company&id=${id}`;
    return (await httpGetPromises(url)).data;
}

function updateCompanyDropdown(companies) {
    const companyDropdown = document.getElementById('company');
    const postTest = parseInt(getParameterFromURL("post"));
    companies.forEach(company => {
        const option = document.createElement('option');
        option.textContent = company.company;

        if(postTest < 1){
            option.value = company.pre_test_url
        } else {
            option.value = company.post_test_url
        }
        companyDropdown.appendChild(option);
    });
}
