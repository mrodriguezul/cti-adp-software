const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CreateOrderPayload {
  clientAddress: string;
  paymentToken: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface OrderResponse {
  success: boolean;
  data: {
    invoiceId: number;
    invoiceNumber: string;
    amount: number;
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  // Get the token from localStorage
  const authData = localStorage.getItem('lpa_auth');
  if (!authData) {
    throw new Error('Authentication required. Please log in.');
  }

  let token: string;
  try {
    const auth = JSON.parse(authData);
    token = auth.token;
  } catch {
    throw new Error('Invalid authentication data. Please log in again.');
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create order';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Use default error message if response is not JSON
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}
