import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

// Definir los idiomas disponibles
const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "qu", name: "Runasimi (Quechua)", flag: "🇵🇪" },
];

// Interfaz para las props del componente
interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
}

const LanguageSelector = ({
  currentLanguage = "es",
  onLanguageChange = () => {},
}: LanguageSelectorProps) => {
  // Estado local para el idioma seleccionado (como respaldo)
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  // Encontrar el idioma actual
  const currentLang = languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  // Manejar el cambio de idioma
  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    onLanguageChange(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <span className="hidden md:inline-block text-xs font-medium">
            {currentLang.flag} {currentLang.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 ${
              language.code === selectedLanguage ? "bg-muted font-medium" : ""
            }`}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector; 