import { useAuthStore } from "../store/authStore";
import { useParams } from "react-router-dom";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaWhatsapp,
} from "react-icons/fa";
import {
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineMessage,
} from "react-icons/ai";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL === "development"
    ? "http://localhost:7000"
    : "https://pulsetag-technologies.onrender.com";

const UserDashboard = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Initialize formData to avoid uncontrolled component issues
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    callNow: "",
    whatsapp: "",
    sms: "",
    location: "",
    profilePicture: "",
    availabilityNote: "",
    socialLinks: [],
    websiteLinks: [],
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  /**
   * Fetch profile data from the backend
   */
  const { id: profileId } = useParams();

  const fetchProfile = useCallback(async () => {
    const id = profileId || user?._id;
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${id}`, {
        headers: isAuthenticated
          ? { Authorization: `Bearer ${user.token}` }
          : undefined,
      });

      if (response.data.success) {
        const profileData = response.data.profile;
        setProfile(profileData);
        setFormData({
          name: profileData.name || "",
          bio: profileData.bio || "",
          email: profileData.email || "",
          callNow: profileData.callNow?.[0] || "",
          whatsapp: profileData.whatsapp || "",
          sms: profileData.sms || "",
          location: profileData.location || "",
          profilePicture: profileData.profilePicture || "",
          availabilityNote: profileData.availabilityNote || "",
          socialLinks: profileData.socialLinks || [],
          websiteLinks: profileData.websiteLinks || [],
        });
        setProfileImagePreview(profileData.profilePicture || null);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle profile not found case
        alert("Profile not found. Please complete your profile setup.");
      } else {
        alert("Failed to fetch profile. Please try again.");
      }
      console.error("Error fetching profile:", error);
      alert("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  }, [profileId, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle social link changes
   */
  const handleSocialLinkChange = (platform, field, value) => {
    setFormData((prev) => {
      const updatedLinks = [...prev.socialLinks];
      const index = updatedLinks.findIndex(
        (link) => link.platform === platform
      );

      if (index !== -1) {
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      } else {
        updatedLinks.push({ platform, [field]: value });
      }

      return { ...prev, socialLinks: updatedLinks };
    });
  };

  const platforms = [
    {
      platform: "linkedin",
      icon: <FaLinkedin className="text-blue-500 text-2xl" />,
      label: "LinkedIn",
    },
    {
      platform: "twitter",
      icon: <FaTwitter className="text-blue-400 text-2xl" />,
      label: "Twitter/X",
    },
    {
      platform: "facebook",
      icon: <FaFacebook className="text-blue-600 text-2xl" />,
      label: "Facebook",
    },
    {
      platform: "instagram",
      icon: <FaInstagram className="text-pink-500 text-2xl" />,
      label: "Instagram",
    },
    {
      platform: "youtube",
      icon: <FaYoutube className="text-red-600 text-2xl" />,
      label: "YouTube",
    },
    {
      platform: "website",
      icon: <FaGlobe className="text-green-400 text-2xl" />,
      label: "Website",
    },
  ];

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { platform: "", url: "", customCTA: "" },
      ],
    });
  };

  const removeSocialLink = (index) => {
    const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  /**
   * Handle website link changes
   */
  const handleWebsiteLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.websiteLinks];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, websiteLinks: updatedLinks });
  };

  const addWebsiteLink = () => {
    setFormData({
      ...formData,
      websiteLinks: [...formData.websiteLinks, { url: "" }],
    });
  };

  const removeWebsiteLink = (index) => {
    const updatedLinks = formData.websiteLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, websiteLinks: updatedLinks });
  };

  /**
   * Save profile data and sync with UI
   */
  const saveProfile = async () => {
    try {
      const payload = {
        profile: {
          ...formData,
          callNow: formData.callNow ? [formData.callNow] : [],
        },
      };

      const response = await axios.put(`${API_BASE_URL}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.data.success) {
        const updatedProfile = response.data.profile;

        // Option 1: Update states directly without re-fetching
        setProfile(updatedProfile);
        setFormData({
          ...updatedProfile,
          callNow: updatedProfile.callNow?.[0] || "",
        });

        // Option 2: Re-fetch profile to ensure data is fully synced
        // await fetchProfile();

        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  /**
   * Handle image upload
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    const imageFormData = new FormData();
    imageFormData.append("profilePicture", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/upload/profile-picture`,
        imageFormData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const newImageUrl = response.data.imageUrl;
      setFormData((prev) => ({ ...prev, profilePicture: newImageUrl }));
      setProfile((prev) => ({ ...prev, profilePicture: newImageUrl }));
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture.");
    }
  };

  /**
   * Generate vCard file
   */
  const generateVCard = () => {
    const { name, callNow, email, whatsapp, sms, location } = formData;

    const vCardContent = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=VOICE:${callNow}
EMAIL:${email}
ADR:${location}
NOTE:WhatsApp: ${whatsapp}, SMS: ${sms}
END:VCARD
`;

    const blob = new Blob([vCardContent], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(/\s+/g, "_")}_contact.vcf`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Loading profile...</p>;
  }

  const isOwner = isAuthenticated && user?._id === profile?.user;

  if (!profile && !loading) {
    return (
      <p className="text-center text-gray-300 mt-10">Profile not found.</p>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a] text-white flex items-center justify-center relative overflow-hidden">
      {/* Floating Decorative Shapes */}
      <div className="absolute top-[-10%] left-[15%] w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] opacity-40 animate-floating" />
      <div className="absolute top-[70%] right-[10%] w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] opacity-40 animate-floating delay-3000" />
      <div className="absolute bottom-[5%] left-[-10%] w-56 h-56 bg-indigo-500/20 rounded-full blur-[80px] opacity-40 animate-floating delay-5000" />
      <div className="w-full max-w-screen-xl mx-auto bg-gray-700/30 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-gray-400">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">User Dashboard</h2>
          {isAuthenticated && isOwner && (
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 shadow-lg"
            >
              Logout
            </button>
          )}
        </div>

        {profile && (
          <>
            {/* Profile Picture and Bio */}
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 rounded-full border-4 border-indigo-500 mx-auto flex items-center justify-center overflow-hidden bg-gray-700">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 text-8xl" />
                )}
              </div>
              <h1 className="text-2xl font-bold">
                {profile.name || "No Name Available"}
              </h1>
              <p className="text-gray-300">
                {profile.bio || "No bio provided"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {/* Call Now */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <AiOutlinePhone
                  className="text-green-400 text-2xl"
                  onClick={() => {
                    if (profile.callNow?.[0]) {
                      window.location.href = `tel:${profile.callNow[0]}`;
                    } else {
                      alert("Phone number is not available.");
                    }
                  }}
                  title="Click to call"
                />
                <p>{profile.callNow?.[0] || "N/A"}</p>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <AiOutlineMail
                  className="text-blue-400 text-2xl"
                  onClick={() => {
                    if (profile.email) {
                      window.location.href = `mailto:${profile.email}`;
                    } else {
                      alert("Email address is not available.");
                    }
                  }}
                  title="Click to send an email"
                />
                <p>{profile.email || "N/A"}</p>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <FaWhatsapp
                  className="text-green-500 text-2xl"
                  onClick={() => {
                    if (profile.whatsapp) {
                      window.open(
                        `https://wa.me/${profile.whatsapp}`,
                        "_blank"
                      );
                    } else {
                      alert("WhatsApp number is not available.");
                    }
                  }}
                  title="Click to message on WhatsApp"
                />
                <p>{profile.whatsapp || "N/A"}</p>
              </div>

              {/* SMS */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <AiOutlineMessage
                  className="text-yellow-500 text-2xl"
                  onClick={() => {
                    if (profile.sms) {
                      window.location.href = `sms:${profile.sms}`;
                    } else {
                      alert("SMS number is not available.");
                    }
                  }}
                  title="Click to send SMS"
                />
                <p>{profile.sms || "N/A"}</p>
              </div>

              {/* Location */}
              {profile.location && (
                <div className="flex items-center space-x-2 cursor-pointer">
                  <FaMapMarkerAlt
                    className="text-red-500 text-2xl"
                    onClick={() => {
                      const encodedLocation = encodeURIComponent(
                        profile.location
                      );
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
                        "_blank"
                      );
                    }}
                    title="Click to view on Google Maps"
                  />
                  <p>{profile.location}</p>
                </div>
              )}
            </div>

            {/* Generate vCard Button */}
            <button
              onClick={generateVCard}
              className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg mx-auto block hover:bg-blue-500"
            >
              Download vCard
            </button>

            {/* Availability */}
            {profile.availabilityNote && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold">Availability Note</h4>
                <p className="text-gray-300" style={{ whiteSpace: "pre-wrap" }}>
                  {profile.availabilityNote}
                </p>
              </div>
            )}

            {/* Social Links */}
            {profile.socialLinks.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold">Social Links</h4>
                <ul className="space-y-2 text-gray-300">
                  {platforms.map(({ platform, icon, label }) => {
                    // Find the existing link for the platform
                    const existingLink = profile.socialLinks.find(
                      (link) => link.platform.toLowerCase() === platform
                    );

                    // Only display if a valid link exists
                    if (!existingLink || !existingLink.url) return null;

                    return (
                      <li
                        key={platform}
                        className="flex items-center space-x-4"
                      >
                        <a
                          href={existingLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 hover:underline"
                        >
                          {icon}
                          <span className="text-gray-300 font-medium">
                            {existingLink.customCTA || label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {isAuthenticated && isOwner && (
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-600 px-4 py-2 mt-8 rounded-lg mx-auto block hover:bg-yellow-500 shadow-lg"
              >
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="bg-gray-700/30 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl p-6 border border-gray-400 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-semibold p-4 bg-gray-800 rounded-t-2xl text-center text-white">
              Edit Profile
            </h3>
            <div className="overflow-y-auto p-6 flex-1 space-y-6">
              {/* Profile Picture */}
              <div className="text-center relative">
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Profile Picture
                </label>
                <div className="relative w-32 h-32 rounded-full border-4 border-indigo-500 mx-auto flex items-center justify-center overflow-hidden bg-gray-700/30 backdrop-blur-lg shadow-lg">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-8xl" />
                  )}
                  <button
                    onClick={() =>
                      document.getElementById("profilePictureInput").click()
                    }
                    className="absolute bottom-2 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-500"
                    title="Edit Profile Picture"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-200">
                  Contact Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Call Now (Mobile/Landline)
                    </label>
                    <input
                      type="text"
                      name="callNow"
                      value={formData.callNow}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      SMS
                    </label>
                    <input
                      type="text"
                      name="sms"
                      value={formData.sms}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                    />
                  </div>
                  <button
                    onClick={generateVCard}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg mx-auto block hover:bg-blue-500 shadow-lg"
                  >
                    Generate vCard
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-200">
                  Availability
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Custom Availability Note
                  </label>
                  <textarea
                    name="availabilityNote"
                    value={formData.availabilityNote}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                  />
                </div>
              </div>

              {/* Social Links Edit Section */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-200">
                  Social Links
                </h4>
                {platforms.map(({ platform, icon, label }) => {
                  const existingLink = formData.socialLinks.find(
                    (link) => link.platform === platform
                  ) || {
                    platform,
                    url: "",
                    customCTA: "",
                  };

                  return (
                    <div
                      key={platform}
                      className="flex items-center space-x-4 mb-4"
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-700/30 backdrop-blur-lg rounded-lg">
                        {icon}
                      </div>

                      {/* Platform Name Display (Read-only) */}
                      <p className="w-28 text-gray-300 font-medium">{label}</p>

                      {/* URL Input */}
                      <input
                        type="text"
                        placeholder="Enter URL"
                        value={existingLink.url}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            platform,
                            "url",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                      />

                      {/* Custom CTA Input */}
                      <input
                        type="text"
                        placeholder="Enter Custom CTA (e.g., Follow me)"
                        value={existingLink.customCTA}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            platform,
                            "customCTA",
                            e.target.value
                          )
                        }
                        className="flex-2 p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 flex justify-between bg-gray-800 rounded-b-2xl">
              <button
                onClick={saveProfile}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
