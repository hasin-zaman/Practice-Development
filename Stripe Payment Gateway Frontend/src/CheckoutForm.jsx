import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import "./index.css"

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      // Call backend to create PaymentIntent
      const res = await fetch("http://localhost:8080/secure/user/payments/initiate", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          bookingId: 1,
          provider: "STRIPE",
          context: "BOOKING",
          amount: 600,
          currency: "AED"
        }),
      });

      const response = await res.json();
      console.warn(response)
      console.log(response.data)
      console.log(response.data.clientSecret)

      if (!res.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = response.data;

      // Confirm card payment with clientSecret
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("Payment succeeded! 🎉");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
        <button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="pay-button"
        >
          {isProcessing ? "Processing..." : "Pay"}
        </button>
        {message && <div className="payment-message">{message}</div>}
      </form>
    </div>
  );
}

export default CheckoutForm;