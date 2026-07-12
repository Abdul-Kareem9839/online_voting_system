import { motion } from "framer-motion";

export default function ({ features, featuresRef }) {
  return (
    <>
      <section
        ref={featuresRef}
        className="px-6 py-24"
        style={{
          background: "#FAF8F3",
          borderTop: "1px solid #D8D4C8",
          borderBottom: "1px solid #D8D4C8",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-3xl mb-12"
            style={{ color: "#1C2541" }}
          >
            What keeps a vote honest
          </h2>
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "#D8D4C8" }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6"
                style={{ background: "#FAF8F3" }}
              >
                <div style={{ color: "#5C7461" }}>{f.icon}</div>
                <h3
                  className="font-body font-medium mt-4"
                  style={{ color: "#1C2541" }}
                >
                  {f.title}
                </h3>
                <p
                  className="font-body text-sm mt-2"
                  style={{ color: "#6B6A63" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
