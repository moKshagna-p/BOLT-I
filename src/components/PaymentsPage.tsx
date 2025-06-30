import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import CongratulationsModal from "./CongratulationsModal";

// Add these interfaces before the component
interface YearlyPrice {
  original: number;
  discounted: number;
}

interface PricingStructure {
  monthly: {
    basic: number;
    pro: number;
    enterprise: number;
  };
  yearly: {
    basic: number;
    pro: YearlyPrice;
    enterprise: YearlyPrice;
  };
}

const PaymentsPage: React.FC = () => {
  const [paymentsTab, setPaymentsTab] = useState<"plans" | "history">("plans");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currentPlan, setCurrentPlan] = useState<string>("Free");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState<string>("");
  const navigate = useNavigate();

  // Define pricing for both billing cycles
  const pricing: PricingStructure = {
    monthly: {
      basic: 0,
      pro: 49,
      enterprise: 99,
    },
    yearly: {
      basic: 0,
      pro: {
        original: 49 * 12,
        discounted: 470,
      },
      enterprise: {
        original: 99 * 12,
        discounted: 950,
      },
    },
  };

  useEffect(() => {
    setCurrentPlan(localStorage.getItem("currentPlan") || "Free");
    setPaymentHistory(
      JSON.parse(localStorage.getItem("paymentHistory") || "[]")
    );
    const plan = sessionStorage.getItem("showCongratulationsModal");
    if (plan) {
      setUpgradedPlan(plan);
      setShowCongratulationsModal(true);
      sessionStorage.removeItem("showCongratulationsModal");
    }
  }, []);

  const handleCloseCongratulationsModal = () => {
    setShowCongratulationsModal(false);
  };

  const tabButtonClasses =
    "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300";
  const planCardClasses =
    "bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 flex flex-col border border-gray-800/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/10";
  const gradientButtonClasses =
    "w-full py-2.5 px-4 rounded-full font-medium text-white transition-all duration-500 bg-gradient-to-r shadow-lg transform hover:scale-105";

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5,
      },
    },
  };

  // Add type guard function
  const isYearlyPrice = (price: number | YearlyPrice): price is YearlyPrice => {
    return (
      typeof price === "object" && "original" in price && "discounted" in price
    );
  };

  // Update the getCurrentPrice function type
  const getCurrentPrice = (
    plan: "basic" | "pro" | "enterprise"
  ): number | YearlyPrice => {
    if (billingCycle === "yearly" && plan !== "basic") {
      return pricing.yearly[plan];
    }
    return pricing.monthly[plan];
  };

  const getDisplayPrices = (plan: "basic" | "pro" | "enterprise") => {
    if (billingCycle === "yearly" && plan !== "basic") {
      const yearlyPrice = pricing.yearly[plan] as YearlyPrice;
      return {
        original: yearlyPrice.original,
        final: yearlyPrice.discounted,
        period: "year",
      };
    }
    return {
      final: pricing.monthly[plan],
      period: "month",
    };
  };

  return (
    <motion.div
      className="min-h-screen bg-[#121212] bg-gradient-to-b from-purple-900/10 to-[#121212] pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-center gap-2 mb-8">
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-full p-1 flex border border-gray-800/50 relative">
            <motion.div
              className="absolute top-1 bottom-1 bg-purple-500/20 rounded-full border border-purple-500/50"
              initial={false}
              animate={{
                left: paymentsTab === "history" ? "50%" : "0%",
                right: paymentsTab === "history" ? "0%" : "50%",
              }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
            <button
              className={`${tabButtonClasses} relative z-10 flex-1 ${
                paymentsTab === "plans"
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setPaymentsTab("plans")}
            >
              Startup Plans
            </button>
            <button
              className={`${tabButtonClasses} relative z-10 flex-1 ${
                paymentsTab === "history"
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setPaymentsTab("history")}
            >
              Payment History
            </button>
          </div>
        </div>

        {paymentsTab === "plans" && (
          <motion.div
            className="flex justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-full p-1 flex border border-gray-800/50">
              <motion.div
                className="absolute top-1 bottom-1 bg-purple-500/20 rounded-full border border-purple-500/50"
                initial={false}
                animate={{
                  left: billingCycle === "yearly" ? "50%" : "0%",
                  right: billingCycle === "yearly" ? "0%" : "50%",
                }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              />
              <button
                className={`${tabButtonClasses} relative z-10 px-8 ${
                  billingCycle === "monthly"
                    ? "text-purple-400"
                    : "text-gray-400"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`${tabButtonClasses} relative z-10 px-8 ${
                  billingCycle === "yearly"
                    ? "text-purple-400"
                    : "text-gray-400"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {paymentsTab === "plans" ? (
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
            >
              {/* Basic Plan */}
              <motion.div className={planCardClasses} variants={cardVariants}>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Basic</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Perfect for early-stage startups
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    $0
                  </span>
                  <span className="text-gray-400 text-sm">
                    /{billingCycle === "yearly" ? "year" : "month"}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Basic startup profile
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Limited investor matching
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Basic analytics dashboard
                  </li>
                </ul>
                <motion.button
                  className={`${gradientButtonClasses} from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700`}
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        plan: "Basic",
                        price: getCurrentPrice("basic"),
                        billingCycle,
                      },
                    })
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Growing
                </motion.button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                className={`${planCardClasses} relative border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-transparent`}
                variants={cardVariants}
              >
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Popular
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Best for growing startups
                </p>
                <div className="flex flex-col items-center mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex items-baseline gap-2"
                    >
                      {(() => {
                        const prices = getDisplayPrices("pro");
                        return (
                          <>
                            {prices.original && (
                              <span className="text-lg text-gray-400 line-through">
                                ${prices.original}
                              </span>
                            )}
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                              ${prices.final}
                            </span>
                            <span className="text-gray-400 text-sm">
                              /{prices.period}
                            </span>
                          </>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Enhanced startup profile
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Priority investor matching
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pitch deck hosting
                  </li>
                </ul>
                <motion.button
                  className={`${gradientButtonClasses} from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        plan: "Pro",
                        price: getCurrentPrice("pro"),
                        billingCycle,
                      },
                    })
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Growing
                </motion.button>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div className={planCardClasses} variants={cardVariants}>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Enterprise
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  For established startups
                </p>
                <div className="flex flex-col items-center mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex items-baseline gap-2"
                    >
                      {(() => {
                        const prices = getDisplayPrices("enterprise");
                        return (
                          <>
                            {prices.original && (
                              <span className="text-lg text-gray-400 line-through">
                                ${prices.original}
                              </span>
                            )}
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                              ${prices.final}
                            </span>
                            <span className="text-gray-400 text-sm">
                              /{prices.period}
                            </span>
                          </>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Custom startup profile
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    VIP investor matching
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Real-time analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Multiple pitch decks
                  </li>
                </ul>
                <motion.button
                  className={`${gradientButtonClasses} from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700`}
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        plan: "Enterprise",
                        price: getCurrentPrice("enterprise"),
                        billingCycle,
                      },
                    })
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Growing
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Payment History
              </h3>
              {paymentHistory.length === 0 ? (
                <div className="text-gray-400">No payments yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-800/50">
                        <th className="py-3 px-4 text-gray-400 font-medium">
                          Date
                        </th>
                        <th className="py-3 px-4 text-gray-400 font-medium">
                          Plan
                        </th>
                        <th className="py-3 px-4 text-gray-400 font-medium">
                          Amount
                        </th>
                        <th className="py-3 px-4 text-gray-400 font-medium">
                          Method
                        </th>
                        <th className="py-3 px-4 text-gray-400 font-medium">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((p, i) => (
                        <motion.tr
                          key={i}
                          className="border-b border-gray-800/50 last:border-0 hover:bg-purple-900/10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(p.date).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-300">{p.plan}</td>
                          <td className="py-3 px-4 text-gray-300">
                            ${p.price}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {p.method}
                          </td>
                          <td className="py-3 px-4 text-gray-300 break-all">
                            {p.txIdOrRef}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showCongratulationsModal && (
        <CongratulationsModal
          open={showCongratulationsModal}
          onClose={handleCloseCongratulationsModal}
          plan={upgradedPlan}
        />
      )}
    </motion.div>
  );
};

export default PaymentsPage;
