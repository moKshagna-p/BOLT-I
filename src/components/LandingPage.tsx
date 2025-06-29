import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <motion.iframe
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        src="https://my.spline.design/claritystream-JpUpqbw8oQFygpyQwZjcpolL/"
        frameBorder="0"
        className="absolute inset-0 w-full h-full"
        title="Spline Background"
      />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <motion.button
          onClick={handleGetStarted}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative group px-6 py-2.5 text-sm bg-[#0ea5e9]/20 hover:bg-[#0ea5e9]/30 text-white/90 font-medium rounded-full 
          transition-all duration-300 transform hover:scale-102 mt-[5vh]
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-white/10 before:to-transparent
          after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-b after:from-white/5 after:to-transparent
          shadow-[0_0_15px_rgba(14,165,233,0.2)]
          hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]
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
