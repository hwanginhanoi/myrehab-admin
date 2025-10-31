#!/bin/bash
set -e

# Kubernetes Deployment Script for MyRehab Admin
# This script builds and deploys the application to Kubernetes

# Configuration
IMAGE_NAME="myrehab-admin"
IMAGE_TAG="${1:-latest}"
REGISTRY="${REGISTRY:-docker.io/your-registry}"  # Set your registry
NAMESPACE="${NAMESPACE:-default}"

echo "========================================="
echo "MyRehab Admin K8s Deployment"
echo "========================================="
echo "Image: ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
echo "Namespace: ${NAMESPACE}"
echo ""

# Step 1: Build Docker image
echo "Step 1: Building Docker image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ..

# Step 2: Tag image for registry
echo "Step 2: Tagging image for registry..."
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}

# Step 3: Push to registry (optional - comment out for local testing)
echo "Step 3: Pushing image to registry..."
read -p "Push to registry? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
fi

# Step 4: Apply Kubernetes manifests
echo "Step 4: Applying Kubernetes manifests..."

# Apply ConfigMap first
echo "Applying ConfigMap..."
kubectl apply -f configmap.yaml -n ${NAMESPACE}

# Apply Deployment
echo "Applying Deployment..."
kubectl apply -f deployment.yaml -n ${NAMESPACE}

# Apply Service
echo "Applying Service..."
kubectl apply -f service.yaml -n ${NAMESPACE}

# Apply Ingress
echo "Applying Ingress..."
kubectl apply -f ingress.yaml -n ${NAMESPACE}

# Step 5: Wait for rollout
echo "Step 5: Waiting for deployment rollout..."
kubectl rollout status deployment/myrehab-admin -n ${NAMESPACE}

# Step 6: Show deployment status
echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
kubectl get all -n ${NAMESPACE} -l app=myrehab-admin

echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/myrehab-admin -n ${NAMESPACE}"
echo ""
echo "To scale deployment:"
echo "  kubectl scale deployment/myrehab-admin --replicas=3 -n ${NAMESPACE}"
echo ""
echo "To check pod health:"
echo "  kubectl get pods -n ${NAMESPACE} -l app=myrehab-admin"
