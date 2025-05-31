import requests
import json

class IBMGraniteClient:
    def __init__(self):
        self.url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29"
        self.api_key = "ApiKey-a88782f7-b3d0-4310-b7f7-277b2b7d55cf"
        self.project_id = "a5b3058c-af2b-4a50-89e7-3dfca277b8c2"
        self.model_id = "ibm/granite-3-8b-instruct"
    
    def get_access_token(self):
        """Get access token using IBM Cloud API key"""
        token_url = "https://iam.cloud.ibm.com/identity/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        response = requests.post(token_url, headers=headers, data=data)
        if response.status_code != 200:
            raise Exception(f"Failed to get access token: {response.text}")
        
        return response.json()["access_token"]
    
    def chat(self, user_message, system_message=None):
        """Send a chat message to IBM Granite model"""
        if system_message is None:
            system_message = "You are Granite, an AI language model developed by IBM in 2024. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior."
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
        
        body = {
            "messages": messages,
            "project_id": self.project_id,
            "model_id": self.model_id,
            "frequency_penalty": 0,
            "max_tokens": 2000,
            "presence_penalty": 0,
            "temperature": 0,
            "top_p": 1
        }
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.get_access_token()}"
        }
        
        response = requests.post(self.url, headers=headers, json=body)
        
        if response.status_code != 200:
            raise Exception(f"Non-200 response: {response.status_code} - {response.text}")
        
        data = response.json()
        return data
    
    def get_response_text(self, response_data):
        """Extract the text response from the API response"""
        try:
            return response_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise Exception(f"Failed to extract response text: {e}")

def main():
    """Example usage of the IBM Granite client"""
    client = IBMGraniteClient()
    
    try:
        # Example chat
        user_message = "Hello, how can you help me with climate alerts?"
        response = client.chat(user_message)
        response_text = client.get_response_text(response)
        
        print(f"User: {user_message}")
        print(f"Granite: {response_text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
