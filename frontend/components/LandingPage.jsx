import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6">

      {/* Title */}
      <h1 className="text-5xl font-bold mb-4">
        <span className="text-indigo-400">Compile</span>
        <span className="text-white">Storm</span>
      </h1>

      {/* Tagline */}
      <p className="text-lg text-zinc-300 max-w-xl text-center mb-8">
        A lightning-fast online code execution environment supporting Java, C, C++, Python, and JavaScript.
        Create projects, write code, run instantly — all in one place.
      </p>

      {/* Buttons */}
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/signin")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-md text-lg"
        >
          Sign In
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-md text-lg"
        >
          Create Account
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-center">
        <div className="p-4 bg-zinc-800 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Multi-Language Support</h3>
          <p className="text-zinc-300">Run Java, C, C++, Python, and JS with real compiler support.</p>
        </div>
        <div className="p-4 bg-zinc-800 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Project-Based Workspace</h3>
          <p className="text-zinc-300">Organize your code with folders, files, and persistent storage.</p>
        </div>
        <div className="p-4 bg-zinc-800 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Instant Execution</h3>
          <p className="text-zinc-300">Compile and run programs instantly using the cloud sandbox.</p>
        </div>
      </div>
    </div>
  );
}
