function getTrainingDataByID() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    if (!id) {
        window.location.href = "/index.html";
        return;
    }

    fetchDataAndDisplayFeedback(id);
}

async function fetchDataAndDisplayFeedback(id) {
    try {
        const data = await fetchDataById(id);

        if (data.data.length === 0) {
            window.location.href = "/index.html";
            return;
        }

        const training = data.data[0];
        setValueToElement('t-name', training.name);
        display("submit-button", "block")
        display("loading", "none")
        document.getElementById('training-id').value = id;
    } catch (error) {
        console.error(error);
    }
}

async function fetchDataById(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`;
    return await httpGetPromises(url);
}
