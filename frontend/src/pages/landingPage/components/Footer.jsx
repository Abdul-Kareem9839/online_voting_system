export default function Footer() {
  return (
    <>
      <footer className="px-6 py-8" style={{ borderTop: "1px solid #D8D4C8" }}>
        <div
          className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-body text-xs"
          style={{ color: "#9C9A8E" }}
        >
          <span>
            © {new Date().getFullYear()} CivicVote — secure online voting, demo
            build
          </span>
          <span>Not affiliated with any government body</span>
        </div>
      </footer>
    </>
  );
}
