import { GrpcClientPackageType } from '../overlay-network/transports/grpc/grpc-client.service.js';

export function getProtoFileNameForType(type: GrpcClientPackageType) {
  switch (type) {
    case GrpcClientPackageType.PACKAGE_MISO_REPLICATION:
      return 'replication.proto';
    case GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION:
      return 'discovery-function.proto';
    case GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_NODE:
      return 'discovery-node.proto';
    case GrpcClientPackageType.PACKAGE_MISO_MIDDLEWARE:
      return 'middleware.proto';
    default:
      throw new Error(`Unknown type ${type}`);
  }
}


