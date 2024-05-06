#!/bin/sh
set -o errexit
flag_miso_only=false
while getopts m flag
do
    case "${flag}" in
        m) flag_miso_only=true;;
    esac
done

# 0. Create registry container unless it already exists
reg_name='kind-registry'
reg_port='4000'
if [ "$(docker inspect -f '{{.State.Running}}' "${reg_name}" 2>/dev/null || true)" != 'true' ]; then
  docker run \
    -d --restart=always -p "127.0.0.1:${reg_port}:5000" --network bridge --name "${reg_name}" \
    registry:2
fi

# 1. Build MISO middleware & Faas-Netes with our modifications
docker build -t localhost:4000/miso-middleware -f ./packages/middleware/Dockerfile .
docker push localhost:4000/miso-middleware

# 2. Create kind cluster with containerd registry config dir enabled
# TODO: kind will eventually enable this by default and this patch will
# be unnecessary.
#
# See:
# https://github.com/kubernetes-sigs/kind/issues/2875
# https://github.com/containerd/containerd/blob/main/docs/cri/config.md#registry-configuration
# See: https://github.com/containerd/containerd/blob/main/docs/hosts.md
cat <<EOF | kind create cluster --name k8s-master-thesis --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 31112
        hostPort: 31112
  - role: worker
  - role: worker
  - role: worker
  - role: worker
  - role: worker 
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".registry]
    config_path = "/etc/containerd/certs.d"
EOF

#kind load docker-image localhost:4000/miso-middleware --name k8s-master-thesis || true

# 3. Add the registry config to the nodes
#
# This is necessary because localhost resolves to loopback addresses that are
# network-namespace local.
# In other words: localhost in the container is not localhost on the host.
#
# We want a consistent name that works from both ends, so we tell containerd to
# alias localhost:${reg_port} to the registry container when pulling images
REGISTRY_DIR="/etc/containerd/certs.d/localhost:${reg_port}"
for node in $(kind get nodes -n k8s-master-thesis); do
  echo "Configuring node ${node} for local registry at localhost:${reg_port}"
  docker exec "${node}" mkdir -p "${REGISTRY_DIR}"
  cat <<EOF | docker exec -i "${node}" cp /dev/stdin "${REGISTRY_DIR}/hosts.toml"
[host."http://${reg_name}:5000"]
EOF
done

# 4. Connect the registry to the cluster network if not already connected
# This allows kind to bootstrap the network but ensures they're on the same network
if [ "$(docker inspect -f='{{json .NetworkSettings.Networks.kind}}' "${reg_name}")" = 'null' ]; then
  docker network connect "kind" "${reg_name}"
fi

# 5. Document the local registry
# https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/generic/1755-communicating-a-local-registry
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: local-registry-hosting
  namespace: kube-public
data:
  localRegistryHosting.v1: |
    host: "localhost:${reg_port}"
    help: "https://kind.sigs.k8s.io/docs/user/local-registry/"
EOF

if [ "$flag_miso_only" = true ]; then
  echo "Installing MISO without OpenFaas."
  kubectl create namespace miso
  helm upgrade miso --install ./setup/miso --namespace miso -f ./setup/miso/values.yaml
else
  echo "Installing OpenFaaS with MISO"
  cd serverless/openfaas/faas-netes
  go mod vendor
  make
  cd ../../..
  kubectl create namespace openfaas
  kubectl create namespace openfaas-fn
  helm upgrade openfaas --install ./serverless/openfaas/faas-netes/chart/openfaas --namespace openfaas -f ./serverless/openfaas/faas-netes/chart/openfaas/values.yaml
  echo "Sleeping"
  sleep 60s

  echo 'OpenFaaS Password'
  PASSWORD=$(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode) && echo "OpenFaaS admin password: $PASSWORD"
  kubectl port-forward svc/gateway -n openfaas 8080:8080 || true
  #export OPENFAAS_URL=http://127.0.0.1:8080
  echo -n $PASSWORD | faas-cli login -u admin --password-stdin || true

fi

# Metric server
echo 'Adding metrics server'
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo update
helm upgrade --install --set args={--kubelet-insecure-tls} metrics-server metrics-server/metrics-server --namespace kube-system

### MISO throughput measuring
cd ./setup/benchmark/evaluation
docker build -t localhost:4000/miso-evaluation .
docker push localhost:4000/miso-evaluation
kubectl create namespace evaluation
if [ "$flag_miso_only" = true ]; then
  helm upgrade --install evaluation ./chart --namespace evaluation -f ./chart/values.yaml --set podMonitor.misoNamespace=miso
else
  helm upgrade --install evaluation ./chart --namespace evaluation -f ./chart/values.yaml --set podMonitor.misoNamespace=openfaas
fi