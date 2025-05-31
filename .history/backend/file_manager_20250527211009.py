import os
from datetime import datetime
from typing import Optional
from config import Config

class FileManager:
    """Handle file operations for agricultural alerts"""
    
    def __init__(self, base_path: Optional[str] = None):
        if base_path:
            self.base_path = base_path
        else:
            self.base_path = os.path.dirname(__file__)
        
        # Create alerts directory
        self.alerts_dir = os.path.join(self.base_path, Config.ALERTS_DIR_NAME)
        os.makedirs(self.alerts_dir, exist_ok=True)
        
        # ÚNICO archivo para TODAS las alertas
        self.consolidated_file = os.path.join(self.alerts_dir, Config.CONSOLIDATED_FILE_NAME)
        
        print(f"📁 Directorio de alertas: {self.alerts_dir}")
        print(f"📄 ÚNICO ARCHIVO CONSOLIDADO: {self.consolidated_file}")
        
        # Initialize consolidated file if it doesn't exist
        self._initialize_consolidated_file()
    
    def _initialize_consolidated_file(self):
        """Initialize the consolidated alerts file if it doesn't exist"""
        if not os.path.exists(self.consolidated_file):
            header = f"""
===============================================
    CAMPO FUTURO - ALERTAS AGRÍCOLAS
    Sistema de Inteligencia para el Campo
===============================================
Archivo creado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Última actualización: Se actualiza automáticamente
===============================================

"""
            try:
                with open(self.consolidated_file, 'w', encoding='utf-8') as f:
                    f.write(header)
                print(f"✅ Archivo consolidado inicializado")
            except Exception as e:
                print(f"❌ Error inicializando archivo consolidado: {e}")
    
    def add_session_header(self, session_type: str = "SESIÓN DE MONITOREO"):
        """Add a session header to mark the beginning of a monitoring session"""
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            session_header = f"""

🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾
🌾                                                                            🌾
🌾    NUEVA {session_type.upper()}                                           🌾
🌾    Iniciada: {timestamp}                              🌾
🌾                                                                            🌾
🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾

"""
            
            with open(self.consolidated_file, 'a', encoding='utf-8') as f:
                f.write(session_header)
            
            print(f"📋 Sesión iniciada: {session_type}")
        except Exception as e:
            print(f"❌ Error añadiendo header de sesión: {e}")
    
    def save_alert(self, alert_type: str, content: str, region: str = "Colombia") -> str:
        """Save alert information to the consolidated text file"""
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            alert_entry = f"""
{'='*80}
NUEVA ALERTA REGISTRADA
{'='*80}
🔹 Tipo: {alert_type}
🔹 Región: {region}
🔹 Fecha y Hora: {timestamp}
{'='*80}

{content}

{'='*80}
FIN DE ALERTA - {alert_type}
{'='*80}

"""
            
            # Append to consolidated file
            with open(self.consolidated_file, 'a', encoding='utf-8') as f:
                f.write(alert_entry)
            
            return f"✅ Alerta guardada en archivo único: {alert_type}"
        except Exception as e:
            return f"❌ Error guardando en archivo único: {str(e)}"
    
    def get_file_path(self) -> str:
        """Get the path to the consolidated file"""
        return self.consolidated_file
    
    def file_exists(self) -> bool:
        """Check if the consolidated file exists"""
        return os.path.exists(self.consolidated_file)
    
    def get_file_size(self) -> int:
        """Get the size of the consolidated file in bytes"""
        if self.file_exists():
            return os.path.getsize(self.consolidated_file)
        return 0
