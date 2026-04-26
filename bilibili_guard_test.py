import sys
import requests

# Avoid Windows console GBK encoding errors when printing response text
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

url = "https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topListNew"
params = {
    "roomid": 27526833,
    "page": 100,
    "ruid": 3493274442533075,
}

try:
    resp = requests.get(url, params=params, timeout=15)
    print("HTTP status:", resp.status_code)
    print("Request URL:", resp.url)
    print("Response body:")
    print(resp.text)
except Exception as e:
    print("Request failed:", e)
