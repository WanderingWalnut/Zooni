# Zooni SMS Backend (FastAPI + Twilio + SQLite)

Setup
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

Run
uvicorn app.main:app --reload --port 8000

Expose Webhook
ngrok http 8000
Set Twilio webhook to https://<ngrok>/sms/inbound (POST)

Test
Text JOIN to opt in
Text SHORT to get links
Visit links
GET /admin/metrics.json

Broadcast
POST /admin/push/shifts
