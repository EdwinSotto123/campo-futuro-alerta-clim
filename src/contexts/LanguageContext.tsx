import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definir el tipo para el contexto
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

// Crear el contexto con valores por defecto
const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
});

// Hook personalizado para usar el contexto
export const useLanguage = () => useContext(LanguageContext);

// Props para el provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Componente Provider
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Intentar obtener el idioma guardado en localStorage, o usar español por defecto
  const [language, setLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem("userLanguage");
    return savedLanguage || "es";
  });

  // Guardar el idioma en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("userLanguage", language);
    // Aquí podrías cargar traducciones o configurar la aplicación según el idioma
    document.documentElement.lang = language;
  }, [language]);

  // Proporcionar el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 