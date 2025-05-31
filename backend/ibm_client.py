import requests
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from config import Config

class IBMCloudClient:
    """Handle IBM Cloud authentication and API calls"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or Config.IBM_API_KEY
        self.url = Config.IBM_API_URL
        self.token_url = Config.IBM_TOKEN_URL
        self.project_id = Config.IBM_PROJECT_ID
        self.model_id = Config.IBM_MODEL_ID
        
        # Token caching
        self._access_token = None
        self._token_expires = None
    
    def get_access_token(self) -> str:
        """Get access token using IBM Cloud API key with caching"""
        # Check if we have a valid cached token
        if self._access_token and self._token_expires and datetime.now() < self._token_expires:
            return self._access_token
            
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        print(f"🔑 Requesting token with API key: {self.api_key[:20]}...")
        
        try:
            response = requests.post(self.token_url, headers=headers, data=data)
            if response.status_code != 200:
                error_details = response.json() if response.content else {"error": "No response content"}
                if "BXNIM0415E" in str(error_details):
                    raise Exception(f"API key not found. Please check your IBM Cloud API key. Error: {error_details}")
                else:
                    raise Exception(f"Failed to get access token (Status: {response.status_code}): {error_details}")
            
            token_data = response.json()
            self._access_token = token_data["access_token"]
            # Set token expiry (IBM tokens typically last 1 hour, we'll refresh 5 minutes early)
            expires_in = token_data.get("expires_in", 3600)
            self._token_expires = datetime.now() + timedelta(seconds=expires_in - 300)
            
            return self._access_token
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error while getting access token: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON response while getting access token: {e}")
    
    def validate_connection(self) -> bool:
        """Validate IBM Cloud connection and API key"""
        try:
            token = self.get_access_token()
            return bool(token)
        except Exception as e:
            print(f"❌ Connection validation failed: {e}")
            return False
    
    def chat(self, user_message: str, system_message: Optional[str] = None) -> Dict[str, Any]:
        """Send a chat message to IBM Granite model"""
        if system_message is None:
            system_message = Config.SYSTEM_MESSAGE
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
        
        body = {
            "messages": messages,
            "project_id": self.project_id,
            "model_id": self.model_id,
            "frequency_penalty": Config.FREQUENCY_PENALTY,
            "max_tokens": Config.MAX_TOKENS,
            "presence_penalty": Config.PRESENCE_PENALTY,
            "temperature": Config.TEMPERATURE,
            "top_p": Config.TOP_P
        }
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.get_access_token()}"
        }
        
        response = requests.post(self.url, headers=headers, json=body)
        
        if response.status_code != 200:
            raise Exception(f"Non-200 response: {response.status_code} - {response.text}")
        
        return response.json()
    
    def get_response_text(self, response_data: Dict[str, Any]) -> str:
        """Extract the text response from the API response"""
        try:
            return response_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise Exception(f"Failed to extract response text: {e}")
