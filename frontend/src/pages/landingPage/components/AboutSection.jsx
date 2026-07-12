export default function AboutSection({ aboutRef }) {
  return (
    <>
      <section
        ref={aboutRef}
        className="px-6 py-20"
        style={{ background: "#1C2541" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span
              className="font-body text-xs tracking-[0.2em] uppercase"
              style={{ color: "#B8915C" }}
            >
              About
            </span>
            <h2
              className="font-display text-3xl mt-4"
              style={{ color: "#EDEAE3" }}
            >
              Built for a single constituency or a national election.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p
              className="font-body leading-relaxed"
              style={{ color: "#C7C5BC" }}
            >
              Every election starts with an admin-curated voter roll — no one
              registers themselves into an election they weren't added to. From
              there, each voter confirms their email, registers their face once,
              and votes from their own device when their constituency opens.
              Results are counted automatically and published only once an admin
              declares them.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
