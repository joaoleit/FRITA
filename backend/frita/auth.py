import jwt
import requests
from datetime import datetime, timedelta

# Chave secreta (armazenar em variável de ambiente)
SECRET_KEY = "sua_chave_secreta"

def generate_jwt(payload):
    expiration = datetime.utcnow() + timedelta(hours=1)
    payload['exp'] = expiration
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.exceptions.InvalidSignatureError:
        return None

# Exemplo de uso
payload = {"user_id": 123, "username": "john.doe"}
token = generate_jwt(payload)
print(f"Token JWT: {token}")

url = "https://api.example.com/resource"
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Autenticação bem-sucedida")
    print(response.json())
else:
    print("Falha na autenticação")
    print(response.status_code)

# Verificação do token
decoded_payload = verify_jwt(token)
if decoded_payload:
    print("Token válido")
    print(decoded_payload)
else:
    print("Token inválido")
