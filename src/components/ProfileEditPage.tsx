import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  User, 
  Building2, 
  DollarSign, 
  MapPin, 
  Globe, 
  Linkedin, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Plus
} from "lucide-react";

const FormCard = styled(motion.div)`
  background: rgba(18, 18, 18, 0.85);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(16px);
  border-radius: 2rem;
  padding: 2.5rem;
  max-width: 800px;
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

const Button = styled(motion.button)`
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

const SecondaryButton = styled(motion.button)`
  background: rgba(139, 92, 246, 0.1);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.5);
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.2)' : 'transparent'};
  color: ${props => props.$active ? '#c084fc' : '#6b7280'};
  border: 1px solid ${props => props.$active ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.1)'};
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #c084fc;
  }
`;

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'startup' | 'investor'>('startup');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [demoMode, setDemoMode] = useState(false);

  // Startup form data
  const [startupData, setStartupData] = useState({
    companyName: "",
    industry: "",
    stage: "",
    description: "",
    teamSize: "",
    monthlyRevenue: "",
    fundingNeeded: "",
    website: "",
    location: "",
    monthlyData: [] as any[]
  });

  // Investor form data
  const [investorData, setInvestorData] = useState({
    fullName: "",
    company: "",
    role: "",
    portfolioSize: "",
    investmentFocus: "",
    preferredStages: "",
    description: "",
    website: "",
    location: "",
    linkedin: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Enable demo mode if no token
          setDemoMode(true);
          setLoading(false);
          return;
        }

        // Try to get user profile
        const profileResponse = await fetch('http://localhost:3001/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserRole(profileData.role || 'startup');
          
          if (profileData.role === 'startup') {
            await loadStartupProfile();
          } else if (profileData.role === 'investor') {
            await loadInvestorProfile();
          }
        } else {
          // Enable demo mode if profile not found
          setDemoMode(true);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const loadStartupProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/business/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStartupData({
          companyName: data.companyName || "",
          industry: data.industry || "",
          stage: data.stage || "",
          description: data.description || "",
          teamSize: data.teamSize?.toString() || "",
          monthlyRevenue: data.monthlyRevenue?.toString() || "",
          fundingNeeded: data.fundingNeeded || "",
          website: data.website || "",
          location: data.location || "",
          monthlyData: data.monthlyData || []
        });
      }
    } catch (error) {
      console.error('Error loading startup profile:', error);
    }
  };

  const loadInvestorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/investor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInvestorData({
          fullName: data.fullName || "",
          company: data.company || "",
          role: data.role || "",
          portfolioSize: data.portfolioSize || "",
          investmentFocus: data.investmentFocus || "",
          preferredStages: data.preferredStages || "",
          description: data.description || "",
          website: data.website || "",
          location: data.location || "",
          linkedin: data.linkedin || ""
        });
      }
    } catch (error) {
      console.error('Error loading investor profile:', error);
    }
  };

  const handleStartupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStartupData({
      ...startupData,
      [e.target.name]: e.target.value
    });
  };

  const handleInvestorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInvestorData({
      ...investorData,
      [e.target.name]: e.target.value
    });
  };

  const handleStartupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (demoMode) {
        // Demo mode - just show success message
        alert('Demo mode: Profile would be saved successfully!');
        setSaving(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/user/startup-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(startupData)
      });

      if (response.ok) {
        alert('Startup profile saved successfully!');
        navigate('/analytics');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save startup profile');
      }
    } catch (error) {
      console.error('Error saving startup profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInvestorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (demoMode) {
        // Demo mode - just show success message
        alert('Demo mode: Profile would be saved successfully!');
        setSaving(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/user/investor-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(investorData)
      });

      if (response.ok) {
        alert('Investor profile saved successfully!');
        navigate('/analytics');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save investor profile');
      }
    } catch (error) {
      console.error('Error saving investor profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: "linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
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
              <User className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100">Edit Profile</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Update your profile information to keep your data current and improve your experience.
          </p>
          {demoMode && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                🧪 Demo Mode: You can test the interface without authentication. 
                <button 
                  onClick={() => navigate('/login')}
                  className="ml-2 underline hover:text-yellow-300"
                >
                  Login to save changes
                </button>
              </p>
            </div>
          )}
        </motion.div>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <TabButton
              $active={activeTab === 'startup'}
              onClick={() => setActiveTab('startup')}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Startup Profile
            </TabButton>
            <TabButton
              $active={activeTab === 'investor'}
              onClick={() => setActiveTab('investor')}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Investor Profile
            </TabButton>
          </div>

          {/* Startup Profile Form */}
          {activeTab === 'startup' && (
            <form onSubmit={handleStartupSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Company Name *</Label>
                  <Input
                    type="text"
                    name="companyName"
                    value={startupData.companyName}
                    onChange={handleStartupChange}
                    placeholder="Enter your company name"
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Industry *</Label>
                  <Select
                    name="industry"
                    value={startupData.industry}
                    onChange={handleStartupChange}
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </Select>
                </InputGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Stage *</Label>
                  <Select
                    name="stage"
                    value={startupData.stage}
                    onChange={handleStartupChange}
                    required
                  >
                    <option value="">Select stage</option>
                    <option value="Idea">Idea Stage</option>
                    <option value="MVP">MVP</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <Label>Team Size</Label>
                  <Input
                    type="number"
                    name="teamSize"
                    value={startupData.teamSize}
                    onChange={handleStartupChange}
                    placeholder="Number of employees"
                  />
                </InputGroup>
              </div>

              <InputGroup>
                <Label>Description *</Label>
                <TextArea
                  name="description"
                  value={startupData.description}
                  onChange={handleStartupChange}
                  placeholder="Describe your business, mission, and value proposition..."
                  required
                />
              </InputGroup>

              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Monthly Revenue</Label>
                  <Input
                    type="number"
                    name="monthlyRevenue"
                    value={startupData.monthlyRevenue}
                    onChange={handleStartupChange}
                    placeholder="Monthly revenue in USD"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Funding Needed</Label>
                  <Input
                    type="text"
                    name="fundingNeeded"
                    value={startupData.fundingNeeded}
                    onChange={handleStartupChange}
                    placeholder="e.g., $500K Series A"
                  />
                </InputGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Website</Label>
                  <Input
                    type="url"
                    name="website"
                    value={startupData.website}
                    onChange={handleStartupChange}
                    placeholder="https://yourcompany.com"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    name="location"
                    value={startupData.location}
                    onChange={handleStartupChange}
                    placeholder="City, Country"
                  />
                </InputGroup>
              </div>

              <div className="flex gap-4">
                <SecondaryButton
                  type="button"
                  onClick={() => navigate('/analytics')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </SecondaryButton>
                <Button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}

          {/* Investor Profile Form */}
          {activeTab === 'investor' && (
            <form onSubmit={handleInvestorSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    name="fullName"
                    value={investorData.fullName}
                    onChange={handleInvestorChange}
                    placeholder="Enter your full name"
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Company/Organization</Label>
                  <Input
                    type="text"
                    name="company"
                    value={investorData.company}
                    onChange={handleInvestorChange}
                    placeholder="Your company or organization"
                  />
                </InputGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Role/Title</Label>
                  <Input
                    type="text"
                    name="role"
                    value={investorData.role}
                    onChange={handleInvestorChange}
                    placeholder="e.g., Partner, Principal, Angel Investor"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Portfolio Size</Label>
                  <Select
                    name="portfolioSize"
                    value={investorData.portfolioSize}
                    onChange={handleInvestorChange}
                  >
                    <option value="">Select portfolio size</option>
                    <option value="<$1M">Less than $1M</option>
                    <option value="$1M-$10M">$1M - $10M</option>
                    <option value="$10M-$50M">$10M - $50M</option>
                    <option value="$50M-$100M">$50M - $100M</option>
                    <option value="$100M-$500M">$100M - $500M</option>
                    <option value=">$500M">More than $500M</option>
                  </Select>
                </InputGroup>
              </div>

              <InputGroup>
                <Label>Investment Focus *</Label>
                <Select
                  name="investmentFocus"
                  value={investorData.investmentFocus}
                  onChange={handleInvestorChange}
                  required
                >
                  <option value="">Select investment focus</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="SaaS">SaaS</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Other">Other</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>Preferred Stages</Label>
                <Select
                  name="preferredStages"
                  value={investorData.preferredStages}
                  onChange={handleInvestorChange}
                >
                  <option value="">Select preferred stages</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C+">Series C+</option>
                  <option value="Growth">Growth</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>Description *</Label>
                <TextArea
                  name="description"
                  value={investorData.description}
                  onChange={handleInvestorChange}
                  placeholder="Describe your investment philosophy, what you look for in startups, and how you prefer to work with founders..."
                  required
                />
              </InputGroup>

              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup>
                  <Label>Website</Label>
                  <Input
                    type="url"
                    name="website"
                    value={investorData.website}
                    onChange={handleInvestorChange}
                    placeholder="https://yourwebsite.com"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>LinkedIn Profile</Label>
                  <Input
                    type="url"
                    name="linkedin"
                    value={investorData.linkedin}
                    onChange={handleInvestorChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </InputGroup>
              </div>

              <InputGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={investorData.location}
                  onChange={handleInvestorChange}
                  placeholder="City, Country"
                />
              </InputGroup>

              <div className="flex gap-4">
                <SecondaryButton
                  type="button"
                  onClick={() => navigate('/analytics')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </SecondaryButton>
                <Button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </FormCard>
      </div>
    </div>
  );
};

export default ProfileEditPage; 