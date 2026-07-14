import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar({
  howRef,
  homeRef,
  aboutRef,
  contactRef,
  featuresRef,
  navigate,
  scrollTo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleScroll = (ref) => {
    scrollTo(ref);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 font-body"
      style={{
        background: "rgba(237,234,227,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #D8D4C8",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => handleScroll(homeRef)}
          className="font-display text-xl tracking-tight"
          style={{ color: "#1C2541" }}
        >
          Civic<span style={{ color: "#9C2B2B" }}>Vote</span>
        </button>

        {/* Desktop Navigation */}
        <div
          className="hidden md:flex items-center gap-8 text-sm"
          style={{ color: "#4A4A45" }}
        >
          <button
            onClick={() => handleScroll(homeRef)}
            className="hover:opacity-70 transition"
          >
            Home
          </button>

          <button
            onClick={() => handleScroll(aboutRef)}
            className="hover:opacity-70 transition"
          >
            About
          </button>

          <button
            onClick={() => handleScroll(howRef)}
            className="hover:opacity-70 transition"
          >
            How it works
          </button>

          <button
            onClick={() => handleScroll(featuresRef)}
            className="hover:opacity-70 transition"
          >
            Security
          </button>

          <button
            onClick={() => handleScroll(contactRef)}
            className="hover:opacity-70 transition"
          >
            Contact
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-90"
            style={{
              background: "#1C2541",
              color: "#EDEAE3",
            }}
          >
            Register to vote
          </button>
        </div>

        {/* Mobile Navigation */}
        <div ref={menuRef} className="relative md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            className="flex items-center justify-center h-10 w-10 rounded-full transition hover:bg-stone-200 active:scale-95"
            style={{ color: "#1C2541" }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <MobileMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            homeRef={homeRef}
            aboutRef={aboutRef}
            howRef={howRef}
            featuresRef={featuresRef}
            contactRef={contactRef}
            navigate={navigate}
            scrollTo={scrollTo}
          />
        </div>
      </div>
    </nav>
  );
}
