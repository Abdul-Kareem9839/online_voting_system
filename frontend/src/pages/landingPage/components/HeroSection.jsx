import { motion } from "framer-motion";
import { CheckCircle2, Camera, Lock } from "lucide-react";
import flowImage from "../../../assets/Integrity.png";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function HeroSection() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-12 gap-12 items-end"
    >
      {/* Left Content */}
      <div className="md:col-span-8">
        <motion.span
          variants={item}
          className="text-xs uppercase tracking-[0.22em] text-[#9C2B2B]"
        >
          Online Voting System
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display mt-4 text-5xl md:text-6xl leading-[1.05]"
        >
          A ballot you can trust.
          <br />
          Run end to end.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-lg text-lg leading-8 text-[#4A4A45]"
        >
          Voter registration, identity verification, secure ballot casting, and
          transparent counting—managed in one place, with a verified voter
          behind every vote.
        </motion.p>
      </div>

      {/* Right Content */}
      <motion.div
        variants={container}
        className="md:col-span-4 text-sm text-[#4A4A45]"
      >
        <motion.div
          variants={item}
          className="mb-5 border-t border-[#D8D4C8] pt-5"
        >
          <div className="relative">
            <img
              src={flowImage}
              alt="Election integrity"
              className="w-full max-w-[340px] h-auto mx-auto object-contain"
            />

            {/* Optional subtle glow */}
            <div className="absolute inset-0 -z-10 rounded-full bg-[#D8D4C8]/30 blur-3xl"></div>
          </div>
          <p className="uppercase tracking-[0.18em] text-xs text-[#9C2B2B]">
            Election Integrity
          </p>
        </motion.div>

        <div className="space-y-3 mt-2">
          <motion.div variants={item} className="flex items-start gap-3">
            <Lock className="w-5 h-5 mt-0.5 text-[#5C7461]" />
            <span>Encrypted administrator and voter sessions</span>
          </motion.div>

          <motion.div variants={item} className="flex items-start gap-3">
            <Camera className="w-5 h-5 mt-0.5 text-[#5C7461]" />
            <span>Face verification before ballot access</span>
          </motion.div>

          <motion.div variants={item} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-[#5C7461]" />
            <span>One verified vote per eligible voter</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
