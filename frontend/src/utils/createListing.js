import { createListingAPI } from './api';

function isValidTelegramBotLink(url) {
  try {
    console.log("Validating URL:", url);
    const urlObj = new URL(url);

    console.log("Hostname:", urlObj.hostname);

    // Check if hostname is exactly 't.me'
    if (urlObj.hostname !== 't.me') {
      console.log("Invalid hostname");
      return false;
    }

    // Check if path is valid
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    console.log("Path segments:", pathSegments);

    if (pathSegments.length < 1 || !pathSegments[0].match(/^[a-zA-Z0-9_]+$/)) {
      console.log("Invalid path");
      return false;
    }

    console.log("URL is valid");
    return true;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return false;
  }
}

export async function createListing({ url, points }) {
  console.log("Received URL:", url);
  console.log("Received Points:", points);

  if (!isValidTelegramBotLink(url)) {
    console.log("Invalid Telegram bot link");
    return { error: { url: "Please enter a valid Telegram bot link (e.g., https://t.me/botname/game?param=value)" } };
  }

  if (isNaN(points) || points < 1) {
    console.log("Invalid points:", points);
    return { error: { points: "Please enter a valid number of points" } };
  }

  try {
    const result = await createListingAPI({ url, points });
    console.log("Listing created successfully:", result);
    return {
      success: true,
      message: `Telegram bot listing created successfully with ${points} referral(s)`,
      newBalance: result.newBalance,
      metadata: result.listing,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { error: { general: error.message || "Failed to create listing. Please try again." } };
  }
}

