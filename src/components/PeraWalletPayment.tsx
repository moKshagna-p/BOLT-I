import React, { useState, useEffect } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { motion } from "framer-motion";

const RECEIVER_ADDRESS =
  "ECJYSFKHAZI7LFF5WD2JYFH67GXYTFQ4M2MQ32ZM3HTIY3DYDQA6IUBGCU"; // Replace with your Algorand address
const USD_TO_ALGO = 0.6; // Placeholder conversion rate, replace with real-time rate if needed

interface PeraWalletPaymentProps {
  amountUsd: number;
  onPaymentSuccess?: (txId: string) => void;
}

const peraWallet = new PeraWalletConnect();

const PeraWalletPayment: React.FC<PeraWalletPaymentProps> = ({
  amountUsd,
  onPaymentSuccess,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [algoAmount, setAlgoAmount] = useState("");
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
      setError("Failed to connect Pera Wallet");
    }
  };

  const sendPayment = async () => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setStatus("Pending...");
    setError(null);
    setTxId(null);
    try {
      // This is a placeholder. In a real app, you would use Algorand SDK to build and sign the transaction.
      // For now, just simulate a successful transaction.
      setTimeout(() => {
        setTxId("SIMULATED_TX_ID");
        setStatus("Payment successful!");
        if (onPaymentSuccess) onPaymentSuccess("SIMULATED_TX_ID");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      setStatus(null);
    }
  };

  const buttonBaseClasses =
    "w-full font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-full hover:before:from-white/20";

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-6">
        Pay with Pera Wallet
      </h2>

      {!account ? (
        <motion.button
          onClick={connectWallet}
          className={`${buttonBaseClasses} bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-800/40 hover:to-indigo-800/40 text-white border border-blue-700 shadow-lg shadow-blue-900/10`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Connect Pera Wallet
        </motion.button>
      ) : (
        <div className="p-4 rounded-full bg-[#0a0a0a]/60 border border-blue-800/30 text-blue-400 mb-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          Connected: {account}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-[#0a0a0a]/80 to-blue-950/10 rounded-2xl p-6 border border-blue-900/30">
          <div className="text-gray-400 mb-2 text-sm">Amount to pay (USD)</div>
          <div className="text-2xl font-bold text-white mb-4">${amountUsd}</div>

          <div className="relative">
            <div className="text-gray-400 mb-2 text-sm">ALGO Amount</div>
            <div className="text-lg text-blue-400 font-mono p-4 rounded-full bg-[#0a0a0a]/80 border border-blue-800/30 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
              {algoAmount}
            </div>
            <div className="mt-2 text-gray-500 text-xs">
              (ALGO amount is approximate, based on current conversion rate)
            </div>
          </div>
        </div>

        <motion.button
          onClick={sendPayment}
          className={`${buttonBaseClasses} bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-800/40 hover:to-indigo-800/40 text-white border border-blue-700 shadow-lg shadow-blue-900/10`}
          disabled={!account}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Payment
        </motion.button>
      </div>

      {status && (
        <div className="mt-4 text-blue-400 p-4 rounded-full bg-blue-900/20 border border-blue-800/30 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          {status}
        </div>
      )}

      {txId && (
        <div className="mt-4 text-green-400 p-4 rounded-full bg-green-900/20 border border-green-800/30 break-all relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
          Transaction ID: <span className="underline">{txId}</span>
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

export default PeraWalletPayment;
