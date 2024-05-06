import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ObjectsService } from './objects.service.js';
import { StatefulObject } from './stateful-object.js';
const moduleMocker = new ModuleMocker(global);

describe('ObjectsService', () => {
  let service: ObjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectsService],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === EventEmitter2) {
          return { emit: jest.fn() };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<ObjectsService>(ObjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return false for in-existent function', () => {
    expect(service.hasStatefulObject('anyFunction', 'anyId')).toBeFalsy();
  });

  it('should return true for existing function and id', () => {
    service.createStatefulObject('anyId', 'anyFunction');
    expect(service.hasStatefulObject('anyFunction', 'anyId')).toBeTruthy();
  });

  it('should return correct count', () => {
    expect(service.getStatefulObjectCount('anyFunction')).toBe(0);
    service.createStatefulObject('anyId', 'anyFunction');
    expect(service.getStatefulObjectCount('anyFunction')).toBe(1);

    service.createStatefulObject('anyId2', 'anyFunction');

    expect(service.getStatefulObjectCount('anyFunction')).toBe(2);
  });

  it('should return correct stateful object', () => {
    const id = 'anyId';
    const serverlessFunctionName = 'anyFunction';

    expect(() =>
      service.getStatefulObject(id, serverlessFunctionName),
    ).toThrow();

    const so1: StatefulObject = service.createStatefulObject(
      id,
      serverlessFunctionName,
    );
    expect(so1.id).toEqual(id);
    expect(so1.serverlessFunctionName).toEqual(serverlessFunctionName);

    const so1Retrieved = service.getStatefulObject(id, serverlessFunctionName);
    expect(so1Retrieved.id).toEqual(id);
    expect(so1Retrieved.serverlessFunctionName).toEqual(serverlessFunctionName);
  });

  it('should delete correctly', () => {
    const id = 'anyId';
    const serverlessFunctionName = 'anyFunction';
    expect(service.delete(id, serverlessFunctionName)).toBeFalsy();
    service.createStatefulObject(id, serverlessFunctionName);
    expect(
      service.delete(id + 'this-is-wrong', serverlessFunctionName),
    ).toBeFalsy();
    expect(service.getStatefulObjectCount(serverlessFunctionName)).toBe(1);
    expect(service.delete(id, serverlessFunctionName)).toBeTruthy();
    expect(service.getStatefulObjectCount(serverlessFunctionName)).toBe(0);
    expect(service.hasStatefulObject(serverlessFunctionName, id)).toBeFalsy();
  });

});
