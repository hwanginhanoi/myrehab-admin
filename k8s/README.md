# Kubernetes Deployment Guide

This directory contains Kubernetes manifests and deployment scripts for MyRehab Admin.

## Prerequisites

- Docker installed and running
- kubectl configured to connect to your cluster
- A container registry (Docker Hub, GCR, ECR, etc.)

## Quick Start

### 1. Configure Environment Variables

Edit `configmap.yaml` and update the backend API URL:

```yaml
NEXT_PUBLIC_API_URL: "http://myrehab-backend:8080"
```

Replace `myrehab-backend` with your actual backend service name.

### 2. Update Image Registry

Edit `deploy.sh` and set your container registry:

```bash
REGISTRY="${REGISTRY:-docker.io/your-registry}"
```

### 3. Deploy to Kubernetes

```bash
cd k8s
./deploy.sh latest
```

Or specify a custom tag:

```bash
./deploy.sh v1.0.0
```

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build and push Docker image
docker build -t myrehab-admin:latest ..
docker tag myrehab-admin:latest your-registry/myrehab-admin:latest
docker push your-registry/myrehab-admin:latest

# Apply Kubernetes manifests
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# Check deployment status
kubectl rollout status deployment/myrehab-admin
kubectl get pods -l app=myrehab-admin
```

## Manifest Files

- **configmap.yaml** - Environment variables configuration
- **deployment.yaml** - Application deployment with 2 replicas
- **service.yaml** - ClusterIP service exposing port 80
- **ingress.yaml** - Ingress rules for external access

## Customization

### Scaling

```bash
kubectl scale deployment/myrehab-admin --replicas=5
```

### Resource Limits

Edit `deployment.yaml` and adjust resources:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Domain Configuration

Edit `ingress.yaml` and update the host:

```yaml
rules:
- host: admin.myrehab.example.com
```

### HTTPS/TLS

Uncomment the TLS section in `ingress.yaml` and ensure cert-manager is installed:

```yaml
tls:
- hosts:
  - admin.myrehab.example.com
  secretName: myrehab-admin-tls
```

## Monitoring

### View Logs

```bash
# All pods
kubectl logs -f deployment/myrehab-admin

# Specific pod
kubectl logs -f pod/myrehab-admin-xxxxx
```

### Health Checks

```bash
# Port-forward to test locally
kubectl port-forward deployment/myrehab-admin 3000:3000

# Test health endpoint
curl http://localhost:3000/api/health
```

### Pod Status

```bash
kubectl get pods -l app=myrehab-admin
kubectl describe pod myrehab-admin-xxxxx
```

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod myrehab-admin-xxxxx
kubectl logs myrehab-admin-xxxxx
```

### Image pull errors

Ensure your image is pushed to the registry and the cluster has access:

```bash
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Backend connectivity issues

Check ConfigMap and ensure backend service is accessible:

```bash
kubectl get configmap myrehab-admin-config -o yaml
kubectl get svc
```

## Rolling Updates

To update the application:

```bash
# Update image
./deploy.sh v1.0.1

# Or manually
kubectl set image deployment/myrehab-admin myrehab-admin=your-registry/myrehab-admin:v1.0.1
kubectl rollout status deployment/myrehab-admin
```

## Rollback

```bash
# View rollout history
kubectl rollout history deployment/myrehab-admin

# Rollback to previous version
kubectl rollout undo deployment/myrehab-admin

# Rollback to specific revision
kubectl rollout undo deployment/myrehab-admin --to-revision=2
```

## Clean Up

```bash
kubectl delete -f ingress.yaml
kubectl delete -f service.yaml
kubectl delete -f deployment.yaml
kubectl delete -f configmap.yaml
```
