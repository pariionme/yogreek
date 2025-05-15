import requests

USER_SERVICE_URL = "http://user_service:8000/users/"

def get_user_info(customer_id):
    try:
        resp = requests.get(f"{USER_SERVICE_URL}{customer_id}/")
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return None 