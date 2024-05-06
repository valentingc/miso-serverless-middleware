'use strict';
import {
  EWFlagProxy,
  GCounterProxy,
  GSetProxy,
  MVRegisterProxy,
  ORSetProxy,
  PNCounterProxy,
  StatefulObjectProxy,
  jsonMapReplacer,
} from '@miso/sdk';
import * as winston from 'winston';
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [FN] [${info.level}]: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : ' '),
    ),
  ),
  defaultMeta: { service: 'fn-set' },
  transports: [new winston.transports.Console()],
});

/**
 * Main entry point of the function.
 * Depending on the "operation" key in the body, a different method will be called
 */
module.exports = async (event: any, context: any) => {
  logger.debug(JSON.stringify(event));
  const statefulObject: StatefulObjectProxy = context.statefulObject;
  const body = event.body;

  const operation = body.operation;

  if (operation === undefined) {
    throw new Error('Operation is undefined');
  }
  if (body.value === undefined) {
    throw new Error('Value is undefined');
  }

  context.headers({
    'Content-Type': 'application/json',
  });

  switch (operation) {
    case 'orset':
      return await getORSetResponse(body, statefulObject);
    case 'orset-set':
      return await getORSetResponseEvaluation(
        body,
        statefulObject,
        'orset-set',
      );
    case 'orset-unset':
      return await getORSetResponseEvaluation(
        body,
        statefulObject,
        'orset-unset',
      );
    case 'orset-getValue':
      return await getORSetResponseEvaluation(
        body,
        statefulObject,
        'orset-getValue',
      );
    case 'ormap-set':
      return await getORMapResponse(body, statefulObject, 'ormap-set');
    case 'ormap-get':
      return await getORMapResponse(body, statefulObject, 'ormap-get');
    case 'gset':
      return await getGSetResponse(body, statefulObject);
    case 'ewflag':
      return await getEWFlagResponse(body, statefulObject);
    default:
      throw Error('Unknown operation');
  }
};

async function getEWFlagResponse(
  body: any,
  statefulObject: StatefulObjectProxy,
) {
  const ewflag = statefulObject.getEWFlag('EWFlag1');

  const resultAssign1 = await ewflag.assign(body.value);
  const resultGetValue1 = await ewflag.getValue();

  return {
    assign1: resultAssign1,
    getValue1: resultGetValue1,
  };
}
async function getGSetResponse(body: any, statefulObject: StatefulObjectProxy) {
  const gsetNumber = statefulObject.getGSet<number>('GSetNumber');
  const gsetString = statefulObject.getGSet<string>('GSetString');
  const gsetObject = statefulObject.getGSet<object>('GSetObject');
  body.value = body.value + '';
  try {
    /**
     * NUMBER
     */
    setAssignAndGet(gsetNumber, 1);
    setAssignAndGet(gsetNumber, 2);
    const has = await gsetNumber.has(1);
    console.log('HAS RESULT?? ' + has);
    console.log('ELEM`S: ' + (await gsetNumber.size));

    /** STRING */
    setAssignAndGet(gsetString, '1');
    setAssignAndGet(gsetString, '2');

    /**
     * OBJECT
     */
    setAssignAndGet(gsetObject, { id: '1234', test: 'test' });
    setAssignAndGet(gsetObject, { id: '12345', anotherTest: 'test' });

    return {};
  } catch (error) {
    console.error(error);
  }
}

async function setAssignAndGet<T extends string | number | object>(
  set: GSetProxy<T>,
  value: T,
) {
  let now = Date.now();
  const resultAdd = await set.add(value);
  logger.debug(
    `Add request finished... ${Date.now() - now}ms, Response: ${JSON.stringify(
      resultAdd,
    )}`,
  );
  now = Date.now();
  const resultGet = await set.getValue();
  logger.debug(
    `GetValue request finished... ${
      Date.now() - now
    }ms, Response: ${JSON.stringify(resultAdd)}`,
  );
  return {
    resultAdd,
    resultGet,
  };
}

async function getORSetResponseEvaluation(
  body: any,
  statefulObject: StatefulObjectProxy,
  operation: string,
) {
  const set = statefulObject.getORSet<string>(body.crdtName);

  let res;
  if (operation === 'orset-set') {
    res = await set.add(body.value);
  } else if (operation === 'orset-unset') {
    res = await set.remove(body.value);
  } else if (operation === 'orset-getValue') {
    res = await set.getValue();
  }

  let finalResult: any = { acknowledged: true };
  if (body.includeValueInResponse === true) {
    finalResult = {
      ...finalResult,
      currentValue: res,
    };
  }
  return finalResult;
}

