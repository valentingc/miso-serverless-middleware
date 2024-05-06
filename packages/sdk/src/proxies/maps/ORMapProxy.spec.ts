import { ProtoGrpcType } from '@miso/common/dist/grpc/client/middleware.js';

jest.mock('@miso/common/dist/grpc/client/middleware');
jest.mock('@grpc/grpc-js', () => {
  const actualGrpc = jest.requireActual('@grpc/grpc-js');
  const mockObj: ProtoGrpcType = {
    google: {
      protobuf: {
        ListValue: {} as any,
        NullValue: {} as any,
        Struct: {} as any,
        Value: {} as any,
      },
    },
    miso: {
      middleware: {
        ORMapService: jest.fn().mockReturnValue({
          service: jest.fn(),
          get: jest.fn(),
          set: jest.fn(),
        }) as any,
      } as any,
    } as any,
  };

  return {
    ...actualGrpc,
    loadPackageDefinition: jest.fn().mockReturnValue(mockObj),
  };
});
jest.mock('@grpc/proto-loader', () => {
  const actualGrpc = jest.requireActual('@grpc/proto-loader');

  return {
    ...actualGrpc,
    loadSync: jest.fn(),
  };
});

jest.mock('../shared/GrpcCall.js', () => {
  const actualGrpc = jest.requireActual('../shared/GrpcCall.js');
  const fn = jest.fn();

  return {
    ...actualGrpc,
    makeGrpcCall: fn,
  };
});
describe('ORMapProxy', () => {
  const id = '12345-my-id';

  beforeAll(() => {
    process.env.NODE_ENV = 'production';
    process.env.MISO_HOST_IP = '127.0.0.1';
    process.env.MISO_NODE_NAME = 'myNode';
    process.env.MISO_FUNCTION_NAME = 'test';
  });

  // it('should be defined', () => {
  //   const sdk = new StatefulObjectProxy();

  //   sdk.getChannel;

  //   const map = sdk.getORMap<string, GCounterProxy>('testMap', {
  //     key: () => 'string',
  //     value: GCounterProxy,
  //   });
  //   expect(map).toBeDefined();
  //   expect(map.set).toBeDefined();
  //   expect(map.get).toBeDefined();
  // });

  // it('set: should add to the map', async () => {
  //   const sdk = new StatefulObjectProxy();

  //   sdk.getChannel;

  //   const map = sdk.getORMap<string, GCounterProxy>('testMap', {
  //     key: () => 'string',
  //     value: GCounterProxy,
  //   });

  //   const gCounter = sdk.getGCounter('test');
  //   const res: MapValueResponse = {
  //     key: 'test',
  //     hasValue: true,
  //     valueCrdtName: 'test',
  //     valueCrdtType: 'GCOUNTER',
  //   };
  //   (
  //     grpcCallModule.makeGrpcCall as jest.MockedFunction<
  //       typeof grpcCallModule.makeGrpcCall
  //     >
  //   ).mockResolvedValue(res);
  //   const result = await map.set('test', gCounter);
  //   expect(result).toBeDefined();
  //   expect(result).toMatchObject(res);
  // });
});
