import { Cloud, Sun, Droplets, Wind, ThermometerSun } from "lucide-react";
import { Card } from "@/components/ui/card";

const WeatherDashboard = () => {
  // Datos de ejemplo (en un caso real vendrían de una API)
  const weatherData = {
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    condition: "Parcialmente nublado",
    forecast: [
      { day: "Hoy", temp: 22, condition: "cloud" },
      { day: "Mañana", temp: 24, condition: "sun" },
      { day: "Miércoles", temp: 21, condition: "cloud" },
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-primary">Dashboard Climático</h2>
      
      {/* Tarjeta principal del clima actual */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-2xl font-semibold">{weatherData.condition}</p>
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-6 w-6 text-orange-500" />
              <span className="text-4xl font-bold">{weatherData.temperature}°C</span>
            </div>
          </div>
          <Cloud className="h-16 w-16 text-blue-500" />
        </div>
      </Card>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humedad</p>
              <p className="text-2xl font-semibold">{weatherData.humidity}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Wind className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Velocidad del Viento</p>
              <p className="text-2xl font-semibold">{weatherData.windSpeed} km/h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Sun className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Índice UV</p>
              <p className="text-2xl font-semibold">Moderado</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pronóstico de los próximos días */}
      <div className="grid grid-cols-3 gap-4">
        {weatherData.forecast.map((day, index) => (
          <Card key={index} className="p-4 text-center">
            <p className="font-medium">{day.day}</p>
            {day.condition === "sun" ? (
              <Sun className="h-8 w-8 mx-auto my-2 text-yellow-500" />
            ) : (
              <Cloud className="h-8 w-8 mx-auto my-2 text-blue-500" />
            )}
            <p className="text-xl font-semibold">{day.temp}°C</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard; 