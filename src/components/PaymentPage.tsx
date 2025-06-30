import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MetamaskPayment from "./MetamaskPayment";
import PeraWalletPayment from "./PeraWalletPayment";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [upiRef, setUpiRef] = useState("");
  const [upiSubmitted, setUpiSubmitted] = useState(false);

  // Handle payment success: store plan and payment in localStorage, redirect to /payments
  const handlePaymentSuccess = (method: string, txIdOrRef: string) => {
    localStorage.setItem("currentPlan", plan);
    const history = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
    history.unshift({
      plan,
      price,
      method,
      txIdOrRef,
      date: new Date().toISOString(),
      reason: "subscription",
    });
    localStorage.setItem("paymentHistory", JSON.stringify(history));
    sessionStorage.setItem("showCongratulationsModal", plan);
    navigate("/payments");
  };

  if (!plan || price === undefined || price === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No plan selected</h2>
          <button
            className="bg-transparent hover:bg-purple-600/20 text-purple-400 border border-purple-400 font-semibold py-2 px-8 rounded-full transition-all duration-300"
            onClick={() => navigate("/profile")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiSubmitted(true);
    handlePaymentSuccess("UPI", upiRef);
  };

  const buttonBaseClasses =
    "w-full font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-3 text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-full hover:before:from-white/20";

  const gradientClasses = {
    purple:
      "bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-800/40 hover:to-pink-800/40 after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-t after:from-purple-500/5 after:to-transparent after:-z-10",
    blue: "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-800/40 hover:to-indigo-800/40 after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-t after:from-blue-500/5 after:to-transparent after:-z-10",
    green:
      "bg-gradient-to-r from-green-900/30 to-emerald-900/30 hover:from-green-800/40 hover:to-emerald-800/40 after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-t after:from-green-500/5 after:to-transparent after:-z-10",
  };

  const paymentMethods = [
    {
      id: "metamask",
      name: "Pay with Metamask",
      color: "purple" as const,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.8181 1L13.0565 7.99196L14.5604 3.89191L21.8181 1Z" />
          <path d="M2.18176 1L10.8767 8.0426L9.43951 3.89191L2.18176 1Z" />
          <path d="M18.6858 16.901L16.3705 20.6567L21.1552 22.0807L22.5456 16.9852L18.6858 16.901Z" />
          <path d="M1.46313 16.9852L2.84479 22.0807L7.62949 20.6567L5.31416 16.901L1.46313 16.9852Z" />
        </svg>
      ),
    },
    {
      id: "pera",
      name: "Pay with Pera Wallet",
      color: "blue" as const,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
        </svg>
      ),
    },
    {
      id: "upi",
      name: "Pay with UPI",
      color: "green" as const,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 14V6C19 4.9 18.1 4 17 4H3C1.9 4 1 4.9 1 6V14C1 15.1 1.9 16 3 16H17C18.1 16 19 15.1 19 14M17 14H3V6H17V14M23 7V18C23 19.1 22.1 20 21 20H7C5.9 20 5 19.1 5 18V7H7V18H21V7H23Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-gradient-to-b from-purple-950/30 via-[#0a0a0a] to-[#0a0a0a] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-3xl shadow-lg shadow-purple-800/5 w-full max-w-6xl border border-purple-900/20 flex overflow-hidden"
      >
        {/* Left Side - Payment Methods */}
        <div className="w-1/3 border-r border-purple-900/20 p-8 bg-gradient-to-br from-[#0a0a0a]/90 to-purple-950/10">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">
              Complete Payment
            </h2>
            <div className="text-gray-400 text-sm">
              Choose your preferred payment method
            </div>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                className={`${buttonBaseClasses} ${
                  selectedMethod === method.id
                    ? `${
                        gradientClasses[method.color]
                      } text-white border-2 border-${
                        method.color
                      }-400 shadow-lg shadow-${method.color}-900/20`
                    : `bg-[#0a0a0a]/70 text-white border border-gray-700 hover:bg-${method.color}-900/40`
                }`}
                onClick={() => setSelectedMethod(method.id)}
                whileHover={{ scale: 1.02, translateX: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {method.icon}
                {method.name}
              </motion.button>
            ))}
          </div>

          <motion.button
            className="mt-8 text-gray-400 hover:text-gray-300 transition-colors duration-300 flex items-center gap-2 text-sm rounded-full px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent"
            onClick={() => navigate("/payments")}
            whileHover={{ x: -5 }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Cancel and go back
          </motion.button>
        </div>

        {/* Right Side - Payment Content */}
        <div className="w-2/3 p-8 bg-gradient-to-br from-[#0a0a0a]/90 to-purple-950/5">
          <div className="mb-8 p-6 bg-[#0a0a0a]/70 rounded-2xl border border-purple-900/20 backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-2">Selected Plan</div>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
              {plan}
            </div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              ${price}
              <span className="text-sm font-normal text-gray-400">/month</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedMethod && (
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0a0a0a]/70 rounded-2xl p-6 border border-purple-900/20 backdrop-blur-sm min-h-[400px]"
              >
                {selectedMethod === "metamask" && (
                  <MetamaskPayment
                    amountUsd={price}
                    onPaymentSuccess={(txId) =>
                      handlePaymentSuccess("Metamask", txId)
                    }
                  />
                )}
                {selectedMethod === "pera" && (
                  <PeraWalletPayment
                    amountUsd={price}
                    onPaymentSuccess={(txId) =>
                      handlePaymentSuccess("Pera Wallet", txId)
                    }
                  />
                )}
                {selectedMethod === "upi" && !upiSubmitted && (
                  <form onSubmit={handleUpiSubmit} className="space-y-6">
                    <div className="bg-gradient-to-br from-[#0a0a0a]/80 to-green-950/10 rounded-2xl p-6 border border-green-900/30">
                      <div className="text-gray-300 mb-3 text-sm">
                        Send payment to UPI ID
                      </div>
                      <div className="text-lg text-green-400 font-mono mb-4 bg-[#0a0a0a]/80 p-4 rounded-full border border-green-800/30 flex items-center justify-between relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent">
                        yourupi@bank
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-300 rounded-full px-3 py-1 bg-green-900/20 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent"
                          onClick={() =>
                            navigator.clipboard.writeText("yourupi@bank")
                          }
                        >
                          Copy
                        </motion.button>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Amount to pay:{" "}
                        <span className="text-white font-semibold">
                          ${price} USD
                        </span>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="w-full p-4 rounded-full bg-[#0a0a0a]/80 text-white border border-gray-800 focus:border-green-700 focus:outline-none transition-all duration-300 placeholder-gray-600 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent"
                      placeholder="Enter UPI transaction reference number"
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      required
                    />

                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-900/30 to-emerald-900/30 hover:from-green-800/40 hover:to-emerald-800/40 text-white border border-green-700 font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-green-900/10 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-full hover:before:from-white/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Reference
                    </motion.button>
                  </form>
                )}
                {selectedMethod === "upi" && upiSubmitted && (
                  <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 text-green-400 border border-green-700 rounded-full p-6 flex items-center gap-3 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Thank you! Your payment reference has been submitted for
                    verification.
                  </div>
                )}
              </motion.div>
            )}
            {!selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-400 text-center mt-8 p-4 border border-purple-900/20 rounded-2xl bg-[#0a0a0a]/70 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent min-h-[200px] flex items-center justify-center"
              >
                <div>
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  Select a payment method from the left to continue
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
