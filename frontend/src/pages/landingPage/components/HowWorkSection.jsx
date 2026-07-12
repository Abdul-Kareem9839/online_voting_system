import { motion } from "framer-motion";

export default function ({ howRef, steps }) {
  return (
    <>
      <section ref={howRef} className="px-6 py-24 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl" style={{ color: "#1C2541" }}>
            How a vote gets cast
          </h2>
          <span
            className="font-body text-sm hidden md:block"
            style={{ color: "#9C9A8E" }}
          >
            Four steps, in order
          </span>
        </div>

        <div
          className="grid md:grid-cols-4 gap-px"
          style={{ background: "#D8D4C8" }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6"
              style={{ background: "#EDEAE3" }}
            >
              <span
                className="font-display text-3xl"
                style={{ color: "#D8B8B8" }}
              >
                {s.n}
              </span>
              <h3
                className="font-body font-medium mt-3"
                style={{ color: "#1C2541" }}
              >
                {s.title}
              </h3>
              <p
                className="font-body text-sm mt-2"
                style={{ color: "#6B6A63" }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
