const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const TRANSACTIONS_ENDPOINT = `${API_BASE_URL}/transactions/`;

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

const mapToApi = (data) => ({
  title: data.title,
  description: data.description || null,
  amount: Number(data.amount),
  transaction_date: new Date(data.transactionDate).toISOString().split('T')[0],
  transaction_type: data.transactionType,
  category_id: data.categoryId,
});

const mapToClient = (data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  amount: data.amount,
  transactionDate: data.transaction_date,
  transactionType: data.transaction_type,
  categoryId: data.category_id,
  categoryName: data.category_name,
});

export async function getTransactions() {
  const response = await fetch(TRANSACTIONS_ENDPOINT);
  const data = await handleResponse(response);
  return Array.isArray(data) ? data.map(mapToClient) : [];
}

export async function createTransaction(payload) {
  const response = await fetch(TRANSACTIONS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapToApi(payload)),
  });

  return handleResponse(response);
}

export async function updateTransaction(id, payload) {
  const response = await fetch(`${TRANSACTIONS_ENDPOINT}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapToApi(payload)),
  });

  return handleResponse(response);
}

export async function deleteTransaction(id) {
  const response = await fetch(`${TRANSACTIONS_ENDPOINT}${id}/`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}
