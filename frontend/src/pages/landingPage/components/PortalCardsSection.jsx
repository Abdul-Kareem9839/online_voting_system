import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PortalCardsSection({ portals, handlePortalClick }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mt-16">
        {portals.map((portal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => handlePortalClick(portal)}
            className="stub relative cursor-pointer group"
            style={{ background: "#FAF8F3", border: "1px solid #D8D4C8" }}
          >
            <div className="pl-8 pr-7 py-7">
              <div className="flex items-start justify-between">
                <span
                  className="font-body text-xs tracking-[0.15em]"
                  style={{ color: "#9C9A8E" }}
                >
                  {portal.code}
                </span>
                <div style={{ color: "#1C2541" }}>{portal.icon}</div>
              </div>

              <h3
                className="font-display text-2xl mt-4"
                style={{ color: "#1C2541" }}
              >
                {portal.title}
              </h3>
              <p
                className="font-body text-sm mt-2"
                style={{ color: "#4A4A45" }}
              >
                {portal.desc}
              </p>

              <div className="font-body mt-5 space-y-1.5">
                {portal.features.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "#6B6A63" }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        background: "#9C2B2B",
                        borderRadius: "50%",
                      }}
                    />
                    {f}
                  </div>
                ))}
              </div>

              <div
                className="font-body mt-6 inline-flex items-center gap-1.5 text-sm font-medium pb-1 border-b group-hover:gap-2.5 transition-all"
                style={{ color: "#9C2B2B", borderColor: "#9C2B2B" }}
              >
                {portal.buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
