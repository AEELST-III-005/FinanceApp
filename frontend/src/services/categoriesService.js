const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories/`;

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro na requisicao');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(CATEGORIES_ENDPOINT);
  return handleResponse(response);
}

export async function createCategory(payload) {
  const response = await fetch(CATEGORIES_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateCategory(id, payload) {
  const response = await fetch(`${CATEGORIES_ENDPOINT}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteCategory(id) {
  const response = await fetch(`${CATEGORIES_ENDPOINT}${id}/`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}
