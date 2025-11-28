export interface WeatherData {
    temp: number;
    aqi: number;
    humidity: number;
    condition: string;
    trend: "rising" | "falling" | "stable";
}

export const getSimulatedWeather = (): WeatherData => {
    const now = new Date();
    const hour = now.getHours();

    // Temperature Cycle (Low at 4AM, High at 2PM)
    // Base 28, Amplitude 5
    const tempBase = 28;
    const temp = tempBase + 5 * Math.sin((hour - 8) * (Math.PI / 12));

    // AQI Cycle (High during traffic hours: 9AM & 6PM)
    // Base 120, Spikes at 9 and 18
    let aqi = 120;
    if (hour >= 8 && hour <= 11) aqi += 50 + Math.random() * 20; // Morning rush
    if (hour >= 17 && hour <= 20) aqi += 60 + Math.random() * 30; // Evening rush
    if (hour >= 0 && hour <= 5) aqi -= 30; // Night

    // Add some random noise
    const currentTemp = Math.round((temp + (Math.random() - 0.5)) * 10) / 10;
    const currentAQI = Math.round(aqi + (Math.random() * 10 - 5));

    let condition = "Clear";
    if (currentAQI > 200) condition = "Haze";
    if (currentAQI > 300) condition = "Smog";

    return {
        temp: currentTemp,
        aqi: currentAQI,
        humidity: 65 + Math.round(Math.random() * 10),
        condition,
        trend: hour < 14 ? "rising" : "falling"
    };
};
