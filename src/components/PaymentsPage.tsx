import React, { useState, useEffect } from 'react';
import MetamaskPayment from './MetamaskPayment';
import PeraWalletPayment from './PeraWalletPayment';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CongratulationsModal from './CongratulationsModal';

const PaymentsPage: React.FC = () => {
  const [paymentsTab, setPaymentsTab] = useState<'subscription' | 'history'>('subscription');
  const [currentPlan, setCurrentPlan] = useState<string>('Free');
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPlan(localStorage.getItem('currentPlan') || 'Free');
    setPaymentHistory(JSON.parse(localStorage.getItem('paymentHistory') || '[]'));
    
    // Check if we should show congratulations modal
    const plan = sessionStorage.getItem('showCongratulationsModal');
    if (plan) {
      setUpgradedPlan(plan);
      setShowCongratulationsModal(true);
      sessionStorage.removeItem('showCongratulationsModal');
    }
  }, []);

  const handleCloseCongratulationsModal = () => {
    setShowCongratulationsModal(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#121212] pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.h1
          className="text-3xl font-bold text-gray-100 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Payments
        </motion.h1>
        <div className="flex gap-4 mb-6">
          <motion.button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${paymentsTab === 'subscription' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setPaymentsTab('subscription')}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Subscription Plan
          </motion.button>
          <motion.button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${paymentsTab === 'history' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setPaymentsTab('history')}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Payment History
          </motion.button>
        </div>
        <motion.div
          className="bg-gray-900 rounded-b-lg p-6 min-h-[300px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {paymentsTab === 'subscription' && (
              <motion.div
                key="subscription"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Current Subscription</h3>
                <div className="mb-6 text-gray-300">You are currently on the <span className="text-purple-400 font-semibold">{currentPlan}</span> plan.</div>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basic Plan */}
                  <motion.div
                    className={`bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg ${currentPlan === 'Basic' ? 'border-4 border-purple-400 bg-purple-900/30' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <h4 className="text-lg font-bold text-white mb-2">Basic</h4>
                    <div className="text-3xl font-extrabold text-purple-400 mb-2">$0<span className="text-base font-medium text-gray-300">/mo</span></div>
                    <ul className="text-gray-300 mb-4 text-sm list-disc list-inside">
                      <li>Access to core features</li>
                      <li>Email support</li>
                      <li>Up to 3 projects</li>
                    </ul>
                    <motion.button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition-colors"
                      onClick={() => navigate('/payment', { state: { plan: 'Basic', price: 0 } })}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      Upgrade
                    </motion.button>
                  </motion.div>
                  {/* Pro Plan */}
                  <motion.div
                    className={`bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg ${currentPlan === 'Pro' ? 'border-4 border-purple-400 bg-purple-900/30' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h4 className="text-lg font-bold text-white mb-2">Pro</h4>
                    <div className="text-3xl font-extrabold text-purple-400 mb-2">$0<span className="text-base font-medium text-gray-300">/mo</span></div>
                    <ul className="text-gray-300 mb-4 text-sm list-disc list-inside">
                      <li>Everything in Basic</li>
                      <li>Priority support</li>
                      <li>Unlimited projects</li>
                      <li>Advanced analytics</li>
                    </ul>
                    <motion.button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition-colors"
                      onClick={() => navigate('/payment', { state: { plan: 'Pro', price: 0 } })}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      Upgrade
                    </motion.button>
                  </motion.div>
                  {/* Premium Plan */}
                  <motion.div
                    className={`bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg ${currentPlan === 'Premium' ? 'border-4 border-purple-400 bg-purple-900/30' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h4 className="text-lg font-bold text-white mb-2">Premium</h4>
                    <div className="text-3xl font-extrabold text-purple-400 mb-2">$0<span className="text-base font-medium text-gray-300">/mo</span></div>
                    <ul className="text-gray-300 mb-4 text-sm list-disc list-inside">
                      <li>Everything in Pro</li>
                      <li>1-on-1 onboarding</li>
                      <li>Custom integrations</li>
                      <li>Dedicated account manager</li>
                    </ul>
                    <motion.button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition-colors"
                      onClick={() => navigate('/payment', { state: { plan: 'Premium', price: 0 } })}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      Upgrade
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
            {paymentsTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Payment History</h3>
                {paymentHistory.length === 0 ? (
                  <div className="text-gray-300">No payments yet.</div>
                ) : (
                  <motion.table
                    className="w-full text-left text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <thead>
                      <tr>
                        <th className="py-2">Date</th>
                        <th className="py-2">Plan</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Method</th>
                        <th className="py-2">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((p, i) => (
                        <motion.tr
                          key={i}
                          className="border-t border-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.4 }}
                        >
                          <td className="py-2">{new Date(p.date).toLocaleString()}</td>
                          <td className="py-2">{p.plan}</td>
                          <td className="py-2">${p.price}</td>
                          <td className="py-2">{p.method}</td>
                          <td className="py-2 break-all">{p.txIdOrRef}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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