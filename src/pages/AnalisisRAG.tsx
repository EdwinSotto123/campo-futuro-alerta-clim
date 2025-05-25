
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Search, FileText, Zap, Globe, Users, Lightbulb } from "lucide-react";

const AnalisisRAGPage = () => {
  const [query, setQuery] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("tradicional");
  
  const knowledgeBases = [
    {
      id: "tradicional",
      name: "Conocimiento Tradicional Andino",
      description: "Prácticas ancestrales de agricultura sostenible",
      documents: "2,500+ documentos",
      icon: Globe
    },
    {
      id: "cientifico", 
      name: "Literatura Científica",
      description: "Investigación académica sobre cambio climático",
      documents: "15,000+ papers",
      icon: FileText
    },
    {
      id: "gobiernos",
      name: "Políticas Gubernamentales",
      description: "Regulaciones y programas de apoyo agrícola",
      documents: "800+ documentos oficiales",
      icon: Users
    },
    {
      id: "casos",
      name: "Casos de Éxito",
      description: "Experiencias exitosas de adaptación climática",
      documents: "1,200+ casos documentados",
      icon: Lightbulb
    }
  ];

  const ragExamples = [
    {
      question: "¿Cómo implementar agricultura regenerativa en el Altiplano?",
      sources: ["Conocimiento Tradicional", "Papers Científicos"],
      confidence: 95,
      summary: "Combinación de técnicas ancestrales como waru waru con métodos modernos de compostaje y rotación de cultivos."
    },
    {
      question: "¿Qué variedades de papa son más resistentes a sequías?",
      sources: ["CIP Database", "Conocimiento Local"],
      confidence: 88,
      summary: "Variedades nativas como 'Chaucha amarilla' y 'Peruanita' muestran mayor resistencia a estrés hídrico."
    },
    {
      question: "¿Cuáles son los indicadores tempranos de El Niño?",
      sources: ["SENAMHI", "Literatura Científica"],
      confidence: 92,
      summary: "Anomalías de temperatura superficial del mar, cambios en patrones de viento y precipitación atípica."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agriculture-terracotta">Sistema RAG Climático</h1>
          <p className="text-muted-foreground">
            Retrieval Augmented Generation con Watson Discovery + IBM Watson
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-500/20 text-purple-700">
          RAG + NLP + Vector DB
        </Badge>
      </div>

      <Tabs defaultValue="consulta" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="consulta">Consulta RAG</TabsTrigger>
          <TabsTrigger value="conocimiento">Bases de Conocimiento</TabsTrigger>
          <TabsTrigger value="ejemplos">Ejemplos</TabsTrigger>
          <TabsTrigger value="api">API & Embeddings</TabsTrigger>
        </TabsList>

        <TabsContent value="consulta" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Consulta Inteligente
                  </CardTitle>
                  <CardDescription>
                    Haz preguntas complejas sobre agricultura y clima usando lenguaje natural
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tu pregunta:</label>
                    <Textarea
                      placeholder="Ej: ¿Cuáles son las mejores prácticas para adaptar cultivos de quinua al cambio climático en zonas del Altiplano peruano con precipitaciones irregulares?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="min-h-24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Base de conocimiento:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {knowledgeBases.map((kb) => (
                        <Button
                          key={kb.id}
                          variant={selectedKnowledgeBase === kb.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedKnowledgeBase(kb.id)}
                          className="justify-start text-left h-auto p-3"
                        >
                          <kb.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-xs">{kb.name}</p>
                            <p className="text-xs opacity-70">{kb.documents}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                    <Search className="h-4 w-4 mr-2" />
                    Analizar con RAG
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resultado del Análisis RAG</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-md border-l-4 border-purple-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Respuesta Generada</h4>
                        <Badge variant="secondary">Confianza: 94%</Badge>
                      </div>
                      <p className="text-sm text-gray-700">
                        Para adaptar cultivos de quinua al cambio climático en el Altiplano con precipitaciones irregulares, 
                        se recomienda: 1) Implementar sistemas de captación de agua de lluvia (qochas) basados en tecnología 
                        ancestral, 2) Usar variedades nativas resistentes como 'Blanca de Juli' y 'Cheweca', 3) Aplicar 
                        mulching orgánico para conservar humedad, 4) Establecer sistemas de alerta temprana...
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Fuentes utilizadas:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs p-2 bg-muted rounded">
                          <FileText className="h-3 w-3" />
                          <span>Altieri, M. (2018) - Agroecología Andina</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs p-2 bg-muted rounded">
                          <Globe className="h-3 w-3" />
                          <span>Conocimiento Q'ero - Técnicas tradicionales</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs p-2 bg-muted rounded">
                          <Database className="h-3 w-3" />
                          <span>INIA - Variedades de quinua resistentes</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs p-2 bg-muted rounded">
                          <Users className="h-3 w-3" />
                          <span>MINAGRI - Políticas de adaptación</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sugerencias de Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <p className="text-xs font-medium">Técnicas de conservación</p>
                        <p className="text-xs text-muted-foreground">Métodos ancestrales vs modernos</p>
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <p className="text-xs font-medium">Predicción de eventos</p>
                        <p className="text-xs text-muted-foreground">Indicadores naturales de clima</p>
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <p className="text-xs font-medium">Rotación de cultivos</p>
                        <p className="text-xs text-muted-foreground">Optimización sostenible</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estadísticas RAG</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Documentos indexados</span>
                      <Badge variant="outline">19,500+</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consultas procesadas</span>
                      <Badge variant="outline">2,847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Precisión promedio</span>
                      <Badge variant="outline">91.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tiempo de respuesta</span>
                      <Badge variant="outline">1.8s</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conocimiento" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knowledgeBases.map((kb) => (
              <Card key={kb.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <kb.icon className="h-5 w-5 text-agriculture-earth" />
                    {kb.name}
                  </CardTitle>
                  <CardDescription>{kb.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Documentos:</span>
                      <Badge variant="outline">{kb.documents}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Última actualización:</span>
                      <span className="text-xs text-muted-foreground">Hace 2 días</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Explorar Base de Datos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ejemplos" className="space-y-4">
          <div className="space-y-4">
            {ragExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{example.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{example.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {example.sources.map((source, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                      <Badge variant="outline">
                        Confianza: {example.confidence}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integración con Watson Discovery</CardTitle>
              <CardDescription>API endpoints y configuración de embeddings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Vector Database
                    </h4>
                    <p className="text-sm text-gray-600">
                      Watson Discovery con embeddings de 768 dimensiones para búsqueda semántica
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Modelos NLP
                    </h4>
                    <p className="text-sm text-gray-600">
                      Watson NLU para extracción de entidades y análisis de sentimientos
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-black rounded-md">
                  <pre className="text-green-400 text-xs">
{`// Ejemplo de consulta RAG API
const ragQuery = await fetch('/api/rag/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "técnicas adaptación climática quinua",
    knowledge_base: "tradicional",
    max_results: 5,
    confidence_threshold: 0.8
  })
});`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalisisRAGPage;
