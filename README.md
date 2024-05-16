# Master Thesis
## CRDT-based Serverless Middleware for Stateful Objects in the Edge-Cloud Continuum

This repository contains multiple packages:

`packages/middleware`: Middleware source code

`packages/sdk`: SDK source code

`packages/crdt`: Implementatoin of various state-based CRDTs

`packages/common`: gRPC protobuf definitions


# Installing
Build is tested on Ubuntu 22.04.3 LTS, Go 1.21.4, faas-cli 0.16.17, Docker 24.0.7, k9s 0.27.4, helm 3.10.1


Ensure you have: Helm, K9s, Docker, Faas-CLI, Go installed beforehand!

## Building

Build all packages within the `packages/` directory and deploy to your NPM package of choice.
We used [Verdaccio](https://verdaccio.org/). This needs to be done on your own.

Create  a `.npmrc` file with your credentials, or use our script:

```sh setup/config-npm-credentials.sh https://yourregistry.yourdomain.com @miso```

This file needs to be present in the root of the repository, in every folder within ``packages/`, and every folder within `./serverless/openfaas/functions`.

Install dependencie in all packages with `npm install`.

To build the solution locally, please obtain your own copy of the [ghz](https://github.com/bojand/ghz/releases) benchmark tool. Download the `ghz-linux-x86_64.tar.gz` release, unzip the archive, and add the `ghz` binary to `./setup/benchmark/evaluation`. This is because our Dockerfile copies the binary so that we can use the tool in the pod. We did not modify the tool and do not distribute their binary in this repository. All details including license and their copyright notice can be found in their [GitHub Repository](https://github.com/bojand/ghz).


## Deploying
MISO can be installed standalone or integrated with OpenFaaS. Script does not work on Windows, you need a Unix-based system like Ubuntu!

Standalone:
```
sh setup/configure_kind_cluster.sh -m
```

Integrated:
```
sh setup/configure_kind_cluster.sh
```

### Build and Deploy functions

Copy a valid `.npmrc` file into each function defined in `serverless/openfaas/functions`.
Make sure your faas-cli is authenticated with your OpenFaaS instance.

```
cd serverless/openfaas/functions
faas-cli build
faas-cli push
faas-cli deploy
```


# Evaluation
All obtained data and charts of the thesis are within `./setup/benchmark/charts/data`.

Port-forward to the pod thas is created in the namespace `evaluation` with a name of `evaluation-miso-evaluation-xxxx-xxxx` to port 3000.

You can then invoke the methods via a HTTP POST call.

## Performance
General Parameters:

```
curl -X POST http://localhost:3000/allreduce/<TYPE>/<REPETITIONS>/<ARRAY_SIZE>/<ARRAY_CHUNK_SIZE>
```
`<TYPE>` is one of `miso`, `redis`, `minio`
`<REPETITIONS>` defines how often the experiment is run, we used 500
`<ARRAY_SIZE>` defines the array size, we used 1000000
`<ARRAY_CHUNK_SIZE>` defines how many items each array chunk has, we used 1000

For MISO:
```
curl -X POST http://localhost:3000/allreduce/miso/500/1000000/1000
```

You need to install MinIO and Redis Enterprise yourself if you want to run those functions, and adapt the credentials in the serverless function code in the folder `./serverless/openfaas/function`.
```
curl -X POST http://localhost:3000/allreduce/minio/500/1000000/1000
curl -X POST http://localhost:3000/allreduce/redis/500/1000000/1000
```

A JSON file will be created in the pod. You need to manually copy it, e.g.:
```
kubectl cp evaluation/evaluation-miso-evaluation-595bbfbc45-2sffr:/data/json/benchmark_results_<TYPE>_<REPETITIONS>ITER_5REQ_5NODES.json data.json
```
5 Nodes / 5 REQ is currently hard-coded.


## Throughput
```
curl -X POST http://localhost:3000/throughput-ghz/1000/<REPETITIONS>/<CONCURRENCY>/<TEST_TYPE>/<NR_OF_NODES>/<IP_AND_PORT>
```
Explanation of parameters:


`1000` is currently unused.

``<REQUESTS>`` is the number of requests, we used 5000000.

`<CONCURRENCY>` is the number of concurrent requests for ghz, we used 10.

`<TEST_TYPE>` is the type of test. `distributed` distributes the 
requests over all nodes, `single` only calls a single node

`<NR_OF_NODES>` is the number of nodes in a cluster.

`<IP_AND_PORT>` is the IP and port of a node if using `single` test type, e.g. `172.18.0.2:30001`

You can also port-forward to the Grafana pod that is created to see metrics.
We provide a custom dashboard that can imported to Grafana to see MISO metrics: [./setup/benchmark/grafana/Grafana_MISO%20Metrics_Dashboard.json](./setup/benchmark/grafana/Grafana_MISO%20Metrics_Dashboard.json)
We suggest you also import the [NodeJS Application Dashboard](./setup/benchmark/grafana/Grafana_MISO%20Metrics_Dashboard.json) to see memory consumption on the node-level.


## Qualitative Evaluation
### Integration of MISO with OpenFaaS
We include a version of [faas-netes](https://github.com/openfaas/faas-netes) in this repository to show the integration more easily.

The changes we made to faas-netes, the provider of OpenFaaS for Kubernetes, are described here: [serverless/openfaas/faas-netes/CHANGES.md](./serverless/openfaas/faas-netes/CHANGES.md). We include the


### Cognitive Complexity 
Cognitive complexity is calculated with the package [cognitive-complexity-ts](https://github.com/Deskbot/Cognitive-Complexity-TS).

Install the dependency:
```
npm i -g cognitive-complexity-ts
```

Then run it against the code, e.g.,:
```
cd ./serverless/openfaas/functions/allreduce-miso
npx ccts-json ./minimumExample.ts
```


## Building Middleware
```
docker build -t localhost:4000/miso-middleware -f ./packages/middleware/Dockerfile .
docker push localhost:4000/miso-middleware
```

