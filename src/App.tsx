"use client";
import * as React from "react";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
// import { SignOut } from "../convex/auth/SignOut"; // Removed as requested
import HealthSurgeApp from "./Pages/Landing";
import Dashboard from "./Pages/Dashboard";
import Hospitals from "./Pages/Hospitals";
import UserProfile from "./Pages/UserProfile";
import { UserLayout } from "./Components/UserLayout";
import { SignIn } from "./Components/SignIn";
import { LoginPage } from "./Pages/LoginPage";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { ToastProvider } from "./Components/Toaster";

export default function App() {
  const ensureHospitalForAuthenticatedUser = useMutation(
    api.myFunctions.ensureHospitalForAuthenticatedUser,
  );
  const createPatientUser = useMutation(api.myFunctions.createPatientUser);
  const [page, setPage] = React.useState<
    "landing" | "dashboard" | "hospitals" | "login" | "profile"
  >("landing");
  const [loginType, setLoginTypeState] = React.useState<
    "user" | "hospital" | null
  >(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      return localStorage.getItem("loginType") as "user" | "hospital" | null;
    }
    return null;
  });

  const setLoginType = (type: "user" | "hospital" | null) => {
    setLoginTypeState(type);
    if (type) {
      localStorage.setItem("loginType", type);
    } else {
      localStorage.removeItem("loginType");
    }
  };

  const [showSignInModal, setShowSignInModal] = React.useState(false);

  const openSignIn = () => setShowSignInModal(true);
  const closeSignIn = () => setShowSignInModal(false);
  const { isAuthenticated } = useConvexAuth();

  React.useEffect(() => {
    if (!isAuthenticated && page !== "landing" && page !== "login") {
      setPage("landing");
    }
  }, [isAuthenticated, page]);

  const handleNavigate = (
    target:
      | "dashboard"
      | "hospitals"
      | "user"
      | "hospital"
      | "profile"
      | "landing",
  ) => {
    if (target === "dashboard") {
      if (isAuthenticated) {
        setPage("dashboard");
      } else {
        // If trying to access dashboard directly, assume hospital login needed if not authed
        setLoginType("hospital");
        openSignIn();
      }
    } else if (target === "user") {
      setLoginType("user");
      setPage("login");
    } else if (target === "hospital") {
      setLoginType("hospital");
      setPage("login");
    } else {
      setPage(target);
    }
  };

  if (loginType === "hospital" && isAuthenticated) {
    // Ensure hospital record exists for authenticated hospital user
    ensureHospitalForAuthenticatedUser();
  }
  if (loginType === "user" && isAuthenticated) {
    createPatientUser();
  }
  return (
    <ToastProvider>
      <main>
        {/* -------- AUTHED USERS -------- */}
        <Authenticated>
          {/* SignOut removed as requested - moved to Sidebar */}

          {/* AuthCompleteHandler removed; sign-in modal is shown in Unauthenticated block */}
          <div>
            {/* If logged in as hospital, show dashboard. If user, show hospitals? 
                For now, let's keep it simple: Authenticated means you can see the protected pages.
                We might need a better way to distinguish role after auth, but for UI flow:
            */}
            {page === "landing" && (
              <HealthSurgeApp
                onNavigate={handleNavigate}
                isAuthenticated={true}
                userType={loginType}
              />
            )}
            {page === "dashboard" && <Dashboard />}

            {(page === "hospitals" || page === "profile") && (
              <UserLayout
                activePage={page as "hospitals" | "profile"}
                onNavigate={(p) => setPage(p)}
              >
                {page === "hospitals" && <Hospitals />}
                {page === "profile" && <UserProfile />}
              </UserLayout>
            )}
          </div>

          {/* Floating Buttons for Authed Users */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {/* If we are in hospital mode (or default), show dashboard button? 
                  Actually, let's use the loginType state to decide what to show if we have it.
                  If we don't have it (refresh), we might default to one.
              */}

            {/* Show "Find Hospitals" if we are a USER */}
            {/* Removed: UserLayout handles navigation now */}

            {/* Show "Dashboard" if we are a HOSPITAL */}
            {loginType !== "user" &&
              page !== "dashboard" &&
              page !== "landing" && (
                <button
                  onClick={() => setPage("dashboard")}
                  className="bg-black text-lime-400 px-6 py-3 rounded-lg font-bold border-2 border-lime-400 shadow-[4px_4px_0px_0px_#bef264] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Go to Dashboard
                </button>
              )}

            {/* Restore "Back to Home" button for authenticated users on non-landing pages */}
            {/* Restore "Back to Home" button for authenticated users on non-landing pages */}
            {/* Only show for Dashboard or if not in UserLayout (though UserLayout has home link) */}
            {page !== "landing" && page !== "profile" && (
              <button
                onClick={() => setPage("landing")}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold border-2 border-white shadow-[4px_4px_0px_0px_#fff] hover:translate-y-1 hover:shadow-none transition-all"
              >
                Back to Home
              </button>
            )}
          </div>
        </Authenticated>

        {/* -------- UNAUTHED USERS -------- */}
        <Unauthenticated>
          {page === "landing" && <HealthSurgeApp onNavigate={handleNavigate} />}

          {page === "login" && loginType && (
            <LoginPage type={loginType} onBack={() => setPage("landing")} />
          )}

          {/* We don't show floating buttons on landing page for unauthed users anymore per request */}

          {showSignInModal && <SignIn onClose={closeSignIn} />}
        </Unauthenticated>
      </main>
    </ToastProvider>
  );
}
