import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface InvoiceData {
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
}

export default function CheckoutComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const invoice = state?.invoice as InvoiceData | undefined;

  // Redirect to home if no invoice data (security/UX)
  useEffect(() => {
    if (!invoice) {
      navigate('/');
    }
  }, [invoice, navigate]);

  // Show nothing while redirecting
  if (!invoice) {
    return null;
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(invoice.amount);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      {/* Success Icon */}
      <CheckCircle className="mb-6 h-20 w-20 text-green-500" />

      {/* Heading */}
      <h1 className="mb-2 text-4xl font-bold text-foreground">Order Confirmed!</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>

      {/* Order Details Card */}
      <div className="mb-8 w-full rounded-lg border border-border bg-card p-8">
        <div className="mb-6 space-y-4">
          {/* Invoice Number */}
          <div className="border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="text-2xl font-bold text-foreground">{invoice.invoiceNumber}</p>
          </div>

          {/* Total Amount */}
          <div className="border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-foreground">{formattedAmount}</p>
          </div>

          {/* Estimated Delivery */}
          <div>
            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
            <p className="text-lg font-semibold text-foreground">7 business days</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full sm:w-auto">
        <Button
          size="lg"
          onClick={() => navigate('/products')}
          className="w-full sm:w-auto"
        >
          Continue Shopping
        </Button>

        {/* View Order History Link (only for logged-in users) */}
        {isAuthenticated && (
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto"
          >
            <Link to="/profile/orders">View Order History</Link>
          </Button>
        )}
      </div>

      {/* Additional Info */}
      <p className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        A confirmation email has been sent to your registered email address with order details and tracking information.
      </p>
    </div>
  );
}
