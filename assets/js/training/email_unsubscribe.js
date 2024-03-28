async function emailUnsubscribe() {
    const url = new URL(window.location.href);
    const emailId = url.searchParams.get("emailId");

    try {
        const data = await fetchDataEmailData(emailId);

        if (!emailId) {
            return redirectToPage("/index.html");
        }

    } catch (error) {
        handleErrors(error);
    }
}

async function fetchDataEmailData(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=email_unsubscribe&id=${id}`;
    return await httpGetPromises(url);
}
