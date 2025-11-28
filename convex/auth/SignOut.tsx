import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
export function SignOut() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <p
          className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1"
          onClick={() => void signOut()}
        >
          Sign out
        </p>
      )}
    </>
  );
}
