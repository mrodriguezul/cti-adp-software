import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/services/orderService';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import defaultProductImage from '@/assets/default-product.png';

interface AddressFormData {
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}

interface CreditCardFormData {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  [key: string]: string;
}

// Validation functions
const validateAddress = (data: AddressFormData): FormErrors => {
  const errors: FormErrors = {};
  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Address is required';
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required';
  }
  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'State/Province is required';
  }
  if (!data.postal || data.postal.trim().length < 3) {
    errors.postal = 'Zip/Postal is required';
  }
  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Country is required';
  }
  return errors;
};

const validateCreditCard = (data: CreditCardFormData): FormErrors => {
  const errors: FormErrors = {};
  if (!data.nameOnCard || data.nameOnCard.trim().length < 3) {
    errors.nameOnCard = 'Name on card is required';
  }
  if (!/^\d{16}$/.test(data.cardNumber)) {
    errors.cardNumber = 'Card number must be 16 digits';
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry)) {
    errors.expiry = 'Expiry must be MM/YY';
  }
  if (!/^\d{3}$/.test(data.cvv)) {
    errors.cvv = 'CVV must be 3 digits';
  }
  return errors;
};

// Address Step Component
function AddressStep({
  onSubmit,
  fullName,
  defaultAddress,
}: {
  onSubmit: (data: AddressFormData) => void;
  fullName: string;
  defaultAddress?: string;
}) {
  const [formData, setFormData] = useState<AddressFormData>({
    address: defaultAddress || '',
    city: '',
    state: '',
    postal: '',
    country: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAddress(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Read-only customer name section */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <Label className="text-muted-foreground text-xs font-medium">Shipping to</Label>
        <p className="text-lg font-semibold text-foreground mt-1">{fullName}</p>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main Street"
            value={formData.address}
            onChange={handleChange}
            className={`mt-1 ${errors.address ? 'border-destructive' : ''}`}
          />
          {errors.address && (
            <p className="text-destructive text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 ${errors.city ? 'border-destructive' : ''}`}
            />
            {errors.city && (
              <p className="text-destructive text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              placeholder="NY"
              value={formData.state}
              onChange={handleChange}
              className={`mt-1 ${errors.state ? 'border-destructive' : ''}`}
            />
            {errors.state && (
              <p className="text-destructive text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postal">Zip/Postal Code</Label>
            <Input
              id="postal"
              name="postal"
              placeholder="10001"
              value={formData.postal}
              onChange={handleChange}
              className={`mt-1 ${errors.postal ? 'border-destructive' : ''}`}
            />
            {errors.postal && (
              <p className="text-destructive text-sm mt-1">{errors.postal}</p>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              placeholder="United States"
              value={formData.country}
              onChange={handleChange}
              className={`mt-1 ${errors.country ? 'border-destructive' : ''}`}
            />
            {errors.country && (
              <p className="text-destructive text-sm mt-1">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Next: Payment <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}

// Payment Step Component
function PaymentStep({
  onSubmit,
  onBack,
}: {
  onSubmit: (token: string) => void;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState('cc');
  const [formData, setFormData] = useState<CreditCardFormData>({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCreditCard(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsProcessing(true);
    const token = `mock_cc_${Date.now()}`;
    onSubmit(token);
  };

  const handlePayPalClick = () => {
    setIsProcessing(true);
    const token = `mock_paypal_${Date.now()}`;
    onSubmit(token);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Payment Method</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cc">Credit Card</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
        </TabsList>

        {/* Credit Card Tab */}
        <TabsContent value="cc" className="space-y-6">
          <form onSubmit={handleCCSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                name="nameOnCard"
                placeholder="John Doe"
                value={formData.nameOnCard}
                onChange={handleChange}
                className={`mt-1 ${errors.nameOnCard ? 'border-destructive' : ''}`}
              />
              {errors.nameOnCard && (
                <p className="text-destructive text-sm mt-1">{errors.nameOnCard}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="4242424242424242"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength={16}
                className={`mt-1 ${errors.cardNumber ? 'border-destructive' : ''}`}
              />
              {errors.cardNumber && (
                <p className="text-destructive text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  placeholder="12/25"
                  value={formData.expiry}
                  onChange={handleChange}
                  maxLength={5}
                  className={`mt-1 ${errors.expiry ? 'border-destructive' : ''}`}
                />
                {errors.expiry && (
                  <p className="text-destructive text-sm mt-1">{errors.expiry}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength={3}
                  className={`mt-1 ${errors.cvv ? 'border-destructive' : ''}`}
                />
                {errors.cvv && (
                  <p className="text-destructive text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isProcessing}
              >
                Continue to Review <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* PayPal Tab */}
        <TabsContent value="paypal" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground mb-4">Click below to securely log in to PayPal</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button
                size="lg"
                onClick={handlePayPalClick}
                className="flex-1"
                disabled={isProcessing}
              >
                Log in to PayPal
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Review Step Component
function ReviewStep({
  clientAddress,
  onBack,
  onPlaceOrder,
  isLoading,
}: {
  clientAddress: string;
  onBack: () => void;
  onPlaceOrder: (agreed: boolean) => Promise<void>;
  isLoading: boolean;
}) {
  const { items, totalAmount } = useCart();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!termsAgreed) return;
    setIsSubmitting(true);
    try {
      await onPlaceOrder(termsAgreed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCartEmpty = items.length === 0;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Order Review</h3>

      {/* Shipping Address */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <Label className="text-muted-foreground text-xs font-medium">Shipping Address</Label>
        <p className="text-foreground mt-1">{clientAddress}</p>
      </div>

      {/* Cart Items - Read-only */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="hidden border-b border-border bg-muted/50 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
          <span className="col-span-5 text-xs font-medium text-muted-foreground">Product</span>
          <span className="col-span-2 text-xs font-medium text-muted-foreground">Price</span>
          <span className="col-span-2 text-xs font-medium text-muted-foreground">Qty</span>
          <span className="col-span-3 text-xs font-medium text-muted-foreground text-right">Amount</span>
        </div>

        {/* Items */}
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex flex-col gap-3 border-b border-border px-4 py-4 last:border-0 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 bg-card"
          >
            <div className="col-span-5 flex items-center gap-3">
              <img
                src={item.product.image_url || defaultProductImage}
                alt={item.product.name}
                className="h-12 w-12 flex-shrink-0 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.product.sku}</p>
              </div>
            </div>
            <div className="col-span-2 text-sm text-foreground">
              <span className="sm:hidden text-muted-foreground">Price: </span>
              ${item.product.price.toFixed(2)}
            </div>
            <div className="col-span-2 text-sm text-foreground">
              <span className="sm:hidden text-muted-foreground">Qty: </span>
              {item.quantity}
            </div>
            <div className="col-span-3 text-right text-sm font-semibold text-foreground">
              <span className="sm:hidden text-muted-foreground font-normal">Amount: </span>
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Edit Cart Link */}
      <div className="text-center">
        <Link to="/cart" className="text-primary hover:underline text-sm">
          ← Edit Cart
        </Link>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAgreed}
          onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
        />
        <Label htmlFor="terms" className="cursor-pointer">
          I agree to the Terms and Conditions
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handlePlaceOrder}
          disabled={!termsAgreed || isCartEmpty || isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}

// Main Checkout Component
export default function Checkout() {
  const { items, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [clientAddress, setClientAddress] = useState('');
  const [paymentToken, setPaymentToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Authentication Required</h1>
        <p className="mb-6 text-muted-foreground">Please log in to complete your checkout.</p>
        <Button onClick={() => navigate('/products')}>Return to Products</Button>
      </div>
    );
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">Add items to your cart before checking out.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const fullName = `${user.client.firstname} ${user.client.lastname}`;

  const handleAddressSubmit = (data: AddressFormData) => {
    const concatenatedAddress = `${data.address}, ${data.city}, ${data.state}, ${data.postal}, ${data.country}`;
    setClientAddress(concatenatedAddress);
    setStep(2);
  };

  const handlePaymentSubmit = (token: string) => {
    setPaymentToken(token);
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);

      // Map cart items to order format
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Call API
      const result = await createOrder({
        clientAddress,
        paymentToken,
        items: orderItems,
      });

      // Clear cart
      clearCart();

      // Show success toast
      toast({
        title: 'Order Placed Successfully!',
        description: `Invoice #${result.data.invoiceNumber} - Total: $${result.data.amount.toFixed(2)}`,
      });

      // Navigate to confirmation page
      navigate('/checkout-complete', {
        state: { invoice: result.data },
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description:
          error instanceof Error ? error.message : 'An error occurred while placing your order.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Step Indicator */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <div className="flex items-center justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-primary' : 'bg-muted'
            }`}
          />
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            2
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 3 ? 'bg-primary' : 'bg-muted'
            }`}
          />
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 3
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            3
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Address</span>
          <span>Payment</span>
          <span>Review</span>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
        {step === 1 && (
          <AddressStep
            onSubmit={handleAddressSubmit}
            defaultAddress={user.client.address}
            fullName={fullName}
          />
        )}

        {step === 2 && (
          <PaymentStep onSubmit={handlePaymentSubmit} onBack={() => setStep(1)} />
        )}

        {step === 3 && (
          <ReviewStep
            clientAddress={clientAddress}
            onBack={() => setStep(2)}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Order Summary Sidebar (visible on desktop) */}
      <div className="hidden lg:block absolute right-8 top-32 w-64 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Order Summary</h3>
        <div className="text-xs text-muted-foreground mb-3">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
        <div className="flex justify-between text-sm font-semibold text-foreground">
          <span>Estimated Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
