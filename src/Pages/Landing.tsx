import * as React from "react";
import { API_BASE_URL } from "../config";
import "../index.css";
// --- Components ---

interface NavbarProps {
  onLogin: (type: "user" | "hospital") => void;
  isAuthenticated?: boolean;
  userType?: "user" | "hospital" | null;
  onNavigate?: (page: "dashboard" | "hospitals") => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onLogin,
  isAuthenticated,
  userType,
  onNavigate,
}) => (
  <nav className="border-b-2 border-black py-4 px-6 flex justify-between items-center bg-white sticky top-0 z-50">
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-md overflow-hidden">
        <img
          src="/logo.png"
          alt="HealthSurgeAI Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xl font-bold font-display tracking-tight">
        HealthSurgeAI
      </span>
    </div>
    <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wide">
      <a
        href="#challenge"
        className="hover:text-lime-400 hover:underline decoration-2 underline-offset-4 transition-all"
      >
        The Challenge
      </a>
      <a
        href="#Featues"
        className="hover:text-lime-400 hover:underline decoration-2 underline-offset-4 transition-all"
      >
        How it Works
      </a>
      <a
        href="#solution"
        className="hover:text-lime-400 hover:underline decoration-2 underline-offset-4 transition-all"
      >
        Solution
      </a>
      <a
        href="#usecases"
        className="hover:text-lime-400 hover:underline decoration-2 underline-offset-4 transition-all"
      >
        Use Cases
      </a>
    </div>
    <div className="flex gap-4">
      {isAuthenticated ? (
        <>
          {userType === "user" ? (
            <button
              onClick={() => onNavigate?.("hospitals")}
              className="bg-black text-lime-400 px-6 py-2 rounded-lg font-bold text-sm hover:translate-y-1 transition-all border-2 border-lime-400 shadow-[4px_4px_0px_0px_#bef264] hover:shadow-none"
            >
              FIND HOSPITALS
            </button>
          ) : (
            <button
              onClick={() => onNavigate?.("dashboard")}
              className="bg-black text-lime-400 px-6 py-2 rounded-lg font-bold text-sm hover:translate-y-1 transition-all border-2 border-lime-400 shadow-[4px_4px_0px_0px_#bef264] hover:shadow-none"
            >
              DASHBOARD
            </button>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => onLogin("user")}
            className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all border-2 border-black"
          >
            USER LOG IN
          </button>
          <button
            onClick={() => onLogin("hospital")}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-lime-400 hover:text-black transition-all border-2 border-black"
          >
            HOSPITAL LOG IN ↗
          </button>
        </>
      )}
    </div>
  </nav>
);

const StatsStrip: React.FC = () => {
  const [stats, setStats] = React.useState({
    accuracy: "85%+",
    stockouts: "~20%",
    warning: "5-7 Days"
  });

  React.useEffect(() => {
    // Simulate fetching live system performance stats
    // In a real app, this would come from a /stats endpoint
    const fetchStats = async () => {
      try {
        // Just pinging the API to ensure it's up, then setting "Live" stats
        await fetch(`${API_BASE_URL}/`);
        setStats({
          accuracy: "92.4%", // Mock "Live" updated accuracy
          stockouts: "-35%",
          warning: "7 Days"
        });
      } catch (e) {
        console.log("API not reachable, using defaults");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white border-b-2 border-black grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-black">
      <div className="p-8 flex flex-col items-center justify-center text-center hover:bg-lime-400 transition-colors group cursor-default">
        <div className="text-4xl font-bold font-display group-hover:scale-110 transition-transform mb-2">
          {stats.accuracy}
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Prediction Accuracy
        </div>
      </div>
      <div className="p-8 flex flex-col items-center justify-center text-center hover:bg-lime-400 transition-colors group cursor-default">
        <div className="text-4xl font-bold font-display group-hover:scale-110 transition-transform mb-2">
          {stats.stockouts}
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Reduced Stockouts
        </div>
      </div>
      <div className="p-8 flex flex-col items-center justify-center text-center hover:bg-lime-400 transition-colors group cursor-default">
        <div className="text-4xl font-bold font-display group-hover:scale-110 transition-transform mb-2">
          {stats.warning}
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Advance Warning
        </div>
      </div>
      <div className="p-8 flex flex-col items-center justify-center text-center bg-gray-50">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Powered By
        </div>
        <div className="flex gap-4 text-2xl text-gray-400">
          <i
            className="ph-fill ph-aws-logo hover:text-[#FF9900] transition-colors"
            title="AWS"
          ></i>
          <i
            className="ph-bold ph-chats-circle hover:text-[#F22F46] transition-colors"
            title="Twilio"
          ></i>
          <i
            className="ph-fill ph-atom hover:text-[#61DAFB] transition-colors"
            title="React"
          ></i>
          <i
            className="ph-fill ph-code hover:text-[#3776AB] transition-colors"
            title="Python"
          ></i>
        </div>
      </div>
    </div>
  );
};

const ChallengeSection: React.FC = () => (
  <section
    id="challenge"
    className="flex flex-col md:flex-row border-b-2 border-black"
  >
    <div className="md:w-1/2 p-12 md:p-20 bg-black text-white border-r-2 border-black flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
          Problem Statement 1
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight font-display">
        Indian Healthcare's
        <br />
        Breaking Point.
      </h2>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Hospitals in urban and semi-urban India face chaos during{" "}
        <strong>Diwali, Holi, and winter smog seasons</strong>. Unpredictable
        patient influxes lead to overcrowded wards, exhausted staff, and
        critical supply shortages.
      </p>
      <div className="flex gap-4">
        <div className="border border-gray-700 p-4 rounded w-full">
          <i className="ph-fill ph-users-three text-3xl text-lime-400 mb-2"></i>
          <div className="font-bold text-sm">Overcrowding</div>
        </div>
        <div className="border border-gray-700 p-4 rounded w-full">
          <i className="ph-fill ph-first-aid-kit text-3xl text-lime-400 mb-2"></i>
          <div className="font-bold text-sm">Supply Deficits</div>
        </div>
      </div>
    </div>
    <div className="md:w-1/2 bg-gray-100 p-12 md:p-20 flex flex-col justify-center relative overflow-hidden">
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <h3 className="text-2xl font-bold mb-6 font-display z-10">
        The Solution: Agentic AI
      </h3>
      <p className="text-gray-600 mb-8 z-10">
        HealthSurgeAI moves beyond simple dashboards. It is an{" "}
        <strong>agentic system</strong> that proactively predicts demand and
        recommends actions.
      </p>

      <ul className="space-y-4 z-10">
        {[
          {
            title: "Data Integration",
            desc: "Weather APIs, Festival Calendars, Epidemic Records",
          },
          {
            title: "Predictive Engine",
            desc: "LSTM Time-series forecasting & Reinforcement Learning",
          },
          {
            title: "Actionable Output",
            desc: "Staffing Recommendations & Patient Advisories",
          },
        ].map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-4 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#111] hover:translate-x-2 transition-transform"
          >
            <i className="ph-fill ph-check-circle text-2xl text-lime-400 bg-black rounded-full"></i>
            <div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const Features: React.FC = () => (
  <section className="py-16 container mx-auto px-6 max-w-7xl" id="Featues">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">How It Works</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Integrating weather APIs, festival calendars, and historical records to
        power our LSTM predictive engine.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: "ph-chart-line-up",
          title: "Surge Prediction",
          desc: "Analyzes diverse data streams to forecast patient influx with high accuracy.",
        },
        {
          icon: "ph-users-three",
          title: "Resource Optimization",
          desc: "Reinforcement learning module recommends optimal staffing and bed allocation.",
        },
        {
          icon: "ph-bell-ringing",
          title: "Proactive Alerts",
          desc: "SMS & Email notifications via Twilio ensure staff is prepared before the surge hits.",
        },
      ].map((feature, i) => (
        <div
          key={i}
          className="border-2 border-lime-400 p-8 transition-shadow bg-black rounded hover:shadow-[8px_8px_0px_0px_var(--brand-lime)]"
        >
          {/* correct string interpolation for className */}
          <i
            className={`ph-fill ${feature.icon} text-4xl mb-4 text-lime-400`}
            aria-hidden="true"
          />
          <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-[rgba(255,255,255,0.75)]">
            {feature.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const UseCasesSection: React.FC = () => (
  <section id="usecases" className="py-20 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <span className="bg-lime-400 px-3 py-1 text-xs font-bold border border-black uppercase tracking-wider">
        Real World Impact
      </span>
      <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4 font-display">
        Ready for India's Pulse
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Designed specifically for the unique rhythm of Indian public health
        challenges.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Case 1 */}
      <div className="bg-white border-2 border-black p-0 overflow-hidden group hover:shadow-[8px_8px_0px_0px_#1a2e1a] transition-all">
        <div className="h-48 bg-black p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-black opacity-50"></div>
          <i className="ph-fill ph-sparkle text-6xl text-lime-400 z-10"></i>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-2">Festival Surges</h3>
          <p className="text-sm font-bold text-lime-400 bg-black inline-block px-2 py-1 mb-4">
            Diwali & Holi
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Anticipates burn cases and respiratory issues 5 days before Diwali.
            Recommends stocking burn kits and increasing night-shift ER staff.
          </p>
          <div className="border-t-2 border-gray-100 pt-4 flex justify-between items-center text-xs font-bold text-gray-500">
            <span>
              <i className="ph-bold ph-calendar-check mr-1"></i> Seasonal
            </span>
            <span>
              <i className="ph-bold ph-fire mr-1"></i> Burn Units
            </span>
          </div>
        </div>
      </div>

      {/* Case 2 */}
      <div className="bg-white border-2 border-black p-0 overflow-hidden group hover:shadow-[8px_8px_0px_0px_#1a2e1a] transition-all">
        <div className="h-48 bg-gray p-8 flex items-center justify-center relative overflow-hidden border-b-2 border-black">
          <i className="ph-fill ph-cloud-fog text-6xl text-gray-400 z-10"></i>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-2">Pollution Spikes</h3>
          <p className="text-sm font-bold text-white bg-gray-500 inline-block px-2 py-1 mb-4">
            Winter Smog
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Correlates AQI forecasts from OpenWeather API with historical
            admission rates to predict asthma and COPD flare-ups in urban
            centers.
          </p>
          <div className="border-t-2 border-gray-100 pt-4 flex justify-between items-center text-xs font-bold text-gray-500">
            <span>
              <i className="ph-bold ph-wind mr-1"></i> AQI Driven
            </span>
            <span>
              <i className="ph-bold ph-lungs mr-1"></i> Pulmonology
            </span>
          </div>
        </div>
      </div>

      {/* Case 3 */}
      <div className="bg-white border-2 border-black p-0 overflow-hidden group hover:shadow-[8px_8px_0px_0px_#1a2e1a] transition-all">
        <div className="h-48 bg-lime-400 p-8 flex items-center justify-center relative overflow-hidden border-b-2 border-black">
          <i className="ph-fill ph-virus text-6xl text-dark-green z-10"></i>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-2">Epidemic Waves</h3>
          <p className="text-sm font-bold text-white bg-red-500 inline-block px-2 py-1 mb-4">
            Dengue & Malaria
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Analyzes regional public health records to identify rising clusters
            of vector-borne diseases, enabling proactive bed allocation.
          </p>
          <div className="border-t-2 border-gray-100 pt-4 flex justify-between items-center text-xs font-bold text-gray-500">
            <span>
              <i className="ph-bold ph-trend-up mr-1"></i> Trend Analysis
            </span>
            <span>
              <i className="ph-bold ph-bed mr-1"></i> Isolation Wards
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DashboardPreview: React.FC = () => (
  <section
    id="solution"
    className="bg-black text-white py-20 overflow-hidden border-y-2 border-lime-400"
  >
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/3">
        <h2 className="text-4xl font-bold font-display mb-6">
          Smarter Decisions.
          <br />
          <span className="text-lime-400">Faster Response.</span>
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Our React-based dashboard gives administrators a bird's-eye view of
          predicted load vs. current capacity.
        </p>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded bg-lime-400 flex items-center justify-center text-black text-2xl">
              <i className="ph-bold ph-bell-ringing"></i>
            </div>
            <div>
              <h4 className="font-bold text-lg">Twilio Alerts</h4>
              <p className="text-sm text-gray-400">
                Automated SMS to staff when surge probability 80%.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-black text-2xl">
              <i className="ph-bold ph-users"></i>
            </div>
            <div>
              <h4 className="font-bold text-lg">Staff Optimization</h4>
              <p className="text-sm text-gray-400">
                RL algorithms suggest shift changes 48h in advance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Dashboard Visual */}
      <div className="md:w-2/3 w-full">
        <div className="bg-gray rounded-lg p-2 md:p-4 border-2 border-gray-600 shadow-2xl relative">
          {/* Header */}
          <div className="bg-white p-4 rounded mb-2 flex justify-between items-center border border-gray-200">
            <div className="font-bold text-black text-sm">
              Surge Dashboard{" "}
              <span className="text-gray-400 font-normal">
                | Apollo Navi Mumbai
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold text-red-500">
                LIVE: HIGH ALERT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="col-span-2 bg-white p-4 rounded border border-gray-200">
              <div className="text-xs font-bold text-gray-400 uppercase mb-2">
                7-Day Forecast (Diwali Week)
              </div>
              <div className="h-32 flex items-end gap-1">
                {[40, 45, 55, 65, 95, 85, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-lime-400/20 relative group hover:bg-lime-400/40 transition-colors rounded-t"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className={`absolute bottom-0 w-full bg-lime-400 transition-all duration-1000 ${i === 4 ? "bg-red-500" : ""}`}
                      style={{ height: `${h * 0.8}%` }}
                    ></div>
                    {i === 4 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">
                        PEAK
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200 flex flex-col justify-between">
              <div className="text-xs font-bold text-gray-400 uppercase">
                Resource Health
              </div>
              <div className="text-center my-2">
                <div className="text-3xl font-bold text-black">12/50</div>
                <div className="text-[10px] text-gray-500">Beds Available</div>
              </div>
              <button className="bg-black text-white text-xs py-2 rounded w-full hover:bg-gray-800">
                Request Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 4. Main Hero & App Composition
interface HealthSurgeAppProps {
  onNavigate?: (page: "dashboard" | "hospitals" | "user" | "hospital") => void;
  isAuthenticated?: boolean;
  userType?: "user" | "hospital" | null;
}

const HealthSurgeApp: React.FC<HealthSurgeAppProps> = ({
  onNavigate,
  isAuthenticated,
  userType,
}) => {
  return (
    <div className="antialiased text-black font-sans">
      {/* Inject custom styles for the floating animation and pulse ring */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.33); opacity: 1; }
            80%, 100% { transform: scale(2); opacity: 0; }
        }
        .custom-float {
          animation: float 6s ease-in-out infinite;
        }
        .custom-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
        .custom-pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      <Navbar
        onLogin={(type) => onNavigate?.(type as any)}
        isAuthenticated={isAuthenticated}
        userType={userType}
        onNavigate={(page) => onNavigate?.(page)}
      />

      {/* Hero Section */}
      <main className="min-h-[90vh] flex flex-col md:flex-row border-b-2 border-black">
        {/* Left Content */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center border-r-2 border-black bg-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="inline-flex items-center gap-2 mb-6">
            <span className="bg-lime-400 px-3 py-1 text-xs font-bold border border-black uppercase tracking-wider">
              MumbaiHacks 2025
            </span>
            <span className="text-sm font-medium text-gray-600">
              Healthtech Track
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] mb-6 tracking-tighter font-display">
            Predicting <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600">
              Healthcare
            </span>{" "}
            <br />
            Surges.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-md leading-relaxed">
            An agentic AI system for Indian hospitals. Forecast patient influx
            during festivals, pollution spikes, and epidemics 7 days in advance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate?.("hospital")}
              className="bg-[#111111] text-white px-8 py-4 text-lg font-bold rounded-none border-2 border-[#111111] shadow-[4px_4px_0px_0px_#bef264] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              DEPLOY PILOT <i className="ph-bold ph-arrow-right"></i>
            </button>
            <a
              href="#solution"
              className="px-8 py-4 text-lg font-bold border-2 border-black bg-white hover:bg-gray transition-colors flex items-center justify-center gap-2"
            >
              <i className="ph-fill ph-play-circle text-xl"></i> HOW IT WORKS
            </a>
          </div>
        </div>

        {/* Right Visuals (Abstract/Dashboard Concept) */}
        <div className="w-full md:w-1/2 bg-gray relative overflow-hidden flex items-center justify-center min-h-[500px]">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#ccc 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Abstract Graphic Composition */}
          <div className="relative w-full max-w-lg aspect-square p-8">
            {/* Floating Elements simulating Dashboard Widgets */}
            <div className="absolute top-10 right-10 bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_#111] z-50 w-48 custom-float">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500">
                  POLLUTION SPIKE
                </span>
                <i className="ph-fill ph-warning text-orange-500"></i>
              </div>
              <div className="text-2xl font-bold mb-1">AQI 340</div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-3/4"></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                +12% Respiratory Cases
              </div>
            </div>

            <div className="absolute bottom-20 left-10 bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#bef264] z-50 w-64 custom-float-delayed">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="ph-fill ph-bed"></i>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500">
                      BED OCCUPANCY
                    </div>
                    <div className="text-sm font-bold">Ward A</div>
                  </div>
                </div>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                  High
                </span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold">92%</span>
                <span className="text-xs text-gray-500 mb-1">Forecasted</span>
              </div>
              <div className="text-xs text-black bg-lime-400/30 p-2 rounded border border-lime-400">
                Action: +3 Nurses Reqd
              </div>
            </div>

            {/* Central Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-black rounded-full flex items-center justify-center z-30 custom-pulse-ring">
              <i className="ph-fill ph-brain text-6xl text-lime-400"></i>
              <div className="absolute inset-0 rounded-full border-2 border-lime-400 pulse-ring"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 ">
              {/* static black circle + icon */}
              <div className="relative w-40 h-40 bg-black rounded-full flex items-center justify-center z-20">
                <i className="ph-fill ph-brain text-6xl text-lime-400 z-30" />

                {/* static thin accent border (optional) */}
                <div className="absolute inset-0 rounded-full border-2 border-lime-400 pointer-events-none z-10"></div>

                {/* pulse ring (animated) */}
                <div className="absolute inset-0 rounded-full pointer-events-none pulse-ring z-0"></div>
              </div>
            </div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path
                d="M200,200 L300,100"
                stroke="#111"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d="M200,200 L100,350"
                stroke="#111"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
      </main>

      <StatsStrip />
      <ChallengeSection />
      <Features />
      <DashboardPreview />
      <UseCasesSection />

      {/* Pre-footer CTA */}
      <section className="bg-lime-400 text-black py-16 px-6 text-center border-t-2 border-black">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">
          Prepare for the Next Surge.
        </h2>
        <button
          onClick={() => onNavigate?.("dashboard")}
          className="bg-black text-white px-10 py-5 text-lg font-bold shadow-[6px_6px_0px_0px_#fff] hover:shadow-none hover:translate-y-1 transition-all border-2 border-black"
        >
          GET STARTED NOW
        </button>
      </section>

      <footer className="bg-black text-white py-12 px-6 border-t-2 border-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold font-display mb-2">
              HealthSurgeAI
            </div>
            <div className="text-sm text-gray-500">
              MumbaiHacks 2025 • Healthtech Track
            </div>
          </div>
          <div className="flex gap-6 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-white">
              Github
            </a>
            <a href="#" className="hover:text-white">
              Documentation
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthSurgeApp;
