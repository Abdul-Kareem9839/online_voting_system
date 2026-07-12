import { Mail, ArrowUpRight, Instagram, Github, Linkedin } from "lucide-react";

export default function Contact({ contactRef }) {
  return (
    <>
      <section ref={contactRef} className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <span
              className="font-body text-xs tracking-[0.2em] uppercase"
              style={{ color: "#9C2B2B" }}
            >
              Contact
            </span>
            <h2
              className="font-display text-3xl mt-4"
              style={{ color: "#1C2541" }}
            >
              Questions about an election?
            </h2>
            <p className="font-body text-sm mt-4" style={{ color: "#6B6A63" }}>
              This is a project build, not a government service — reach out
              directly for anything election or account related.
            </p>
          </div>

          <div
            className="md:col-span-6 md:col-start-7 font-body text-sm space-y-8"
            style={{ color: "#4A4A45" }}
          >
            {/* Primary Contact: Email */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.15em] text-gray-400 block font-medium">
                Email Us
              </span>
              <a
                href="mailto:civiconlinevoting@gmail.com"
                className="flex items-center gap-2 hover:opacity-70 transition-opacity w-fit text-base font-medium"
                style={{ color: "#1C2541" }}
              >
                <Mail className="w-4 h-4" />
                civiconlinevoting@gmail.com
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* Secondary Contact: Socials */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.15em] text-gray-400 block font-medium">
                Connect With Us
              </span>
              <div className="flex items-center gap-5">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200"
                  style={{ color: "#1C2541" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9C2B2B")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1C2541")
                  }
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200"
                  style={{ color: "#1C2541" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9C2B2B")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1C2541")
                  }
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200"
                  style={{ color: "#1C2541" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9C2B2B")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1C2541")
                  }
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
