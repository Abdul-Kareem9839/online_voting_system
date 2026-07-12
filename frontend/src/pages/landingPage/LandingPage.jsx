import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shield, Lock, Mail, Camera, CheckCircle2 } from "lucide-react";
import AdminLoginPopup from "./components/AdminLoginPopup";
import FeaturesSection from "./components/FeaturesSection";
import HowWorkSection from "./components/HowWorkSection";
import ContactSection from "./components/ContactSection";
import Navbar from "./components/Navbar";
import PortalCardsSection from "./components/PortalCardsSection";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import AboutSection from "./components/AboutSection";

export default function Landing() {
  const navigate = useNavigate();
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const featuresRef = useRef(null);
  const howRef = useRef(null);
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState("");

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  const portals = [
    {
      code: "VOTER",
      title: "Voter portal",
      desc: "Register, verify your identity, and cast your vote.",
      icon: <Users className="w-6 h-6" />,
      route: "/voters/login",
      buttonText: "Voter login",
      features: ["OTP-secured login", "Face-verified voting", "Voting history"],
    },
    {
      code: "ADMIN",
      title: "Admin portal",
      desc: "Run elections, manage voter rolls, declare results.",
      icon: <Shield className="w-6 h-6" />,
      route: "/admins/login",
      buttonText: "Admin login",
      features: ["Create elections", "Upload voter rolls", "Declare results"],
    },
  ];

  const features = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "OTP authentication",
      desc: "A one-time code is sent to your registered email for every login.",
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Face verification",
      desc: "Your identity is confirmed against your registered face before a ballot opens.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "One vote, enforced",
      desc: "The database itself blocks a second vote — not just the interface.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Open results",
      desc: "Turnout, candidate counts, and winning margins are published after declaration.",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Get added to the roll",
      desc: "An election admin registers your name and voter ID before voting opens.",
    },
    {
      n: "02",
      title: "Confirm it's you",
      desc: "Verify your email with an OTP, then register your face once.",
    },
    {
      n: "03",
      title: "Cast your ballot",
      desc: "Log in with OTP, verify your face, choose a candidate, confirm.",
    },
    {
      n: "04",
      title: "See the outcome",
      desc: "Once declared, view turnout and the result for your constituency.",
    },
  ];

  const handlePortalClick = (portal) => {
    if (portal.code === "ADMIN") {
      setPendingRoute(portal.route);
      setIsAdminPopupOpen(true);
    } else {
      navigate(portal.route);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#EDEAE3", color: "#15191F" }}
    >
      {/* Navbar */}
      <Navbar
        howRef={howRef}
        homeRef={homeRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
        featuresRef={featuresRef}
        navigate={navigate}
        scrollTo={scrollTo}
      />

      {/* Hero */}
      <section ref={homeRef} className="pt-20 pb-24 px-6 max-w-6xl mx-auto">
        <HeroSection />

        {/* Portal stubs — signature element */}
        <PortalCardsSection
          portals={portals}
          handlePortalClick={handlePortalClick}
        />

        <AdminLoginPopup
          isOpen={isAdminPopupOpen}
          onClose={() => setIsAdminPopupOpen(false)}
          targetRoute={pendingRoute}
        />
      </section>

      {/* About */}
      <AboutSection aboutRef={aboutRef} />

      {/* How it works */}
      <HowWorkSection steps={steps} howRef={howRef} />

      {/* Features / security */}
      <FeaturesSection features={features} featuresRef={featuresRef} />

      {/* Contact */}
      <ContactSection contactRef={contactRef} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
