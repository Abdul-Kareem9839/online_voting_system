export default function Navbar({
  howRef,
  homeRef,
  aboutRef,
  contactRef,
  featuresRef,
  navigate,
  scrollTo,
}) {
  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 font-body"
        style={{
          background: "rgba(237,234,227,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #D8D4C8",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => scrollTo(homeRef)}
            className="font-display text-lg tracking-tight"
            style={{ color: "#1C2541" }}
          >
            Civic<span style={{ color: "#9C2B2B" }}>Vote</span>
          </button>

          <div
            className="hidden md:flex items-center gap-8 text-sm"
            style={{ color: "#4A4A45" }}
          >
            <button
              onClick={() => scrollTo(homeRef)}
              className="hover:opacity-70 transition-opacity"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo(aboutRef)}
              className="hover:opacity-70 transition-opacity"
            >
              About
            </button>
            <button
              onClick={() => scrollTo(howRef)}
              className="hover:opacity-70 transition-opacity"
            >
              How it works
            </button>
            <button
              onClick={() => scrollTo(featuresRef)}
              className="hover:opacity-70 transition-opacity"
            >
              Security
            </button>
            <button
              onClick={() => scrollTo(contactRef)}
              className="hover:opacity-70 transition-opacity"
            >
              Contact
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded text-sm font-medium transition-colors"
              style={{ background: "#1C2541", color: "#EDEAE3" }}
            >
              Register to vote
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
