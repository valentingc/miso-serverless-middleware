import { StatefulObjectProxy } from './StatefulObjectProxy.js';

describe('StatefulObjectProxy', () => {
  // middleware needs to run for this test to work - not mocked
  it('should add to internal map', async () => {
    const proxy = new StatefulObjectProxy({
      id: 'anyId',
      protoFilePath: '../../node_modules/@miso/common/dist/grpc/',
      config: {
        functionName: 'testFn',
        replicaId: 'pod1',
        middlewareNodeIpAddress: '127.0.0.1',
        middlewareNodePort: 5001,
        middlewareNodeName: 'localhost',
      },
    });
    expect(proxy).toBeDefined();

    const counter = proxy.getGCounter('testCounter');
    expect(counter).toBeDefined();
    expect(proxy.getCrdts().size).toBe(1);

    await proxy.deleteCrdt('testCounter');
    expect(proxy.getCrdts().size).toBe(0);
  });
});
