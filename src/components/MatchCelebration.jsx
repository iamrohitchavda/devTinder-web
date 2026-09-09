import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_PHOTO } from "../utils/constants";

const codeParticles = ["</>", "{ }", "git", "npm", "=>", "&&"];

const MatchCelebration = ({ match, onClose }) => {
  const navigate = useNavigate();
  const matchedUser = match?.matchedUser;

  if (!matchedUser) return null;

  const startConversation = () => {
    onClose();
    navigate(`/chat/${matchedUser._id}`, {
      state: {
        receiverName: `${matchedUser.firstName} ${matchedUser.lastName}`,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/90 px-4 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        {codeParticles.map((particle, index) => (
          <span
            key={particle}
            className="absolute animate-pulse font-mono text-xl text-primary"
            style={{
              left: `${12 + index * 15}%`,
              top: `${18 + (index % 3) * 28}%`,
              animationDelay: `${index * 180}ms`,
            }}
          >
            {particle}
          </span>
        ))}
      </div>

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/40 bg-base-100 p-8 text-center shadow-2xl shadow-primary/30 animate-slide-up">
        <div className="absolute left-1/2 top-24 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-primary to-transparent" />
        <p className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-primary">
          CONNECTION_ESTABLISHED
        </p>
        <h2 className="text-4xl font-extrabold text-base-content">
          It&apos;s a Dev Match!
        </h2>
        <p className="mt-3 text-base-content/70">
          A collaboration channel with {matchedUser.firstName} is now live.
        </p>

        <div className="my-8 flex items-center justify-center gap-4">
          <div className="avatar">
            <div className="w-20 rounded-full ring-4 ring-primary/30 ring-offset-4 ring-offset-base-100">
              <img
                src={matchedUser.photoUrl || DEFAULT_PROFILE_PHOTO}
                alt={matchedUser.firstName}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span className="h-3 w-3 animate-ping rounded-full bg-primary" />
            <span className="h-px w-16 bg-primary" />
            <span className="h-3 w-3 animate-ping rounded-full bg-primary" />
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-primary-content shadow-lg">
            &lt;/&gt;
          </div>
        </div>

        <div className="rounded-2xl bg-base-200 p-4 font-mono text-left text-sm text-base-content/70">
          <p>&gt; Mutual interest detected</p>
          <p>&gt; Collaboration channel unlocked</p>
          <p className="text-success">&gt; Ready to build together_</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="btn btn-primary grow rounded-full"
            onClick={startConversation}
          >
            Start a conversation
          </button>
          <button className="btn btn-ghost grow rounded-full" onClick={onClose}>
            Keep exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCelebration;
