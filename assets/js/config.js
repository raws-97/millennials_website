// Constants should be in UPPERCASE_SNAKE_CASE
const API_TOKEN = "QLwUYs79xU9yp4c2WTRWAa9xuMVWXgJq";
const API_URL = "https://script.google.com/macros/s/AKfycbzyzIxQG0JsvZk3F6OI8eu9dbLQFTiYiygV-nBx1jlkOOnrga7dDSJi4zolWAGMU5Yo/exec";

// Use async/await for more readable asynchronous code
async function httpGetPromises(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Handle errors in a centralized way or rethrow them
    throw error;
  }
}