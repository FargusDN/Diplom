
FROM python:3.9-slim


WORKDIR /authApi


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . .


CMD ["uvicorn", "conroller.main:app", "--host", "0.0.0.0", "--port", "8000"]