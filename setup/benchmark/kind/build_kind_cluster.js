import { writeFileSync } from 'fs';
import { stringify } from 'yaml';

function generateKindConfig(nodeCount) {
  const config = {
    kind: 'Cluster',
    apiVersion: 'kind.x-k8s.io/v1alpha4',
    nodes: [
      {
        role: 'control-plane',
        extraPortMappings: [
          {
            containerPort: 31112,
            hostPort: 31112,
          },
        ],
      },
    ],
    containerdConfigPatches: [
      `[plugins."io.containerd.grpc.v1.cri".registry]\n    config_path = "/etc/containerd/certs.d"`,
    ],
  };

  for (let i = 0; i < nodeCount; i++) {
    config.nodes.push({ role: 'worker' });
  }

  return config;
}

function main() {
  const nodeCount = parseInt(process.argv[2]);

  if (nodeCount === undefined || isNaN(nodeCount) || nodeCount < 1) {
    console.error('Please provide a valid nr. of nodes (argument to script)');
    process.exit(1);
  }

  const config = generateKindConfig(nodeCount);
  writeFileSync('kind-config.yaml', stringify(config));
  console.log('KinD configuration file generated. ', nodeCount, ' nodes.');
}

main();
