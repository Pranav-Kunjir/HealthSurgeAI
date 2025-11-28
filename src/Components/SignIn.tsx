// React import not required with the automatic JSX runtime
import { SignInGoogle } from "../../convex/auth/SignInGoogle";
import { SignInPassword } from "../../convex/auth/SignInPassword";

interface Props {
  onClose?: () => void;
}

export function SignIn({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-3xl mx-4">
        <div className="bg-white border-2 border-black p-6 rounded shadow-[8px_8px_0px_0px_#111]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Sign in or Create account</h2>
              <p className="text-sm text-gray-600">
                Access the dashboard for hospitals
              </p>
            </div>
            <div>
              <button
                onClick={onClose}
                className="text-sm font-bold bg-black text-white px-3 py-1 rounded hover:opacity-90"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-3 border-2 border-gray-100 rounded">
              <h3 className="font-bold mb-3">Sign in with Google</h3>
              <div className="flex items-center">
                <SignInGoogle />
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-400 gap-3">
              <span className="h-px bg-gray-200 flex-1"></span>
              <span className="text-xs uppercase">or</span>
              <span className="h-px bg-gray-200 flex-1"></span>
            </div>

            <div className="p-3 border-2 border-gray-100 rounded">
              <h3 className="font-bold mb-3">Email / Password</h3>
              <SignInPassword />
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            By signing in you agree to the platform terms. You can add hospital
            details later in Settings.
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
