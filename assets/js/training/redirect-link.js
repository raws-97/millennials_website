async function roomsRedirect() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    try {
        const data = await fetchDataForRoom(id);

        if (!id) {
            return redirectToPage("/index.html");
        }

        if (data.data.length === 0) {
            redirectToPage("/index.html");
        } else {
            const roomData = data.data[0];

            if (isRoomWithinLastDay(roomData.created_at)) {
                setTimeout(() => redirectToPage(roomData.zoom_link), 1500);
            } else {
                display('success', 'none');
                display('failed', 'block');
            }
        }
    } catch (error) {
        handleErrors(error);
    }
}

async function fetchDataForRoom(id) {
    const url = `${API_URL}?token=${API_TOKEN}&db=pelatihan&id=${id}`;
    return await httpGetPromises(url);
}

function isRoomWithinLastDay(created_at) {
    const roomCreatedAt = new Date(created_at);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return roomCreatedAt > yesterday;
}

function redirectToPage(page) {
    window.location.href = page;
}
