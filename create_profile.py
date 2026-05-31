import urllib.request, json

PB_URL = "https://api.ihlane.me"
PB_EMAIL = "ihlane.ambroise@gmail.com"
PB_PASSWORD = "Ihlaneambroise@08"

data = json.dumps({"identity": PB_EMAIL, "password": PB_PASSWORD}).encode()
req = urllib.request.Request(
    f"{PB_URL}/api/collections/_superusers/auth-with-password",
    data=data,
    headers={"Content-Type": "application/json"}
)
res = json.loads(urllib.request.urlopen(req).read())
token = res["token"]
headers = {"Content-Type": "application/json", "Authorization": token}
print("Connecté")

# Créer la collection profile
collection = {
    "name": "profile",
    "type": "base",
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "fields": [
        {"name": "subtitle", "type": "text", "required": False},
        {"name": "status_text", "type": "text", "required": False},
        {"name": "open_to_work", "type": "bool", "required": False}
    ]
}

data = json.dumps(collection).encode()
req = urllib.request.Request(
    f"{PB_URL}/api/collections",
    data=data,
    headers=headers
)
try:
    res = json.loads(urllib.request.urlopen(req).read())
    col_id = res["id"]
    print(f"Collection 'profile' créée : {col_id}")
except Exception as e:
    print(f"Erreur création collection : {e}")
    exit(1)

# Créer l'enregistrement initial
record = {
    "subtitle": "Développeur junior en 2ème année de BTS SIO SLAM",
    "status_text": "Disponible pour une alternance en développement web dès septembre 2025",
    "open_to_work": True
}
data = json.dumps(record).encode()
req = urllib.request.Request(
    f"{PB_URL}/api/collections/profile/records",
    data=data,
    headers=headers
)
res = json.loads(urllib.request.urlopen(req).read())
print(f"Enregistrement créé : {res['id']}")
print("Tout est OK !")
