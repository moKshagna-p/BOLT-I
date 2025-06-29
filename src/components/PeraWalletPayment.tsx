import React, { useState, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

const RECEIVER_ADDRESS = 'ECJYSFKHAZI7LFF5WD2JYFH67GXYTFQ4M2MQ32ZM3HTIY3DYDQA6IUBGCU'; // Replace with your Algorand address
const USD_TO_ALGO = 0.6; // Placeholder conversion rate, replace with real-time rate if needed

interface PeraWalletPaymentProps {
  amountUsd: number;
  onPaymentSuccess?: (txId: string) => void;
}

const peraWallet = new PeraWalletConnect();

const PeraWalletPayment: React.FC<PeraWalletPaymentProps> = ({ amountUsd, onPaymentSuccess }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [algoAmount, setAlgoAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAlgoAmount((amountUsd * USD_TO_ALGO).toFixed(2));
  }, [amountUsd]);

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
      setError(null);
    } catch (err: any) {
      setError('Failed to connect Pera Wallet');
    }
  };

  const sendPayment = async () => {
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }
    setStatus('Pending...');
    setError(null);
    setTxId(null);
    try {
      // This is a placeholder. In a real app, you would use Algorand SDK to build and sign the transaction.
      // For now, just simulate a successful transaction.
      setTimeout(() => {
        setTxId('SIMULATED_TX_ID');
        setStatus('Payment successful!');
        if (onPaymentSuccess) onPaymentSuccess('SIMULATED_TX_ID');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStatus(null);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Pay with Pera Wallet</h2>
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
        >
          Connect Pera Wallet
        </button>
      ) : (
        <div className="mb-4 text-green-400">Connected: {account}</div>
      )}
      <div className="mb-2 text-gray-300">Amount to pay (USD): <span className="text-white font-bold">${amountUsd}</span></div>
      <input
        type="number"
        value={algoAmount}
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
        disabled
      />
      <div className="mb-4 text-gray-400 text-xs">(ALGO amount is approximate, based on current conversion rate)</div>
      <button
        onClick={sendPayment}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        disabled={!account}
      >
        Send Payment
      </button>
      {status && <div className="mt-4 text-blue-400">{status}</div>}
      {txId && (
        <div className="mt-2 text-green-400 break-all">
          Transaction ID: <span className="underline">{txId}</span>
        </div>
      )}
      {error && <div className="mt-4 text-red-400">{error}</div>}
    </div>
  );
};

export default PeraWalletPayment; 