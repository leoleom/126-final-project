import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import SettingsNavbar from "../components/SettingsNavbar";

function Settings({ user, setUser }) {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(
    user?.display_name || user?.username || ""
  );
  const [email, setEmail] = useState(user?.email || "leolem@up.edu.ph");
  const [bio, setBio] = useState(
    user?.bio || "Ako ay may lobo. Lumipad sa langit."
  );
  const [profilePicture, setProfilePicture] = useState(
    user?.avatar_url || ""
  );

  async function handleProfilePictureChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfilePicture(previewUrl);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error(error);
      alert("Upload failed.");
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setProfilePicture(data.publicUrl);
  }

  async function handleSave() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            bio,
            avatar_url: profilePicture,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert( data.error ?? "Failed to save profile");
        return;
      }

      setUser({
        ...user,
        display_name: data.display_name,
        username: data.username,
        bio: data.bio,
        avatar_url: data.avatar_url,
      });

      alert("Settings saved.");
    } catch (error) {
      console.error(error);
      alert("Failed to save profile");
    }
  }

  function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    setUser(null);
    alert("Account deleted.");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1020px] grid-cols-[260px_1fr] bg-white">
        <SettingsNavbar setUser={setUser} />

        <main className="px-16 py-20">
          <h1 className="text-3xl font-extrabold text-[#1f2937]">
            Account
          </h1>

          <p className="mt-3 text-sm text-[#111827]">
            Manage your account settings
          </p>

          <section className="mt-10 max-w-[560px]">
            <div>
              <label className="text-sm font-extrabold text-[#111827]">
                Display Name
              </label>

              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#d1d5db] px-4 text-sm outline-none focus:border-[#3f6f4f]"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-extrabold text-[#111827]">
                UPV Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#d1d5db] px-4 text-sm outline-none focus:border-[#3f6f4f]"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-extrabold text-[#111827]">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 min-h-[170px] w-full rounded-lg border border-[#d1d5db] px-4 py-4 text-sm outline-none focus:border-[#3f6f4f]"
              />
            </div>

            <div className="mt-10">
              <p className="text-sm font-extrabold text-[#111827]">
                Profile Picture
              </p>

              <div className="mt-6 flex items-center gap-10">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="h-36 w-36 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-36 w-36 rounded-full bg-[#d1d5db]" />
                )}

                <label className="flex h-10 cursor-pointer items-center rounded-lg border border-[#e5e7eb] bg-white px-8 text-sm font-extrabold text-[#111827]">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-5">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="h-11 rounded-lg border border-[#e5e7eb] bg-white px-8 text-sm font-extrabold text-red-500"
              >
                Delete Account
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-11 rounded-lg bg-[#3f6f4f] px-8 text-sm font-extrabold text-white"
              >
                Save Changes
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;