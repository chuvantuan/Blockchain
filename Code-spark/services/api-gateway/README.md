# API Gateway (Spring Cloud Gateway)

This module provides an API Gateway for the microservices in this project.

Purpose:
- Expose a single public base URL for frontend clients.
- Route requests to internal services by path.
- Provide CORS, security and central routing rules.

Routes configured in `src/main/resources/application.yml` (examples):
- `/identity/**` -> `identity-service` (StripPrefix=1)
- `/admin/**` -> `admin-service` (rewritten to `/api/v1/admin/security/**`)
- `/api/v1/admin/**` -> `admin-service`
- `/course/**` -> `course-service` (StripPrefix=1)
- `/exam/**` -> `exam-service` (StripPrefix=1)
- `/api/copyrights/**` -> `copyright-service`
- `/api/tokens/**` -> `token-reward-service`
- `/api/exam/**` -> `online-exam-service`
- `/api/v1/multisig/**` -> `multisig-service` (direct http)

How to run (local):
1. Make sure Eureka discovery server is running (if used) or services are registerable.
2. Build and run gateway:

```bash
cd Code-spark/services/api-gateway
mvn spring-boot:run
```

3. Point frontend env `VITE_API_BASE_URL` to `http://localhost:8080` (or gateway host). Example `.env` in `web-frontend`:

```
VITE_API_BASE_URL=http://localhost:8080
```

Notes:
- The gateway uses `lb://` to resolve service instances via Eureka. If you are not using service discovery, set `uri` to the direct http URL of the service (e.g. `http://localhost:9003`).
- Adjust `RewritePath` or `StripPrefix` rules if your backend endpoints differ.

