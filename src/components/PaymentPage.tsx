import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MetamaskPayment from './MetamaskPayment';
import PeraWalletPayment from './PeraWalletPayment';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [upiRef, setUpiRef] = useState('');
  const [upiSubmitted, setUpiSubmitted] = useState(false);

  // Handle payment success: store plan and payment in localStorage, redirect to /payments
  const handlePaymentSuccess = (method: string, txIdOrRef: string) => {
    // Store current plan
    localStorage.setItem('currentPlan', plan);
    // Store payment history
    const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    history.unshift({
      plan,
      price,
      method,
      txIdOrRef,
      date: new Date().toISOString(),
      reason: 'subscription',
    });
    localStorage.setItem('paymentHistory', JSON.stringify(history));
    // Redirect to /payments instead of /profile
    navigate('/payments');
  };

  if (!plan || price === undefined || price === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No plan selected</h2>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
            onClick={() => navigate('/profile')}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // UPI/IMPS form submit handler
  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiSubmitted(true);
    handlePaymentSuccess('UPI', upiRef);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="bg-gray-900 rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Complete Your Payment</h2>
        <div className="mb-6">
          <div className="text-lg text-gray-300 mb-2">Selected Plan:</div>
          <div className="text-xl font-bold text-purple-400 mb-2">{plan}</div>
          <div className="text-2xl font-extrabold text-white mb-2">${price}/mo</div>
        </div>
        {!selectedMethod && (
          <>
            <div className="text-gray-400 mb-2">Choose a payment method:</div>
            <div className="flex flex-col gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded" onClick={() => setSelectedMethod('metamask')}>Pay with Metamask</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded" onClick={() => setSelectedMethod('pera')}>Pay with Pera Wallet</button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded" onClick={() => setSelectedMethod('upi')}>Pay with UPI</button>
            </div>
          </>
        )}
        {selectedMethod === 'metamask' && (
          <>
            <MetamaskPayment amountUsd={price} onPaymentSuccess={(txId) => handlePaymentSuccess('Metamask', txId)} />
            <button className="mt-6 text-gray-400 underline" onClick={() => setSelectedMethod(null)}>Back</button>
          </>
        )}
        {selectedMethod === 'pera' && (
          <>
            <PeraWalletPayment amountUsd={price} onPaymentSuccess={(txId) => handlePaymentSuccess('Pera Wallet', txId)} />
            <button className="mt-6 text-gray-400 underline" onClick={() => setSelectedMethod(null)}>Back</button>
          </>
        )}
        {selectedMethod === 'upi' && (
          <>
            {!upiSubmitted ? (
              <form onSubmit={handleUpiSubmit} className="flex flex-col gap-4 mt-2">
                <div className="text-gray-300 mb-2">Send payment to UPI ID:</div>
                <div className="text-lg text-green-400 font-mono mb-2">yourupi@bank</div>
                <div className="mb-2 text-gray-300">Amount to pay: <span className="text-white font-bold">${price} USD</span></div>
                <input
                  type="text"
                  className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                  placeholder="Enter UPI transaction reference number"
                  value={upiRef}
                  onChange={e => setUpiRef(e.target.value)}
                  required
                />
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">Submit Reference</button>
              </form>
            ) : (
              <div className="text-green-400 mt-4">Thank you! Your payment reference has been submitted for verification.</div>
            )}
            <button className="mt-6 text-gray-400 underline" onClick={() => setSelectedMethod(null)}>Back</button>
          </>
        )}
        {!selectedMethod && (
          <button
            className="text-gray-400 underline mt-4"
            onClick={() => navigate('/profile')}
          >
            Cancel and go back
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 