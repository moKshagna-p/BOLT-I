import React, { useState } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Star, Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import styled from "styled-components";

const Card = styled(motion.div)`
  position: absolute;
  width: 100%;
  max-width: 400px;
  height: 500px;
  background: rgba(18, 18, 18, 0.85);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(16px);
  border-radius: 2rem;
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const CardImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 60%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ActionButton = styled(motion.button)<{ $variant: 'like' | 'dislike' }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${props => props.$variant === 'like' 
    ? 'linear-gradient(135deg, #10b981, #059669)' 
    : 'linear-gradient(135deg, #ef4444, #dc2626)'};
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

interface CardData {
  id: number;
  name: string;
  type: 'startup' | 'investor';
  company: string;
  description: string;
  image: string;
  stage?: string;
  industry?: string;
  funding?: string;
  teamSize?: number;
  revenue?: string;
  investmentFocus?: string[];
  portfolioSize?: string;
  tags: string[];
}

const sampleData: CardData[] = [
  {
    id: 1,
    name: "Sarah Chen",
    type: "investor",
    company: "Sequoia Capital",
    description: "Partner at Sequoia Capital focusing on early-stage SaaS and fintech investments. Looking for companies with strong unit economics and product-market fit.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
    investmentFocus: ["SaaS", "Fintech", "AI/ML"],
    portfolioSize: "$2.5B AUM",
    tags: ["Series A", "B2B", "Enterprise"]
  },
  {
    id: 2,
    name: "TechFlow Solutions",
    type: "startup",
    company: "TechFlow Solutions",
    description: "AI-powered workflow automation platform helping enterprises streamline operations. 300% YoY growth with $2M ARR.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    stage: "Series A",
    industry: "Enterprise SaaS",
    funding: "Seeking $5M",
    teamSize: 25,
    revenue: "$2M ARR",
    tags: ["AI", "Automation", "Enterprise"]
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    type: "investor",
    company: "Andreessen Horowitz",
    description: "General Partner at a16z with 15+ years in venture capital. Specializes in consumer tech and marketplace platforms.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    investmentFocus: ["Consumer Tech", "Marketplaces", "Social"],
    portfolioSize: "$35B AUM",
    tags: ["Consumer", "Marketplace", "Social"]
  },
  {
    id: 4,
    name: "GreenEats",
    type: "startup",
    company: "GreenEats",
    description: "Plant-based meal delivery service with proprietary AI nutrition planning. 50,000+ active subscribers across 15 cities.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    stage: "Series B",
    industry: "Food Tech",
    funding: "Seeking $15M",
    teamSize: 45,
    revenue: "$8M ARR",
    tags: ["Food Tech", "Sustainability", "AI"]
  },
  {
    id: 5,
    name: "Dr. Emily Watson",
    type: "investor",
    company: "Kleiner Perkins",
    description: "Partner at Kleiner Perkins focusing on healthcare and biotech investments. MD with 20+ years in healthcare innovation.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
    investmentFocus: ["Healthcare", "Biotech", "MedTech"],
    portfolioSize: "$12B AUM",
    tags: ["Healthcare", "Biotech", "MedTech"]
  }
];

const TinderPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [likedCards, setLikedCards] = useState<number[]>([]);
  const [dislikedCards, setDislikedCards] = useState<number[]>([]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      handleLike();
    } else if (info.offset.x < -swipeThreshold) {
      handleDislike();
    }
  };

  const handleLike = () => {
    setDirection(1);
    setLikedCards(prev => [...prev, sampleData[currentIndex].id]);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(0);
      x.set(0);
    }, 200);
  };

  const handleDislike = () => {
    setDirection(-1);
    setDislikedCards(prev => [...prev, sampleData[currentIndex].id]);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(0);
      x.set(0);
    }, 200);
  };

  const currentCard = sampleData[currentIndex];

  if (!currentCard) {
    return (
      <div className="pt-20 min-h-screen bg-[#121212] relative flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-100 mb-4"
          >
            No more cards!
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mb-8"
          >
            You've seen all available matches. Check back later for new opportunities.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => {
              setCurrentIndex(0);
              setLikedCards([]);
              setDislikedCards([]);
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
          >
            Start Over
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Background gradient effects */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {currentCard.type === 'startup' ? 'Find Investors' : 'Discover Startups'}
          </h1>
          <p className="text-gray-400">
            Swipe right to like, left to pass
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md h-[500px]">
            <Card
              style={{
                x,
                rotate,
                opacity,
                zIndex: 10,
              }}
              drag="x"
              dragConstraints={{ left: -200, right: 200 }}
              onDragEnd={handleDragEnd}
              animate={{
                x: direction * 500,
                opacity: direction !== 0 ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <CardImage $imageUrl={currentCard.image}>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-purple-300" />
                    <span className="text-white font-semibold text-sm">
                      {currentCard.company}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentCard.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardImage>

              <CardContent>
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mb-2">
                    {currentCard.name}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {currentCard.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  {currentCard.type === 'startup' ? (
                    <>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{currentCard.teamSize} team</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{currentCard.revenue}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{currentCard.stage}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{currentCard.portfolioSize}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{currentCard.investmentFocus?.slice(0, 2).join(', ')}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
              <ActionButton
                $variant="dislike"
                onClick={handleDislike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </ActionButton>
              
              <ActionButton
                $variant="like"
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart />
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mt-8">
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-green-400">
              <div className="font-semibold">{likedCards.length}</div>
              <div>Liked</div>
            </div>
            <div className="text-red-400">
              <div className="font-semibold">{dislikedCards.length}</div>
              <div>Passed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinderPage; 