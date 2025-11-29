import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export const PredictionsView: React.FC = () => {
  // State for Scenario Simulator
  const [aqi, setAqi] = useState(150);
  const [temp, setTemp] = useState(32);
  const [population, setPopulation] = useState(100); // % of normal
  const [trendData, setTrendData] = useState<{ day: number; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulationResult, setSimulationResult] = useState<{ patients: number; beds: number } | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  // Derived simulation value (visual only)
  const simulatedSurge = Math.round(
    (aqi / 100) * 10 + (temp > 35 ? 15 : 0) + (population - 100) * 0.5,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch historical data first
        const histResponse = await fetch(`${API_BASE_URL}/historical`);
        const histData = await histResponse.json();

        // Prepare data for chart (last 30 days)
        const chartData = histData.slice(-30).map((d: any, i: number) => ({
          day: i + 1,
          value: d.Patients
        }));
        setTrendData(chartData);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const runSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0], // Today
          aqi: aqi,
          temp: temp,
          humidity: 70, // Default
          is_festival: 0 // Default
        }),
      });
      const data = await response.json();

      setSimulationResult({
        patients: data.predicted_patients,
        beds: data.predicted_bed_occupancy
      });

      setToast({
        title: "AI Surge Forecast Ready",
        message: `Scenario: ${data.predicted_patients} patients, ${data.predicted_bed_occupancy}% bed occupancy. System Alerts & Overview updated from this run.`,
      });
      setTimeout(() => setToast(null), 5000);

      try {
        const simulationPayload = {
          timestamp: new Date().toISOString(),
          patients: data.predicted_patients,
          beds: data.predicted_bed_occupancy,
          aqi,
          temp,
          population,
          humidity: 70,
          isFestival: 0,
        };
        window.localStorage.setItem(
          "healthsurge_last_simulation",
          JSON.stringify(simulationPayload),
        );
      } catch (storageError) {
        console.error("Failed to persist simulation", storageError);
      }

      // Update chart with prediction: Shift left and append new value
      setTrendData(prev => {
        const newData = [...prev.slice(1), { day: 30, value: data.predicted_patients }];
        // Re-index days
        return newData.map((d, i) => ({ ...d, day: i + 1 }));
      });

    } catch (error) {
      console.error("Error running simulation:", error);
    }
  };

  // Dynamic Scaling Helper
  const getPoints = () => {
    if (trendData.length === 0) return "";
    const values = trendData.map(d => d.value);
    const min = Math.min(...values) * 0.9; // Buffer
    const max = Math.max(...values) * 1.1; // Buffer
    const range = max - min;

    return trendData.map((d, i) => {
      const x = (i / (trendData.length - 1)) * 100;
      const y = 100 - ((d.value - min) / range) * 100;
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-black text-white border-2 border-lime-400 shadow-[6px_6px_0px_0px_#bef264] p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="mt-0.5">
            <span className="inline-flex w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase text-lime-300 mb-1">{toast.title}</div>
            <div className="text-sm leading-snug">{toast.message}</div>
          </div>
        </div>
      )}
      <header className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Predictions</h1>
          <p className="text-gray-500">
            AI-driven forecast for the next 30 days.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-bold hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-black text-white border-2 border-black rounded text-sm font-bold hover:bg-gray-800">
            Adjust Parameters
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Trend Chart */}
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#111]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold font-display">
                30-Day Patient Influx Trend
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-black"></span> Historical
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-lime-400 border border-black"></span>{" "}
                  Predicted
                </div>
              </div>
            </div>

            {/* CSS/SVG Line Chart */}
            <div className="h-64 w-full relative border-l border-b border-gray-200">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">Loading...</div>
              ) : (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={100 - y}
                      x2="100"
                      y2={100 - y}
                      stroke="#f3f4f6"
                      strokeWidth="0.2"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}

                  {/* Trend Line */}
                  <polyline
                    points={getPoints()}
                    fill="none"
                    stroke="#0b0b0b"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Area under curve */}
                  <polygon
                    points={`0,100 ${getPoints()} 100,100`}
                    fill="url(#gradient)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ccff00" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* X-Axis Labels */}
              <div className="absolute top-full w-full flex justify-between text-[10px] text-gray-400 mt-2">
                <span>Day 1</span>
                <span>Day 15</span>
                <span>Day 30</span>
              </div>
            </div>
          </div>

          {/* Contributing Factors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <i className="ph-fill ph-cloud-sun text-xl text-orange-500"></i>
                <h3 className="font-bold text-sm">Weather Impact</h3>
              </div>
              <div className="text-2xl font-bold mb-1">High</div>
              <p className="text-xs text-gray-500">
                AQI levels rising. Expect +15% respiratory cases.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <i className="ph-fill ph-calendar-star text-xl text-purple-500"></i>
                <h3 className="font-bold text-sm">Seasonal Events</h3>
              </div>
              <div className="text-2xl font-bold mb-1">Diwali</div>
              <p className="text-xs text-gray-500">
                Festival week approaching. Burn unit preparation advised.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <i className="ph-fill ph-trend-up text-xl text-red-500"></i>
                <h3 className="font-bold text-sm">Epidemic Trend</h3>
              </div>
              <div className="text-2xl font-bold mb-1">Stable</div>
              <p className="text-xs text-gray-500">
                Dengue cases stabilizing in the region.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Scenario Simulator (New) */}
        <div className="bg-black text-white p-6 shadow-[6px_6px_0px_0px_#bef264] border-2 border-lime-400 h-fit">
          <h2 className="text-lg font-bold font-display mb-1 text-lime-400">
            Scenario Simulator
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Adjust variables to simulate impact.
          </p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>AQI Level</span>
                <span className="text-lime-400">{aqi}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                value={aqi}
                onChange={(e) => setAqi(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Temperature (°C)</span>
                <span className="text-lime-400">{temp}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Population Density</span>
                <span className="text-lime-400">{population}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
            </div>

            <div className="pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">
                Simulated Impact
              </div>
              {simulationResult ? (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-4xl font-bold font-display text-lime-400">
                    {simulationResult.patients}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Predicted Patients (Bed Occ: {simulationResult.beds}%)
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold font-display text-lime-400">
                    +{simulatedSurge}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Est. increase (Run simulation for exact)
                  </div>
                </>
              )}
            </div>

            <button
              onClick={runSimulation}
              className="w-full py-3 bg-lime-400 text-black font-bold text-sm hover:bg-lime-300 transition-colors"
            >
              Run Full Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
