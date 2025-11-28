import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function SignInPassword() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <p className="text-sm text-gray-500 font-medium text-center">
        Log in to access your hospital dashboard
      </p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            setError(error.message);
          });
        }}
      >
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-lime-400 focus:ring-4 focus:ring-lime-100 outline-none transition-all font-bold placeholder-gray-400"
            type="email"
            name="email"
            placeholder="Email Address"
            required
          />
          <input
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-lime-400 focus:ring-4 focus:ring-lime-100 outline-none transition-all font-bold placeholder-gray-400"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        <button
          className="w-full bg-black text-white font-bold py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#bef264] hover:translate-y-1 hover:shadow-none transition-all mt-2"
          type="submit"
        >
          {flow === "signIn" ? "Sign In" : "Sign Up"}
        </button>

        <div className="flex flex-col items-center gap-3 mt-2">
          <div className="text-xs font-bold text-gray-500">
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </div>
          <button
            type="button"
            className="text-sm font-bold text-black border-b-2 border-lime-400 hover:bg-lime-100 transition-colors px-1"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Create an account" : "Log in instead"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <i className="ph-fill ph-warning-circle text-red-500 text-lg shrink-0 mt-0.5"></i>
            <p className="text-red-600 text-xs font-bold">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
