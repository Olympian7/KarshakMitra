// This is a mock service that simulates fetching weather data.
// In a real application, you would replace this with a call to a real weather API.

export type WeatherData = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
};

export async function getWeatherForecast(): Promise<WeatherData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  return {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 15,
  };
}
