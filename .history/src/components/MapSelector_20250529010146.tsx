import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Search, 
  X, 
  Navigation, 
  Mountain,
  Thermometer,
  Droplets,
  Info,
  CheckCircle
} from 'lucide-react';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  latitud: number;
  longitud: number;
  direccion: string;
  departamento: string;
  provincia: string;
  municipio: string;
  comunidad: string;
  altitud: number;
  zonaClimatica: string;
  precipitacionAnual: number;
  temperaturaPromedio: number;
}

interface LocationSearchResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    state?: string;
    county?: string;
    city?: string;
    village?: string;
    town?: string;
  };
  annotations?: {
    elevation?: {
      meters?: number;
    };
  };
}

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  currentLocation?: LocationData;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  currentLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');

  // Datos climáticos de Bolivia por departamento (datos aproximados)
  const climateData: Record<string, {
    zonaClimatica: string;
    precipitacionAnual: number;
    temperaturaPromedio: number;
  }> = {
    'La Paz': {
      zonaClimatica: 'Altiplano Norte',
      precipitacionAnual: 650,
      temperaturaPromedio: 8.5
    },
    'Oruro': {
      zonaClimatica: 'Altiplano Central',
      precipitacionAnual: 400,
      temperaturaPromedio: 9.2
    },
    'Potosí': {
      zonaClimatica: 'Altiplano Sur',
      precipitacionAnual: 350,
      temperaturaPromedio: 7.8
    },
    'Cochabamba': {
      zonaClimatica: 'Valles Interandinos',
      precipitacionAnual: 550,
      temperaturaPromedio: 17.5
    },
    'Chuquisaca': {
      zonaClimatica: 'Valles Interandinos',
      precipitacionAnual: 600,
      temperaturaPromedio: 19.2
    },
    'Tarija': {
      zonaClimatica: 'Valles Interandinos',
      precipitacionAnual: 750,
      temperaturaPromedio: 18.8
    },
    'Santa Cruz': {
      zonaClimatica: 'Llanos Orientales',
      precipitacionAnual: 1200,
      temperaturaPromedio: 25.3
    },
    'Beni': {
      zonaClimatica: 'Amazonia Norte',
      precipitacionAnual: 1800,
      temperaturaPromedio: 26.5
    },
    'Pando': {
      zonaClimatica: 'Amazonia Norte',
      precipitacionAnual: 1900,
      temperaturaPromedio: 25.8
    }
  };

  // Inicializar mapa
  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      currentLocation ? [currentLocation.latitud, currentLocation.longitud] : [-16.2902, -63.5887], 
      currentLocation ? 10 : 6
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir marcador si hay ubicación actual
    if (currentLocation) {
      const marker = L.marker([currentLocation.latitud, currentLocation.longitud])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <strong>${currentLocation.direccion}</strong><br/>
            <small>Lat: ${currentLocation.latitud.toFixed(4)}, Lng: ${currentLocation.longitud.toFixed(4)}</small>
          </div>
        `);
      markerRef.current = marker;
    }

    // Click en el mapa
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      await handleMapClick(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, currentLocation]);

  // Función para manejar click en el mapa
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      setError('');
      
      // Remover marcador anterior
      if (markerRef.current) {
        mapInstanceRef.current?.removeLayer(markerRef.current);
      }

      // Añadir nuevo marcador
      const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
      markerRef.current = marker;

      // Obtener información de la ubicación (simulado)
      const locationData = await reverseGeocode(lat, lng);
      setSelectedLocation(locationData);

      marker.bindPopup(`
        <div class="p-3 min-w-[200px]">
          <strong class="text-sm">${locationData.direccion}</strong><br/>
          <div class="text-xs text-gray-600 mt-1">
            <div>Departamento: ${locationData.departamento}</div>
            <div>Altitud: ${locationData.altitud}m</div>
            <div>Zona: ${locationData.zonaClimatica}</div>
            <div>Temp. prom: ${locationData.temperaturaPromedio}°C</div>
            <div>Precipitación: ${locationData.precipitacionAnual}mm/año</div>
          </div>
        </div>
      `).openPopup();

    } catch (error) {
      console.error('Error handling map click:', error);
      setError('Error al obtener información de la ubicación');
    }
  };

  // Función de búsqueda (simulada - en producción usarías Nominatim o OpenCage)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      // Simulación de resultados de búsqueda para Bolivia
      const mockResults: LocationSearchResult[] = [
        {
          formatted: `${searchQuery}, La Paz, Bolivia`,
          geometry: { lat: -16.5000 + Math.random() * 0.1, lng: -68.1500 + Math.random() * 0.1 },
          components: { state: 'La Paz', city: searchQuery },
          annotations: { elevation: { meters: 3500 + Math.random() * 1000 } }
        },
        {
          formatted: `${searchQuery}, Cochabamba, Bolivia`,
          geometry: { lat: -17.3895 + Math.random() * 0.1, lng: -66.1568 + Math.random() * 0.1 },
          components: { state: 'Cochabamba', city: searchQuery },
          annotations: { elevation: { meters: 2500 + Math.random() * 500 } }
        },
        {
          formatted: `${searchQuery}, Santa Cruz, Bolivia`,
          geometry: { lat: -17.8146 + Math.random() * 0.1, lng: -63.1561 + Math.random() * 0.1 },
          components: { state: 'Santa Cruz', city: searchQuery },
          annotations: { elevation: { meters: 400 + Math.random() * 200 } }
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay
      setSearchResults(mockResults);

    } catch (error) {
      console.error('Error searching:', error);
      setError('Error al buscar la ubicación');
    } finally {
      setIsSearching(false);
    }
  };

  // Función de geocodificación inversa (simulada)
  const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Determinar departamento basado en coordenadas (simplificado)
    let departamento = 'La Paz';
    if (lat > -17 && lng > -65) departamento = 'Santa Cruz';
    else if (lat > -17.5 && lng > -66.5) departamento = 'Cochabamba';
    else if (lat < -19) departamento = 'Potosí';

    const climate = climateData[departamento] || climateData['La Paz'];
    
    return {
      latitud: lat,
      longitud: lng,
      direccion: `Ubicación seleccionada, ${departamento}, Bolivia`,
      departamento,
      provincia: 'Provincia seleccionada',
      municipio: 'Municipio seleccionado',
      comunidad: 'Comunidad seleccionada',
      altitud: Math.round(3000 + Math.random() * 2000),
      zonaClimatica: climate.zonaClimatica,
      precipitacionAnual: climate.precipitacionAnual,
      temperaturaPromedio: climate.temperaturaPromedio
    };
  };

  // Manejar selección de resultado de búsqueda
  const handleSearchResultSelect = async (result: LocationSearchResult) => {
    const { lat, lng } = result.geometry;
    
    // Centrar mapa y hacer zoom
    mapInstanceRef.current?.setView([lat, lng], 12);
    
    // Manejar como click en el mapa
    await handleMapClick(lat, lng);
    
    // Limpiar resultados
    setSearchResults([]);
    setSearchQuery('');
  };

  // Confirmar selección
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Seleccionar Ubicación Geográfica
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Buscar ciudad, comunidad o ubicación en Bolivia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium">Resultados de búsqueda</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-32">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleSearchResultSelect(result)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{result.formatted}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Seleccionar
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Información de ubicación seleccionada */}
          {selectedLocation && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Ubicación Seleccionada
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Dirección:</strong> {selectedLocation.direccion}
                  </div>
                  <div>
                    <strong>Departamento:</strong> {selectedLocation.departamento}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mountain className="h-4 w-4 text-gray-600" />
                    <strong>Altitud:</strong> {selectedLocation.altitud}m
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <strong>Temperatura:</strong> {selectedLocation.temperaturaPromedio}°C
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <strong>Precipitación:</strong> {selectedLocation.precipitacionAnual}mm/año
                  </div>
                  <div>
                    <strong>Zona Climática:</strong> {selectedLocation.zonaClimatica}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mapa */}
          <div className="flex-1 min-h-[300px] border rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Instrucciones */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Haz clic en el mapa para seleccionar una ubicación o usa la búsqueda para encontrar un lugar específico en Bolivia.
            </AlertDescription>
          </Alert>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Ubicación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSelector;
