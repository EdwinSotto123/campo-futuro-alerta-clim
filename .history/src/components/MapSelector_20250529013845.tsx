import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Navigation, MapPin, Search, Loader2, Navigation2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Regiones climáticas de Perú basadas en datos reales
const PERU_CLIMATE_REGIONS = [
  // Costa - Desierto Costero del Pacífico
  { name: 'Amazonas', region: 'Andes', climate: 'Tropical húmedo de montaña', temp: '18-24°C', rainfall: '800-2000mm', type: 'Cwb - Subtropical de montaña' },
  { name: 'Áncash', region: 'Costa-Andes', climate: 'Desértico costero/Andino', temp: '12-25°C', rainfall: '10-800mm', type: 'BWh/BWk - Desértico' },
  { name: 'Apurímac', region: 'Andes', climate: 'Andino templado', temp: '8-20°C', rainfall: '400-1200mm', type: 'Cwb - Subtropical de montaña' },
  { name: 'Arequipa', region: 'Costa-Andes', climate: 'Desértico costero/Andino árido', temp: '8-25°C', rainfall: '10-150mm', type: 'BWk - Desértico frío' },
  { name: 'Ayacucho', region: 'Andes', climate: 'Andino seco', temp: '8-18°C', rainfall: '400-800mm', type: 'BSk - Semiárido frío' },
  { name: 'Cajamarca', region: 'Andes', climate: 'Andino templado húmedo', temp: '11-20°C', rainfall: '600-1000mm', type: 'Cwb - Subtropical de montaña' },
  { name: 'Callao', region: 'Costa', climate: 'Desértico costero', temp: '16-26°C', rainfall: '5-50mm', type: 'BWh - Desértico cálido' },
  { name: 'Cusco', region: 'Andes-Selva', climate: 'Andino/Tropical de montaña', temp: '6-20°C', rainfall: '400-1500mm', type: 'Cwb - Subtropical de montaña' },
  { name: 'Huancavelica', region: 'Andes', climate: 'Andino frío', temp: '4-16°C', rainfall: '500-900mm', type: 'ET - Tundra alpina' },
  { name: 'Huánuco', region: 'Andes-Selva', climate: 'Andino/Tropical de montaña', temp: '12-26°C', rainfall: '800-1500mm', type: 'Cwb/Cwa - Subtropical' },
  { name: 'Ica', region: 'Costa', climate: 'Desértico costero árido', temp: '16-30°C', rainfall: '2-20mm', type: 'BWh - Desértico cálido' },
  { name: 'Junín', region: 'Andes', climate: 'Andino templado', temp: '6-18°C', rainfall: '600-1200mm', type: 'Cwb - Subtropical de montaña' },
  { name: 'La Libertad', region: 'Costa-Andes', climate: 'Desértico costero/Andino', temp: '14-28°C', rainfall: '20-500mm', type: 'BWh/BWk - Desértico' },
  { name: 'Lambayeque', region: 'Costa', climate: 'Desértico costero tropical', temp: '18-32°C', rainfall: '20-200mm', type: 'BWh - Desértico cálido' },
  { name: 'Lima', region: 'Costa', climate: 'Desértico costero templado', temp: '14-28°C', rainfall: '5-50mm', type: 'BWh - Desértico cálido' },
  { name: 'Loreto', region: 'Selva', climate: 'Tropical húmedo amazónico', temp: '24-32°C', rainfall: '2000-3000mm', type: 'Af - Tropical lluvioso' },
  { name: 'Madre de Dios', region: 'Selva', climate: 'Tropical húmedo amazónico', temp: '22-32°C', rainfall: '1500-2500mm', type: 'Af - Tropical lluvioso' },
  { name: 'Moquegua', region: 'Costa-Andes', climate: 'Desértico costero/Andino árido', temp: '10-26°C', rainfall: '10-150mm', type: 'BWk - Desértico frío' },
  { name: 'Pasco', region: 'Andes', climate: 'Andino muy frío', temp: '2-15°C', rainfall: '800-1200mm', type: 'ET - Tundra alpina' },
  { name: 'Piura', region: 'Costa', climate: 'Desértico costero/Tropical seco', temp: '20-34°C', rainfall: '50-800mm', type: 'BWh/BSh - Desértico/Semiárido' },
  { name: 'Puno', region: 'Andes', climate: 'Andino muy frío (Altiplano)', temp: '2-18°C', rainfall: '400-800mm', type: 'ET - Tundra alpina' },
  { name: 'San Martín', region: 'Selva', climate: 'Tropical húmedo amazónico', temp: '22-30°C', rainfall: '1200-2500mm', type: 'Af - Tropical lluvioso' },
  { name: 'Tacna', region: 'Costa', climate: 'Desértico costero árido', temp: '12-28°C', rainfall: '5-50mm', type: 'BWk - Desértico frío' },
  { name: 'Tumbes', region: 'Costa', climate: 'Tropical seco costero', temp: '22-32°C', rainfall: '200-1200mm', type: 'BSh - Semiárido cálido' },
  { name: 'Ucayali', region: 'Selva', climate: 'Tropical húmedo amazónico', temp: '24-32°C', rainfall: '1500-2500mm', type: 'Am - Tropical monzónico' }
];

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  country: string;
  department?: string;
  province?: string;
  district?: string;
  altitude?: number;
  climateData?: {
    region: string;
    climate: string;
    temp: string;
    rainfall: string;
    type: string;
  };
}

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
}

