
FROM python:3.9-slim


WORKDIR /VUCService

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY schemas .


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8004"]