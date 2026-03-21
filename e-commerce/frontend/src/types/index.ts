export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  onhand: number;
  price: number;
  image_url: string;
}

export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Invoice {
  client_id: number;
  client_name: string;
  amount: number;
  date: string;
}

export interface InvoiceItem {
  stock_id: number;
  stock_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface TransactionPayload {
  invoice: Invoice;
  items: InvoiceItem[];
}

export interface AuthUser {
  client: Client;
  token: string;
}
