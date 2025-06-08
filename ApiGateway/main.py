from fastapi import FastAPI, HTTPException, Request
import httpx

app = FastAPI()

# Конфигурация сервисов
SERVICES = {
    "AdministrationService": "http://user-service:8001",
    "AnaliticService": "http://product-service:8002",
    "AuthorizationService": "http://product-service:8003",
    "EducationProfileService": "http://product-service:8004",
    "InformationPanelConstructorService": "http://product-service:8005",
    "NotificationService": "http://product-service:8006",
    "VUCService": "http://product-service:8007"
}


@app.api_route("/{service_name}/{path:path}", methods=["GET", "PATCH", "POST", "PUT", "DELETE"])
async def gateway(request: Request, service_name: str, path: str):
    # Проверка существования сервиса
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")

    # Формирование целевого URL
    target_url = f"{SERVICES[service_name]}/{path}"

    # Пересылка запроса
    async with httpx.AsyncClient() as client:
        try:
            # Создание нового запроса
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=request.headers.raw,
                params=request.query_params,
                content=await request.body(),
                timeout=10.0
            )

            # Возврат ответа от сервиса
            return response.content

        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Service unavailable")
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Service timeout")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)