async function getORMapResponse(
  body: any,
  statefulObject: StatefulObjectProxy,
  operation: string,
) {
  const mapGCounter = statefulObject.getORMap<string, GCounterProxy>(
    'ormap-gcounter',
    {
      key: () => 'default',
      value: GCounterProxy,
    },
  );
  const mapPNCounter = statefulObject.getORMap<string, PNCounterProxy>(
    'ormap-pncounter',
    {
      key: () => 'default',
      value: PNCounterProxy,
    },
  );

  const mapEWFlag = statefulObject.getORMap<string, EWFlagProxy>(
    'ormap-ewflag',
    {
      key: () => 'default',
      value: EWFlagProxy,
    },
  );

  const mapGSet = statefulObject.getORMap<string, GSetProxy<string>>(
    body.crdtName,
    {
      key: () => 'default',
      value: GSetProxy<string>,
    },
  );

  const mapORSet = statefulObject.getORMap<string, ORSetProxy<string>>(
    'ormap-orset',
    {
      key: () => 'default',
      value: ORSetProxy<string>,
    },
  );

  const mapMvRegister = statefulObject.getORMap<
    string,
    MVRegisterProxy<string>
  >('ormap-mvregister', {
    key: () => 'default',
    value: MVRegisterProxy<string>,
  });

  let resGCounter;
  let resPNCounter;
  let resEWFlag;
  let resGSet;
  let resORSet;
  let resMVRegister;

  if (operation === 'ormap-set') {
    const gCounter = statefulObject.getGCounter('GCounter');
    gCounter.add(5);
    const setGCounter = await mapGCounter.set('GCounter', gCounter);
    const pnCounter = statefulObject.getPNCounter('PNCounter');
    pnCounter.add(5);
    const setPNcounter = await mapPNCounter.set('PNCounter', pnCounter);

    const ewflag = statefulObject.getEWFlag('EWFlag');
    const setEWFlag = await mapEWFlag.set('EWFlag', ewflag);
    ewflag.assign(false);

    const gset = statefulObject.getGSet<string>('GSet');
    gset.add('test');
    const setGset = await mapGSet.set('GSet', gset);

    const orSet = statefulObject.getORSet<string>('ORSet');
    orSet.add('test');
    const setOrset = await mapORSet.set('ORSet', orSet);

    const mvRegister = statefulObject.getMVRegister<string>('MVRegister');
    mvRegister.assign('test');
    const setMvRegister = await mapMvRegister.set('MVRegister', mvRegister);

    console.log(
      'SET GCounter: ' + JSON.stringify(setGCounter, jsonMapReplacer),
    );
    console.log(
      'SET PNCounter: ' + JSON.stringify(setPNcounter, jsonMapReplacer),
    );
    console.log('SET EWFlag: ' + JSON.stringify(setEWFlag, jsonMapReplacer));
    console.log('SET GSet: ' + JSON.stringify(setGset, jsonMapReplacer));
    console.log('SET ORSet: ' + JSON.stringify(setOrset, jsonMapReplacer));
    console.log(
      'SET MVRegister: ' + JSON.stringify(setMvRegister, jsonMapReplacer),
    );
  } else if (operation === 'ormap-get') {
    resGCounter = await mapGCounter.get('GCounter');
    resPNCounter = await mapPNCounter.get('PNCounter');
    resEWFlag = await mapEWFlag.get('EWFlag');
    resGSet = await mapGSet.get('GSet');
    resORSet = await mapORSet.get('ORSet');
    resMVRegister = await mapMvRegister.get('MVRegister');

    resGSet?.add('test2');
    resORSet?.add('test2');
    resMVRegister?.assign('test2');

    console.log('current pncounter: ' + (await resPNCounter?.getValue()));
    await resPNCounter?.subtract(1);
    console.log('current pncounter: ' + (await resPNCounter?.getValue()));
  }
  console.log(
    'resPNCounter: ' + JSON.stringify(await resPNCounter?.getValue()),
  );
  console.log(
    'resEWFlag: ' +
      JSON.stringify(await resEWFlag?.getValue(), jsonMapReplacer),
  );
  console.log(
    'resGSet: ' + JSON.stringify(await resGSet?.getValue(), jsonMapReplacer),
  );
  console.log(
    'resORSet: ' + JSON.stringify(await resORSet?.getValue(), jsonMapReplacer),
  );
  console.log(
    'resMVRegister: ' +
      JSON.stringify(await resMVRegister?.getValue(), jsonMapReplacer),
  );

  let finalResult: any = { acknowledged: true };
  if (body.includeValueInResponse === true) {
    finalResult = {
      ...finalResult,
      values: {
        // resGCounter,
        // resPNCounter,
        // resEWFlag,
        // resGSet,
        // resORSet,
        // resMVRegister,
      },
    };
  }
  return finalResult;
}
async function getORSetResponse(
  body: any,
  statefulObject: StatefulObjectProxy,
) {
  const orsetNumber = statefulObject.getORSet<number>('ORSetNumber');
  const orsetString = statefulObject.getORSet<string>('ORSetString');
  const orsetObject = statefulObject.getORSet<object>('ORSetObject');
  body.value = body.value + '';
  try {
    /**
     * NUMBER
     */
    setAssignAndGet(orsetNumber, 1);
    setAssignAndGet(orsetNumber, 2);

    /** STRING */
    setAssignAndGet(orsetString, '1');
    setAssignAndGet(orsetString, '2');

    /**
     * OBJECT
     */

    setAssignAndGet(orsetObject, { id: '1', test: 'test' });
    setAssignAndGet(orsetObject, { id: '12', anotherTest: 'test' });
    await orsetObject.remove({ id: '1234' });
    await orsetObject.getValue();

    return {};
  } catch (error) {
    console.error(error);
  }
}
