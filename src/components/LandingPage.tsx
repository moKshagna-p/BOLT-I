import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import bgVideo from '../bg.mp4';

const LandingPage: FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        src={bgVideo}
      />

      {/* Content Overlay */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center">
        <h1
          className="text-6xl md:text-7xl font-extrabold text-white mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent text-center drop-shadow-lg"
          style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: 900, letterSpacing: '-0.03em' }}
        >
          PitchNest
        </h1>
        <motion.button
          onClick={handleGetStarted}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative group px-12 py-6 text-2xl md:text-3xl bg-[#0ea5e9]/20 hover:bg-[#0ea5e9]/30 text-white/90 font-semibold rounded-full 
          transition-all duration-300 transform hover:scale-105 mt-[5vh]
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-white/10 before:to-transparent
          after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-b after:from-white/5 after:to-transparent
          shadow-[0_0_24px_rgba(14,165,233,0.25)]
          hover:shadow-[0_0_40px_rgba(14,165,233,0.5)]
          hover:ring-2 hover:ring-[#0ea5e9]/40
          backdrop-blur-[2px] border border-white/20"
        >
          <motion.span
            className="relative z-10 flex items-center gap-2"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;
