# Docker Deployment Guide

## Building and Pushing to Azure Container Registry (ACR)

### Prerequisites
- Docker installed locally
- Azure CLI installed
- Access to your Azure Container Registry

### 1. Login to ACR
```bash
# Login to Azure
az login

# Login to your ACR
az acr login --name <your-acr-name>
```

### 2. Build the Docker image
```bash
# Build locally
docker build -t kontent-ai-mcp:latest .

# Or build with specific transport type
docker build --build-arg TRANSPORT=sse -t kontent-ai-mcp:sse .
```

### 3. Tag for ACR
```bash
# Tag the image for your ACR
docker tag kontent-ai-mcp:latest <your-acr-name>.azurecr.io/kontent-ai-mcp:latest
```

### 4. Push to ACR
```bash
# Push the image
docker push <your-acr-name>.azurecr.io/kontent-ai-mcp:latest
```

## Running the Container

### Local Testing with Docker Compose
```bash
# Create .env file with your credentials
echo "KONTENT_API_KEY=your-api-key" > .env
echo "KONTENT_ENVIRONMENT_ID=your-env-id" >> .env

# Run with docker-compose
docker-compose up
```

### Running Directly with Docker
```bash
# STDIO transport (default)
docker run -it \
  -e KONTENT_API_KEY=your-api-key \
  -e KONTENT_ENVIRONMENT_ID=your-env-id \
  <your-acr-name>.azurecr.io/kontent-ai-mcp:latest

# SSE transport
docker run -it \
  -p 3001:3001 \
  -e KONTENT_API_KEY=your-api-key \
  -e KONTENT_ENVIRONMENT_ID=your-env-id \
  -e TRANSPORT=sse \
  <your-acr-name>.azurecr.io/kontent-ai-mcp:latest \
  node build/bin.js

# Streamable HTTP transport
docker run -it \
  -p 3001:3001 \
  -e KONTENT_API_KEY=your-api-key \
  -e KONTENT_ENVIRONMENT_ID=your-env-id \
  -e TRANSPORT=shttp \
  <your-acr-name>.azurecr.io/kontent-ai-mcp:latest \
  node build/bin.js
```

## Deployment to Azure Container Instances (ACI)

### Deploy from ACR to ACI
```bash
az container create \
  --resource-group <your-resource-group> \
  --name kontent-ai-mcp \
  --image <your-acr-name>.azurecr.io/kontent-ai-mcp:latest \
  --registry-login-server <your-acr-name>.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --ports 3001 \
  --environment-variables \
    KONTENT_API_KEY=<your-api-key> \
    KONTENT_ENVIRONMENT_ID=<your-env-id> \
    TRANSPORT=sse \
    PORT=3001 \
  --dns-name-label kontent-mcp \
  --location <your-location>
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `KONTENT_API_KEY` | Kontent.ai Management API key | Yes | - |
| `KONTENT_ENVIRONMENT_ID` | Kontent.ai Environment ID | Yes | - |
| `PORT` | Server port | No | 3001 |
| `TRANSPORT` | Transport type (stdio/sse/shttp) | No | stdio |
| `NODE_ENV` | Node environment | No | production |

## Security Notes

- Never include API keys in the Docker image
- Always pass sensitive data via environment variables
- Use Azure Key Vault for production deployments
- The container runs as non-root user (nodejs:1001) for security