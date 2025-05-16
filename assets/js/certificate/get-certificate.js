async function getCertificateById() {
    try {
        const id = getCertificateIdFromURL();
        const data = await fetchDataCertificateDataByID(id);

        if (data.status != 200) {
            redirectToIndexPage();
            return;
        }

        const certUrl = "https://millennialsinstitute.com/certificate.html?id=" + data.id
        const signStatus = getSignStatusFromURL()
        generateQRCodeBase64(certUrl, function (err, base64) {
            if (err) return;
            generateAndPreviewPDF(data.name, data.training_name, data.training_date, data.location, data.serial, data.pic, data.pic_title, base64, signStatus)
        });

        

    } catch (error) {
        // handleErrors(error);
        console.error(error)
    }
}

function getCertificateIdFromURL() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    if (!id) {
        throw new Error("ID not found");
    }

    return id;
}

function getSignStatusFromURL() {
    const url = new URL(window.location.href);
    const signStatus = url.searchParams.get("sign");

    if (!signStatus) {
        return true
    }

    return false;
}

async function fetchDataCertificateDataByID(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=get-certificate&id=${id}`;
    return await httpGetPromises(url);
}

function redirectToIndexPage() {
    window.location.href = "/index.html";
}