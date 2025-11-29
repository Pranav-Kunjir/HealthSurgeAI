import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { Sidebar } from "../Components/Sidebar";
import { Overview } from "../Components/DashboardViews/Overview";
import { PredictionsView } from "../Components/DashboardViews/PredictionsView";
import { ResourcesView } from "../Components/DashboardViews/ResourcesView";
import { BedManagementView } from "../Components/DashboardViews/BedManagementView";
import { AlertsView } from "../Components/DashboardViews/AlertsView";

import { SettingsView } from "../Components/DashboardViews/SettingsView";
import { NotificationsView } from "../Components/DashboardViews/NotificationsView";

import { ContactsView } from "../Components/DashboardViews/ContactsView";

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("overview");

    // Shared Alerts State
    const [alerts, setAlerts] = useState([
        {
            title: "Diwali Surge Warning",
            type: "Critical",
            time: "2 mins ago",
            desc: "Predicted 40% increase in burn cases. Activate Burn Unit Protocol B.",
            action: "Protocol Activated",
        },
        {
            title: "High Pollution Levels",
            type: "Warning",
            time: "15 mins ago",
            desc: "AQI > 300. Prepare respiratory support equipment.",
            action: "Acknowledge",
        },
        {
            title: "Staff Shortage: Shift B",
            type: "Warning",
            time: "1 hour ago",
            desc: "Shortfall of 2 nurses in ICU. Agency staff requested.",
            action: "View Request",
        },
    ]);

    const [hasSimulationAlert, setHasSimulationAlert] = useState(false);

    // Load Simulation Alert
    React.useEffect(() => {
        if (hasSimulationAlert) return;
        try {
            const stored = window.localStorage.getItem("healthsurge_last_simulation");
            if (!stored) return;

            const sim = JSON.parse(stored) as {
                patients: number;
                beds: number;
                aqi?: number;
                temp?: number;
            };

            const severity: "Critical" | "Warning" = sim.patients > 800 ? "Critical" : "Warning";

            setAlerts(prev => [
                {
                    title: "Simulation: Surge Forecast for Tomorrow",
                    type: severity,
                    time: "From last scenario run",
                    desc: `Scenario predicts ${sim.patients} patients and ${sim.beds}% bed occupancy. AQI ${sim.aqi ?? "-"}, Temp ${sim.temp ?? "-"}°C.`,
                    action: "Open Prediction View",
                },
                ...prev,
            ]);
            setHasSimulationAlert(true);
        } catch (error) {
            console.error("Failed to load last simulation for alerts", error);
        }
    }, [hasSimulationAlert]);

    const [agenticInsight, setAgenticInsight] = useState<string | null>(null);
    const [recommendedActions, setRecommendedActions] = useState<string[]>([]);

    // Check AI Prediction Alert
    React.useEffect(() => {
        const checkSurge = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: new Date().toISOString().split('T')[0],
                        aqi: 150,
                        temp: 32,
                        humidity: 70,
                        is_festival: 0
                    })
                });
                const data = await response.json();

                if (data.reasoning && data.reasoning.length > 0) {
                    setAgenticInsight(data.reasoning.join(" "));
                }

                if (data.actions && data.actions.length > 0) {
                    setRecommendedActions(data.actions);
                }

                if (data.predicted_patients > 800) { // Threshold
                    setAlerts(prev => {
                        // Avoid duplicates if possible, or just prepend
                        if (prev.some(a => a.title === "AI PREDICTION: Patient Surge")) return prev;
                        return [
                            {
                                title: "AI PREDICTION: Patient Surge",
                                type: "Critical",
                                time: "Just now",
                                desc: `Model predicts ${data.predicted_patients} patients tomorrow. ${data.reasoning ? data.reasoning[0] : ''}`,
                                action: "Review Staffing"
                            },
                            ...prev
                        ];
                    });
                }
            } catch (error) {
                console.error("Failed to check surge", error);
            }
        };
        checkSurge();
    }, []);

    const renderView = () => {
        switch (activeTab) {
            case "overview":
                return <Overview alerts={alerts} onNavigate={setActiveTab} insight={agenticInsight} actions={recommendedActions} />;
            case "beds":
                return <BedManagementView />;
            case "predictions":
                return <PredictionsView />;
            case "resources":
                return <ResourcesView />;
            case "alerts":
                return <AlertsView alerts={alerts} />;
            case "notifications":
                return <NotificationsView />;
            case "settings":
                return <SettingsView />;
            case "contacts":
                return <ContactsView />;
            default:
                return <Overview alerts={alerts} onNavigate={setActiveTab} insight={agenticInsight} actions={recommendedActions} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-black">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 p-6 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;
