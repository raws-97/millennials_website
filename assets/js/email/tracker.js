async function emailTracker() {
    const url = new URL(window.location.href);
    const targetUrl = url.searchParams.get("targetUrl");

    if(targetUrl != null){
        try {
            const id = url.searchParams.get("id");
            const trainingId = url.searchParams.get("trainingId");
            const orderId = url.searchParams.get("orderId");
    
            const data = await postEmailTrackerData(id, trainingId, orderId, targetUrl);
    
            handleSuccess(data, targetUrl);
        } catch (error) {
            handleFailure(error);
        }
    } else {
        window.location.href = "/index.html"
    }
}

async function postEmailTrackerData(id, trainingId, orderId, targetUrl) {
    const response = await fetch(API_URL + "?target=email-tracker", {
        method: 'POST',
        body: JSON.stringify({
            id: id,
            training_id: trainingId,
            order_id: orderId,
            target_url: targetUrl
        }),
        headers: {
            'Content-type': 'text/plain;charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

function handleSuccess(data, targetUrl) {
    if(data.status === 200){
        window.location.href = targetUrl;
    }
}

function handleFailure(error) {
    console.warn(error);
    notification('error', "Oops!", "Terjadi kesalahan, silahkan coba lagi.");
}
