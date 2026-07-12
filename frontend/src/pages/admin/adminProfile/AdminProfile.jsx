import { useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import { API_URL } from "../../../../config/api";


export default function AdminProfile({ data }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = async () => {
    setErrorMsg("");

    if (
      !passwords.old_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      return setErrorMsg("All fields are required");
    }

    if (passwords.new_password !== passwords.confirm_password) {
      return setErrorMsg("New passwords do not match");
    }

    if (passwords.new_password.length < 6) {
      return setErrorMsg("Password must be at least 6 characters");
    }

    try {
      setSaving(true);

      const res = await fetch(
        `${API_URL}/admins/change-password`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            old_password: passwords.old_password,
            new_password: passwords.new_password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update password");

      alert("Password updated successfully");
      setShowPasswordForm(false);
      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setErrorMsg("SOORRYYYY......, lets do it later");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileInfo
        data={data}
        showPasswordForm={showPasswordForm}
        setShowPasswordForm={setShowPasswordForm}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        passwords={passwords}
        setPasswords={setPasswords}
        saving={saving}
        handlePasswordChange={handlePasswordChange}
      />
    </>
  );
}