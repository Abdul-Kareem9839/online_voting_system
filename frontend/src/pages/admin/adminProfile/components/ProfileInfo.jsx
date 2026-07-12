import { User, Mail, Lock } from "lucide-react";

export default function ({
  data,
  showPasswordForm,
  setShowPasswordForm,
  errorMsg,
  setErrorMsg,
  passwords,
  setPasswords,
  handlePasswordChange,
  saving,
}) {
  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-6 bg-surface border-light">
          <h2 className="font-display text-xl font-bold text-ink mb-6 section-divider">
            Admin Profile
          </h2>

          <div className="flex items-center gap-5 mb-6">
            <div className="w-14 h-14 rounded-md bg-surface-alt border border-light flex items-center justify-center text-ink shadow-sm">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink leading-none">
                {data?.admin?.username}
              </h3>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted mt-1.5">
                System Administrator
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3.5 bg-surface-alt/60 border border-light/70 rounded-md">
              <User size={15} className="text-muted" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                  Username
                </p>
                <p className="text-xs font-semibold text-ink mt-0.5">
                  {data?.admin?.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-surface-alt/60 border border-light/70 rounded-md">
              <Mail size={15} className="text-muted" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                  Email Registry
                </p>
                <p className="text-xs font-semibold text-ink mt-0.5">
                  {data?.admin?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-surface border-light">
          <div className="flex justify-between items-center mb-4 section-divider">
            <h2 className="font-display text-base font-bold text-ink">
              Security Configuration
            </h2>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setErrorMsg("");
              }}
              className="text-[10px] uppercase tracking-widest font-extrabold text-ink hover:underline transition-all"
            >
              {showPasswordForm ? "[ Cancel ]" : "[ Modify ]"}
            </button>
          </div>

          {!showPasswordForm ? (
            <div className="flex items-center gap-3 p-3.5 bg-surface-alt/30 border border-light/50 rounded-md">
              <Lock size={15} className="text-muted" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                  Access Key
                </p>
                <p className="text-xs font-mono text-muted/80 tracking-widest mt-0.5">
                  ••••••••••••
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {errorMsg && (
                <p className="text-xs font-semibold text-accent bg-surface-alt border border-light p-2.5 rounded-md uppercase tracking-wide">
                  {errorMsg}
                </p>
              )}

              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current authentication key"
                  value={passwords.old_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      old_password: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-medium bg-surface-alt border border-light rounded-md p-3 text-ink placeholder-muted/60 focus:outline-none focus:border-ink transition-colors"
                />

                <input
                  type="password"
                  placeholder="New token sequence"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-medium bg-surface-alt border border-light rounded-md p-3 text-ink placeholder-muted/60 focus:outline-none focus:border-ink transition-colors"
                />

                <input
                  type="password"
                  placeholder="Re-verify token sequence"
                  value={passwords.confirm_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-medium bg-surface-alt border border-light rounded-md p-3 text-ink placeholder-muted/60 focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="btn text-xs uppercase tracking-wider font-bold !py-3 rounded shadow-none transition-transform active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Updating Security Matrix..." : "Commit Key Change"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
