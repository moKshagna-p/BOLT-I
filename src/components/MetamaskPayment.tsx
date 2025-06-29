import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const RECEIVER_ADDRESS = '0x60e6bc25c838fC0D06e96c05A9cF625ddCaE6675'; // Replace with your wallet address

interface MetamaskPaymentProps {
  amountUsd: number;
  onPaymentSuccess?: (txId: string) => void;
}

const USD_TO_ETH = 0.00032; // Placeholder conversion rate, replace with real-time rate if needed

const MetamaskPayment: React.FC<MetamaskPaymentProps> = ({ amountUsd, onPaymentSuccess }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState('');

  useEffect(() => {
    // Convert USD to ETH (static for now)
    setEthAmount((amountUsd * USD_TO_ETH).toFixed(6));
  }, [amountUsd]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setError(null);
      } catch (err: any) {
        setError('User rejected wallet connection');
      }
    } else {
      setError('Metamask not detected. Please install Metamask.');
    }
  };

  const sendPayment = async () => {
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }
    if (!ethAmount || isNaN(Number(ethAmount)) || Number(ethAmount) <= 0) {
      setError('Invalid amount.');
      return;
    }
    setStatus('Pending...');
    setError(null);
    setTxHash(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: RECEIVER_ADDRESS,
        value: ethers.parseEther(ethAmount),
      });
      setStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTxHash(tx.hash);
      setStatus('Payment successful!');
      if (onPaymentSuccess) onPaymentSuccess(tx.hash);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStatus(null);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Pay with Metamask</h2>
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
        >
          Connect Metamask
        </button>
      ) : (
        <div className="mb-4 text-green-400">Connected: {account}</div>
      )}
      <div className="mb-2 text-gray-300">Amount to pay (USD): <span className="text-white font-bold">${amountUsd}</span></div>
      <input
        type="number"
        value={ethAmount}
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
        disabled
      />
      <div className="mb-4 text-gray-400 text-xs">(ETH amount is approximate, based on current conversion rate)</div>
      <button
        onClick={sendPayment}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        disabled={!account}
      >
        Send Payment
      </button>
      {status && <div className="mt-4 text-blue-400">{status}</div>}
      {txHash && (
        <div className="mt-2 text-green-400 break-all">
          Transaction Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash}</a>
        </div>
      )}
      {error && <div className="mt-4 text-red-400">{error}</div>}
    </div>
  );
};

export default MetamaskPayment; 