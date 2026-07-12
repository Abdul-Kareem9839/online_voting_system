import { TrendingUp } from "lucide-react";

export default function WelcomeCard({ data }) {
  return (
    <>
      <div className="bg-ink p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl mt-1 text-paper">
              Welcome back, {data?.admin?.username}
            </h2>
            <p
              className="font-body text-sm mt-1 text-muted"
              style={{ color: "#9C9A8E" }}
            >
              Here's what's happening with your elections today.
            </p>
          </div>
          <div
            className="p-3 hidden md:block"
            style={{ border: "1px solid rgba(237,234,227,0.15)" }}
          >
            <TrendingUp className="h-6 w-6 text-paper" />
          </div>
        </div>
      </div>
      ;
    </>
  );
}
