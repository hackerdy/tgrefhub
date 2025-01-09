const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function fetchMetadata(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch-metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch metadata');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

export async function createListingAPI(data) {
  try {
    const metadata = await fetchMetadata(data.url);
    const listingData = {
      ...data,
      ...metadata,
    };

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create listing');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}
