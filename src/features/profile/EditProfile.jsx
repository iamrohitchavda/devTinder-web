import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../../utils/constants";
import { addUser } from "../../utils/userSlice";
import UserCard from "../../components/UserCard";
import { showToast } from "../../utils/toastSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    photoUrl: user.photoUrl || "",
    bio: user.bio || "",
    skills: user.skills?.join(", ") || "",
    age: user.age || "",
  });

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [bio, setBio] = useState(user.bio || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [age, setAge] = useState(user.age || "");
  const [error, setError] = useState("");

  const isChanged =
    firstName !== initialData.firstName ||
    lastName !== initialData.lastName ||
    photoUrl !== initialData.photoUrl ||
    bio !== initialData.bio ||
    skills !== initialData.skills ||
    age !== initialData.age;

  const handleUpdate = async () => {
    setError("");

    try {
      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const res = await axios.patch(
        API_BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          bio,
          skills: skillsArray,
          age,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));

      dispatch(
        showToast({
          message: "Profile updated successfully!",
          type: "success",
        }),
      );

      setInitialData({
        firstName,
        lastName,
        photoUrl,
        bio,
        skills,
        age,
      });
    } catch (err) {
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Update failed. Please try again.",
          type: "error",
        }),
      );
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Update failed. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in mb-10 w-full overflow-hidden">
      <div className="text-center mb-10 animate-slide-up">
        <h1 className="text-4xl font-extrabold text-base-content tracking-tight mb-2">
          Your Profile
        </h1>
        <p className="text-base-content/60 text-lg">
          Update how you appear to other developers on DevTinder.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 justify-center items-start w-full max-w-6xl mx-auto">
        {/* Real-time Preview */}
        <div className="w-full lg:w-5/12 pb-10 flex flex-col items-center lg:sticky lg:top-28 z-10 animate-slide-up anim-delay-100">
          <div className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold shadow-sm w-fit border-primary/30 bg-primary/5">
            Real-time Preview
          </div>
          <div className="w-full max-w-[380px] pointer-events-none scale-100 xl:scale-105 origin-top transition-all">
            <UserCard
              compact
              showActions={false}
              user={{
                firstName: firstName || "First",
                lastName: lastName || "Last",
                photoUrl:
                  photoUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                bio:
                  bio ||
                  "This is how your bio will appear. Tell developers what you are building!",
                skills: skills
                  ? skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : [],
                age,
                gender: user.gender, // Keeping actual gender from user object
              }}
            />
          </div>
        </div>

        {/* Edit Form */}
        <div className="w-full lg:w-7/12 modern-card p-6 sm:p-10 bg-base-100 shadow-2xl animate-fade-in anim-delay-200 border-t-4 border-primary/80 z-20">
          <h2 className="text-2xl font-bold mb-6 text-base-content border-b border-base-200 pb-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">
                  First Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full rounded-xl focus:border-primary transition-colors bg-base-200/30"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">
                  Last Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full rounded-xl focus:border-primary transition-colors bg-base-200/30"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="form-control w-full sm:col-span-2">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">
                  Profile Photo URL
                </span>
              </label>
              <input
                type="url"
                className="input input-bordered w-full rounded-xl focus:border-primary transition-colors bg-base-200/30"
                placeholder="https://example.com/avatar.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            <div className="form-control w-full sm:col-span-2">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">
                  About Me (Bio)
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full rounded-xl focus:border-primary transition-colors bg-base-200/30 min-h-[100px] leading-relaxed"
                placeholder="Tell us about your coding journey and interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">
                  Age
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full rounded-xl focus:border-primary transition-colors bg-base-200/30"
                placeholder="e.g. 24"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">
                  Skills
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full rounded-xl focus:border-primary transition-colors bg-base-200/30"
                placeholder="React, Java, Node"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-error/15 text-error p-3 rounded-lg border border-error/30 text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-base-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <span
              className={`text-sm font-medium ${isChanged ? "text-warning" : "text-success"} flex items-center gap-2`}
            >
              {isChanged ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  Unsaved changes
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  All changes saved
                </>
              )}
            </span>
            <button
              className={`btn btn-primary rounded-full px-8 shadow-lg hover:shadow-primary/40 transition-all font-bold tracking-wide w-full sm:w-auto ${
                !isChanged
                  ? "btn-disabled bg-base-200 text-base-content/40 shadow-none border-none"
                  : ""
              }`}
              onClick={handleUpdate}
              disabled={!isChanged}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
