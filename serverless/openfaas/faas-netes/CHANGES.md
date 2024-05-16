# Changes made during this thesis
As part of this thesis, the following files of faas-netes have been altered:

Function deployment in `pkg/handlers/deploy.go` and tests in `pkg/handlers/deploy_test.go`.

Helm chart in `chart/openfaas` to include the MISO middleware template + values:
1. `./chart/openfaas/values.yaml` (add MISO values, resources, changed faas-netes imagePullPolicy to include local faas-netes image)
1. `./chart/openfaas/templates/miso-sidecar-ds.yaml` (own template)
1. `./chart/openfaas/templates/gateway-dep.yaml` (change imagePullPolicy to include local faas-netes image)