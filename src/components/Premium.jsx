import React from "react";

const CheckIcon = ({ className }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

const Premium = () => {
  return (
    <div className="min-h-screen bg-base-200 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold text-base-content sm:text-5xl tracking-tight">
            Elevate Your Experience
          </h2>
          <span className="badge badge-outline badge-warning mt-4 font-semibold">
            Premium plans coming soon
          </span>
          <p className="mt-4 text-xl text-base-content/70 max-w-2xl mx-auto">
            Preview the planned membership benefits. Payments are not available yet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 items-stretch pt-4">
          {/* Silver Tier */}
          <div className="card bg-base-100 shadow-xl border-t-4 border-gray-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
            <div className="card-body grow flex flex-col">
              <div className="mb-4">
                <span className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-300 rounded-full inline-block mb-4">
                  SILVER
                </span>
                <h3 className="text-lg text-base-content/70">Basic features</h3>
                <div className="mt-2 flex items-baseline text-4xl font-extrabold text-base-content">
                  $0
                  <span className="ml-1 text-xl font-medium text-base-content/50">
                    /mo
                  </span>
                </div>
              </div>
              <div className="divider my-0"></div>
              <ul className="space-y-4 my-6 grow text-base-content/80">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-gray-500 mt-0.5 shrink-0" />
                  <span>Up to 50 connection requests per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-gray-500 mt-0.5 shrink-0" />
                  <span>View basic user profiles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-gray-500 mt-0.5 shrink-0" />
                  <span>Completely Ad-free experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-gray-500 mt-0.5 shrink-0" />
                  <span>1 Super Like per day</span>
                </li>
              </ul>
              <div className="card-actions justify-center mt-auto pt-6">
                <button
                  disabled
                  className="btn w-full rounded-full flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Current Plan
                </button>
              </div>
            </div>
          </div>

          {/* Gold Tier */}
          <div className="card bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-2xl border-t-4 border-yellow-500 hover:shadow-yellow-500/30 transition-all duration-300 transform md:-translate-y-6 hover:-translate-y-8 flex flex-col relative z-10">
            <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-3">
              <span className="badge border-none bg-linear-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-4 shadow-lg animate-pulse">
                Most Popular
              </span>
            </div>
            <div className="card-body grow flex flex-col">
              <div className="mb-4">
                <span className="px-3 py-1 text-sm font-semibold text-yellow-700 bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400 rounded-full inline-block mb-4">
                  GOLD
                </span>
                <h3 className="text-lg text-base-content/70">
                  Better visibility
                </h3>
                <div className="mt-2 flex items-baseline text-4xl font-extrabold text-base-content">
                  $29
                  <span className="ml-1 text-xl font-medium text-base-content/50">
                    /mo
                  </span>
                </div>
              </div>
              <div className="divider my-0 border-yellow-200/50"></div>
              <ul className="space-y-4 my-6 grow text-base-content/80 font-medium">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-yellow-500 mt-0.5 shrink-0" />
                  <span>Unlimited connection requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-yellow-500 mt-0.5 shrink-0" />
                  <span>View full profiles and code repositories</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-yellow-500 mt-0.5 shrink-0" />
                  <span>See exactly who liked your profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-yellow-500 mt-0.5 shrink-0" />
                  <span>5 Super Likes per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-yellow-500 mt-0.5 shrink-0" />
                  <span>Priority visibility in matching queue</span>
                </li>
              </ul>
              <div className="card-actions justify-center mt-auto pt-6">
                <button disabled className="btn w-full rounded-full border-none bg-linear-to-r from-yellow-400 to-orange-500 text-white shadow-md opacity-60">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Platinum Tier */}
          <div className="card bg-base-100 shadow-xl border-t-4 border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
            <div className="card-body grow flex flex-col">
              <div className="mb-4">
                <span className="px-3 py-1 text-sm font-semibold text-purple-700 bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 rounded-full inline-block mb-4">
                  PLATINUM
                </span>
                <h3 className="text-lg text-base-content/70">
                  All inclusive access
                </h3>
                <div className="mt-2 flex items-baseline text-4xl font-extrabold text-base-content">
                  $79
                  <span className="ml-1 text-xl font-medium text-base-content/50">
                    /mo
                  </span>
                </div>
              </div>
              <div className="divider my-0"></div>
              <ul className="space-y-4 my-6 grow text-base-content/80">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-purple-500 mt-0.5 shrink-0" />
                  <span className="font-semibold">
                    Everything included in Gold
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-purple-500 mt-0.5 shrink-0" />
                  <span>Unlimited Super Likes & Rewinds</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-purple-500 mt-0.5 shrink-0" />
                  <span>Profile Boost (1 per week)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-purple-500 mt-0.5 shrink-0" />
                  <span>Read receipts for your messages</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-purple-500 mt-0.5 shrink-0" />
                  <span>Access to exclusive DevTinder IRL events</span>
                </li>
              </ul>
              <div className="card-actions justify-center mt-auto pt-6">
                <button disabled className="btn btn-outline w-full rounded-full opacity-60">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
