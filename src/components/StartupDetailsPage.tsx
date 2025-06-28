import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Building2, DollarSign, Users, TrendingUp, ArrowRight } from "lucide-react";

const FormCard = styled(motion.div)`
  background: rgba(18, 18, 18, 0.85);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(16px);
  border-radius: 2rem;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #e5e7eb;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: rgba(139, 92, 246, 0.4);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: rgba(139, 92, 246, 0.4);
  }

  option {
    background: #1f2937;
    color: #fff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: rgba(139, 92, 246, 0.4);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const SubmitButton = styled(motion.button)`
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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

const StartupDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    stage: "",
    description: "",
    teamSize: "",
    monthlyRevenue: "",
    fundingNeeded: "",
    website: "",
    location: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Store startup details in backend
      const response = await fetch('http://localhost:3001/api/user/startup-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save startup details');
      }

      // Store startup details in localStorage as well for quick access
      localStorage.setItem('startupDetails', JSON.stringify(formData));
      
      // Navigate to analytics page
      navigate('/analytics');

    } catch (error) {
      console.error('Error saving startup details:', error);
      // Fallback to localStorage and continue
      localStorage.setItem('startupDetails', JSON.stringify(formData));
      navigate('/analytics');
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

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100">
              Tell Us About Your Startup
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Help us understand your business better so we can connect you with the right investors and opportunities.
          </p>
        </motion.div>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <InputGroup>
                <Label>Company Name *</Label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>Industry *</Label>
                <Select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select industry</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="EdTech">EdTech</option>
                  <option value="Food Tech">Food Tech</option>
                  <option value="Other">Other</option>
                </Select>
              </InputGroup>
            </div>

            <InputGroup>
              <Label>Company Stage *</Label>
              <Select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
              >
                <option value="">Select stage</option>
                <option value="Pre-seed">Pre-seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Growth">Growth</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Company Description *</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your business, what problem you're solving, and your unique value proposition..."
                required
              />
            </InputGroup>

            <div className="grid md:grid-cols-2 gap-4">
              <InputGroup>
                <Label>Team Size</Label>
                <Input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  placeholder="Number of employees"
                />
              </InputGroup>

              <InputGroup>
                <Label>Monthly Revenue</Label>
                <Input
                  type="text"
                  name="monthlyRevenue"
                  value={formData.monthlyRevenue}
                  onChange={handleChange}
                  placeholder="e.g., $50K, $100K+"
                />
              </InputGroup>
            </div>

            <InputGroup>
              <Label>Funding Needed</Label>
              <Input
                type="text"
                name="fundingNeeded"
                value={formData.fundingNeeded}
                onChange={handleChange}
                placeholder="e.g., $500K, $1M, $5M"
              />
            </InputGroup>

            <div className="grid md:grid-cols-2 gap-4">
              <InputGroup>
                <Label>Website</Label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                />
              </InputGroup>

              <InputGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </InputGroup>
            </div>

            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Complete Setup
              <ArrowRight className="w-4 h-4" />
            </SubmitButton>
          </form>
        </FormCard>
      </div>
    </div>
  );
};

export default StartupDetailsPage; 