export const MapSelector: React.FC<MapSelectorProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation || null);
  const [climateInfo, setClimateInfo] = useState<any>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [geolocationSupported, setGeolocationSupported] = useState(false);
  // Inicializar el mapa
  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstance.current) return;

    // Verificar soporte de geolocalización
    setGeolocationSupported('geolocation' in navigator);

    // Centro de Perú
    const peruCenter: [number, number] = [-9.19, -75.0152];
    
    mapInstance.current = L.map(mapRef.current).setView(peruCenter, 6);

    // Añadir capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Event listener para clicks en el mapa
    mapInstance.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      await handleMapClick(lat, lng);
    });

    // Añadir marcador inicial si existe
    if (initialLocation) {
      addMarker(initialLocation.lat, initialLocation.lng);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen]);

  const addMarker = (lat: number, lng: number) => {
    if (!mapInstance.current) return;

    // Remover marcador anterior
    if (markerRef.current) {
      mapInstance.current.removeLayer(markerRef.current);
    }

    // Añadir nuevo marcador
    markerRef.current = L.marker([lat, lng]).addTo(mapInstance.current);
    mapInstance.current.setView([lat, lng], 12);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    addMarker(lat, lng);
    
    try {
      // Geocodificación inversa para obtener la dirección
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=PE&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const locationData = await processLocationData(data, lat, lng);
        setSelectedLocation(locationData);
      }    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      // Crear datos básicos si falla la geocodificación
      const basicLocation: LocationData = {
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        country: 'Perú'
      };
      setSelectedLocation(basicLocation);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=PE&addressdetails=1&limit=5`
      );
      
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsSearching(false);
    }
  };
  const selectSearchResult = async (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    addMarker(lat, lng);
    const locationData = await processLocationData(result, lat, lng);
    setSelectedLocation(locationData);
    setSearchResults([]);
    setSearchQuery('');
  };

  const detectCurrentLocation = () => {
    if (!geolocationSupported) {
      alert('La geolocalización no está soportada en este navegador.');
      return;
    }

    setIsDetectingLocation(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Verificar si la ubicación está en Perú (aproximadamente)
        // Perú: Latitud -18.35 a 0.01, Longitud -81.32 a -68.65
        const isInPeru = latitude >= -18.35 && latitude <= 0.01 && 
                         longitude >= -81.32 && longitude <= -68.65;

        if (!isInPeru) {
          alert('Su ubicación actual no parece estar en Perú. El mapa se centrará en su ubicación, pero los datos climáticos están optimizados para Perú.');
        }

        try {
          await handleMapClick(latitude, longitude);
        } catch (error) {
          console.error('Error al procesar la ubicación detectada:', error);
          // Añadir marcador aunque falle la geocodificación
          addMarker(latitude, longitude);
          const basicLocation: LocationData = {
            lat: latitude,
            lng: longitude,
            address: `Ubicación actual: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          };
          setSelectedLocation(basicLocation);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = 'No se pudo obtener su ubicación. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permiso de ubicación denegado. Por favor, habilite la ubicación en su navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMessage += 'El tiempo de espera para obtener la ubicación ha expirado.';
            break;
          default:
            errorMessage += 'Error desconocido al obtener la ubicación.';
            break;
        }
        
        alert(errorMessage);
      },
      options
    );
  };
  const processLocationData = async (geocodeData: any, lat: number, lng: number): Promise<LocationData> => {
    const address = geocodeData.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const addressParts = geocodeData.address || {};
    
    // Obtener información básica de ubicación
    const country = addressParts.country || 'Perú';
    const department = addressParts.state || addressParts.region;
    const province = addressParts.county || addressParts.municipality;
    const district = addressParts.city || addressParts.town || addressParts.village || addressParts.suburb;
    
    // Obtener elevación real usando la API de open-elevation.com
    let altitude: number | undefined;
    try {
      const elevationResponse = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
      );
      if (elevationResponse.ok) {
        const elevationData = await elevationResponse.json();
        if (elevationData.results && elevationData.results.length > 0) {
          altitude = Math.round(elevationData.results[0].elevation);
        }
      }
    } catch (error) {
      console.warn('Error obteniendo elevación:', error);
      // Fallback: estimar elevación basada en región
      if (department) {
        const climateRegion = PERU_CLIMATE_REGIONS.find(dept => 
          dept.name.toLowerCase().includes(department.toLowerCase()) ||
          department.toLowerCase().includes(dept.name.toLowerCase())
        );
        if (climateRegion) {
          // Estimaciones básicas por región
          if (climateRegion.region === 'Costa') altitude = Math.round(50 + Math.random() * 200);
          else if (climateRegion.region === 'Andes') altitude = Math.round(3000 + Math.random() * 1500);
          else if (climateRegion.region === 'Selva') altitude = Math.round(200 + Math.random() * 300);
        }
      }
    }

    // Buscar información climática del departamento con mejor matching
    const climateData = department ? 
      PERU_CLIMATE_REGIONS.find(dept => {
        const deptNameLower = dept.name.toLowerCase();
        const searchDeptLower = department.toLowerCase();
        
        // Búsqueda exacta primero
        if (deptNameLower === searchDeptLower) return true;
        
        // Búsqueda por inclusión en ambas direcciones
        if (deptNameLower.includes(searchDeptLower) || searchDeptLower.includes(deptNameLower)) return true;
        
        // Búsqueda por palabras clave
        const keywords = searchDeptLower.split(' ');
        return keywords.some(keyword => keyword.length > 3 && deptNameLower.includes(keyword));
      }) : null;

    setClimateInfo(climateData);

    return {
      lat,
      lng,
      address,
      country,
      department,
      province,
      district,
      altitude,
      climateData
    };
  };

  const handleConfirmSelection = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Seleccionar Ubicación Geográfica - Perú
              </CardTitle>              <CardDescription>
                Busque y seleccione su ubicación para análisis climático preciso.
                {geolocationSupported && (
                  <span className="block text-blue-600 text-xs mt-1">
                    💡 Use "Mi ubicación" para detectar automáticamente su posición actual
                  </span>
                )}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">          {/* Buscador */}
          <div className="flex gap-2">
            <Input
              placeholder="Buscar ciudad, distrito, provincia en Perú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              className="flex-1"
            />
            <Button 
              onClick={searchLocation} 
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar
            </Button>
            {geolocationSupported && (
              <Button 
                onClick={detectCurrentLocation} 
                disabled={isDetectingLocation}
                variant="outline"
                className="flex items-center gap-2"
                title="Detectar mi ubicación actual"
              >
                {isDetectingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation2 className="h-4 w-4" />
                )}
                Mi ubicación
              </Button>
            )}
          </div>

          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <Card className="max-h-40 overflow-y-auto">
              <CardContent className="p-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center gap-2"
                    onClick={() => selectSearchResult(result)}
                  >
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{result.display_name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Contenedor del mapa */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div 
                ref={mapRef} 
                className="h-96 w-full rounded-lg border"
                style={{ minHeight: '384px' }}
              />
            </div>

            {/* Panel de información */}
            <div className="space-y-4">
              {selectedLocation && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ubicación Seleccionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Dirección:</p>
                      <p className="text-xs text-gray-600">{selectedLocation.address}</p>
                    </div>
                    
                    {selectedLocation.department && (
                      <div>
                        <p className="text-sm font-medium">Departamento:</p>
                        <Badge variant="secondary">{selectedLocation.department}</Badge>
                      </div>
                    )}
                    
                    {selectedLocation.province && (
                      <div>
                        <p className="text-sm font-medium">Provincia:</p>
                        <Badge variant="outline">{selectedLocation.province}</Badge>
                      </div>
                    )}
                    
                    {selectedLocation.district && (
                      <div>
                        <p className="text-sm font-medium">Distrito:</p>
                        <Badge variant="outline">{selectedLocation.district}</Badge>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium">Coordenadas:</p>
                      <p className="text-xs text-gray-600">
                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información climática */}
              {climateInfo && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Información Climática</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-xs font-medium">Clima:</p>
                      <p className="text-xs text-gray-600">{climateInfo.climate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Temperatura:</p>
                      <p className="text-xs text-gray-600">{climateInfo.temp}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Precipitación:</p>
                      <p className="text-xs text-gray-600">{climateInfo.rainfall}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              disabled={!selectedLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Confirmar Ubicación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSelector;