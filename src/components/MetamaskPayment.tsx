import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const RECEIVER_ADDRESS = "0x60e6bc25c838fC0D06e96c05A9cF625ddCaE6675"; // Replace with your wallet address

interface MetamaskPaymentProps {
  amountUsd: number;
  onPaymentSuccess?: (txId: string) => void;
}

const USD_TO_ETH = 0.00032; // Placeholder conversion rate, replace with real-time rate if needed

const MetamaskPayment: React.FC<MetamaskPaymentProps> = ({
  amountUsd,
  onPaymentSuccess,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState("");

  useEffect(() => {
    // Convert USD to ETH (static for now)
    setEthAmount((amountUsd * USD_TO_ETH).toFixed(6));
  }, [amountUsd]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setError(null);
      } catch (err: any) {
        setError("User rejected wallet connection");
      }
    } else {
      setError("Metamask not detected. Please install Metamask.");
    }
  };

  const sendPayment = async () => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!ethAmount || isNaN(Number(ethAmount)) || Number(ethAmount) <= 0) {
      setError("Invalid amount.");
      return;
    }
    setStatus("Pending...");
    setError(null);
    setTxHash(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: RECEIVER_ADDRESS,
        value: ethers.parseEther(ethAmount),
      });
      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      setTxHash(tx.hash);
      setStatus("Payment successful!");
      if (onPaymentSuccess) onPaymentSuccess(tx.hash);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      setStatus(null);
    }
  };

  const buttonBaseClasses =
    "w-full font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-full hover:before:from-white/20";

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
        Pay with Metamask
      </h2>

      {!account ? (
        <motion.button
          onClick={connectWallet}
          className={`${buttonBaseClasses} bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-800/40 hover:to-pink-800/40 text-white border border-purple-700 shadow-lg shadow-purple-900/10`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Connect Metamask
        </motion.button>
      ) : (
        <div className="p-4 rounded-full bg-[#0a0a0a]/60 border border-purple-800/30 text-purple-400 mb-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          Connected: {account}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-[#0a0a0a]/80 to-purple-950/10 rounded-2xl p-6 border border-purple-900/30">
          <div className="text-gray-400 mb-2 text-sm">Amount to pay (USD)</div>
          <div className="text-2xl font-bold text-white mb-4">${amountUsd}</div>

          <div className="relative">
            <div className="text-gray-400 mb-2 text-sm">ETH Amount</div>
            <div className="text-lg text-purple-400 font-mono p-4 rounded-full bg-[#0a0a0a]/80 border border-purple-800/30 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
              {ethAmount}
            </div>
            <div className="mt-2 text-gray-500 text-xs">
              (ETH amount is approximate, based on current conversion rate)
            </div>
          </div>
        </div>

        <motion.button
          onClick={sendPayment}
          className={`${buttonBaseClasses} bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-800/40 hover:to-pink-800/40 text-white border border-purple-700 shadow-lg shadow-purple-900/10`}
          disabled={!account}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Payment
        </motion.button>
      </div>

      {status && (
        <div className="mt-4 text-purple-400 p-4 rounded-full bg-purple-900/20 border border-purple-800/30 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          {status}
        </div>
      )}

      {txHash && (
        <div className="mt-4 text-green-400 p-4 rounded-full bg-green-900/20 border border-green-800/30 break-all relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          Transaction Hash:{" "}
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {txHash}
          </a>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-400 p-4 rounded-full bg-red-900/20 border border-red-800/30 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          {error}
        </div>
      )}
    </div>
  );
};

export default MetamaskPayment;
