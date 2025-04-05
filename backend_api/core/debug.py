from django.contrib.auth import authenticate
user = authenticate(username="oreo@oreo", password="avmayo852")
print(user)  # Debería mostrar el objeto User o None