FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY kolumbus ./kolumbus
COPY knowledge ./knowledge
COPY watchdog.py .

CMD ["python", "-m", "kolumbus.main"]
