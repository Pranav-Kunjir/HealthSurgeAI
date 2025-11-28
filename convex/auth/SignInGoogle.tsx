import { useAuthActions } from "@convex-dev/auth/react";

export function SignInGoogle() {
  const { signIn } = useAuthActions();
  return (
    <button
      className="flex items-center justify-center gap-3 w-full bg-white text-black border-2 border-black px-6 py-3 rounded-lg font-bold shadow-[4px_4px_0px_0px_#111] hover:translate-y-1 hover:shadow-none transition-all"
      onClick={() => void signIn("google")}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-6 h-6"
      />
      <span>Continue with Google</span>
    </button>
  );
}
