import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Building2, Users, DollarSign, TrendingUp, Star, Briefcase, Zap } from "lucide-react";

const RoleCard = styled(motion.div)<{ $selected: boolean }>`
  background: rgba(18, 18, 18, 0.85);
  border: 1.5px solid ${props => props.$selected ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.18)'};
  box-shadow: ${props => props.$selected 
    ? '0 8px 32px 0 rgba(139, 92, 246, 0.3)' 
    : '0 8px 32px 0 rgba(31, 38, 135, 0.18)'};
  backdrop-filter: blur(16px);
  border-radius: 2rem;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$selected 
      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))' 
      : 'transparent'};
    opacity: ${props => props.$selected ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-4px);
  }
`;

const ContinueButton = styled(motion.button)`
  background: linear-gradient(135deg, #a21caf 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'startup' | 'investor' | null>(null);

  const handleRoleSelect = (role: 'startup' | 'investor') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (selectedRole) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Store role in backend
        const response = await fetch('http://localhost:3001/api/user/role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: selectedRole })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save role');
        }

        // Navigate to details page based on role
        if (selectedRole === 'startup') {
          navigate('/startup-details');
        } else {
          navigate('/investor-details');
        }

      } catch (error) {
        console.error('Error saving role:', error);
        // Instead, just navigate based on role
        if (selectedRole === 'startup') {
          navigate('/startup-details');
        } else {
          navigate('/investor-details');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Background gradient effects */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Choose Your Role
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tell us about yourself so we can personalize your experience and connect you with the right opportunities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-8">
          {/* Startup Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RoleCard
              $selected={selectedRole === 'startup'}
              onClick={() => handleRoleSelect('startup')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-600/20 rounded-xl">
                    <Building2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">Startup</h2>
                    <p className="text-purple-300 text-sm">Growing your business</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  You're building something amazing and looking for funding, mentorship, or strategic partnerships to scale your business.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Connect with investors and mentors</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <span>Access funding opportunities</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Track your growth metrics</span>
                  </div>
                </div>

                {selectedRole === 'startup' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </motion.div>
                )}
              </div>
            </RoleCard>
          </motion.div>

          {/* Investor Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RoleCard
              $selected={selectedRole === 'investor'}
              onClick={() => handleRoleSelect('investor')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-600/20 rounded-xl">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">Investor</h2>
                    <p className="text-purple-300 text-sm">Funding the future</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  You're looking for promising startups to invest in, mentor, or partner with to build the next big thing.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <span>Discover promising startups</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <span>Manage your investment portfolio</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Track deal flow and metrics</span>
                  </div>
                </div>

                {selectedRole === 'investor' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </motion.div>
                )}
              </div>
            </RoleCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ContinueButton
            onClick={handleContinue}
            disabled={!selectedRole}
            whileHover={selectedRole ? { scale: 1.05 } : {}}
            whileTap={selectedRole ? { scale: 0.95 } : {}}
          >
            Continue
          </ContinueButton>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectionPage; 