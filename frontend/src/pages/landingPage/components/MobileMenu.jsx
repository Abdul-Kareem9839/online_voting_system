import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  homeRef,
  aboutRef,
  howRef,
  featuresRef,
  contactRef,
  navigate,
  scrollTo,
}) {
  const handleScroll = (ref) => {
    scrollTo(ref);
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const menuItems = [
    { label: "Home", action: () => handleScroll(homeRef) },
    { label: "About", action: () => handleScroll(aboutRef) },
    { label: "How it works", action: () => handleScroll(howRef) },
    { label: "Security", action: () => handleScroll(featuresRef) },
    { label: "Contact", action: () => handleScroll(contactRef) },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-stone-400 bg-paper shadow-2xl"
        >
          {/* Navigation Links */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full px-5 py-3 text-left text-[15px] font-medium text-stone-700 transition-all duration-200 hover:bg-stone-100 hover:text-[#1C2541]"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-stone-200" />

          {/* Register Button */}
          <div className="p-4">
            <button
              onClick={() => handleNavigate("/register")}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              style={{
                background: "#1C2541",
              }}
            >
              Register to Vote
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
