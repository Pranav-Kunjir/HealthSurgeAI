import React from "react";
import { SignInGoogle } from "../../convex/auth/SignInGoogle";
import { SignInPassword } from "../../convex/auth/SignInPassword";

interface LoginPageProps {
    type: "user" | "hospital";
    onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ type, onBack }) => {

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Panel: Context */}
            <div className="md:w-1/3 bg-[#0a0a0a] text-white p-12 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div
                        className="flex items-center gap-2 mb-16 cursor-pointer group w-fit"
                        onClick={onBack}
                    >
                        <i className="ph-bold ph-arrow-left text-lime-400 group-hover:-translate-x-1 transition-transform text-lg"></i>
                        <span className="font-bold text-xs tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors">
                            Back
                        </span>
                    </div>

                    <h2 className="text-5xl font-bold font-display mb-8 tracking-tight">
                        {type === "hospital" ? "Join the Pilot" : "User Access"}
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-sm">
                        {type === "hospital"
                            ? "We are currently onboarding hospitals in the Mumbai Metropolitan Region for the Diwali 2025 predictive cycle."
                            : "Access real-time health surge predictions and find available hospital resources near you."}
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#222] transition-colors border border-white/5">
                                <i className="ph-fill ph-shield-check text-lime-400 text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-base mb-1">Secure Data Handling</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    HIPAA compliant pipelines with AWS security protocols.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#222] transition-colors border border-white/5">
                                <i className="ph-fill ph-rocket-launch text-lime-400 text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-base mb-1">Instant Dashboard Access</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Get access to the React dashboard immediately after verification.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle background gradient/noise could go here if needed */}
            </div>

            {/* Right Panel: Login Form */}
            <div className="md:w-2/3 bg-white p-4 md:p-8 overflow-y-auto flex items-center justify-center relative">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                ></div>

                <div className="max-w-md w-full relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20  items-center justify-center mx-auto mb-6  overflow-hidden p-2">
                            <img src="/logo.png" alt="HealthSurgeAI Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-3xl font-bold font-display mb-2">
                            {type === "hospital" ? "Hospital Login" : "User Login"}
                        </h2>
                        <p className="text-gray-500">
                            {type === "hospital"
                                ? "Manage beds, staff, and emergency resources."
                                : "Find care and track your health journey."}
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500 font-bold tracking-wider">
                                    Quick Access
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <SignInGoogle />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500 font-bold tracking-wider">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <SignInPassword />
                    </div>

                    <p className="text-xs text-center text-gray-400 mt-10 max-w-xs mx-auto">
                        By signing in, you agree to our <a href="#" className="underline hover:text-black">Terms of Service</a> & <a href="#" className="underline hover:text-black">Data Processing Agreement</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};
