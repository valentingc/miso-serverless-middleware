export { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
export { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';
export { IStatefulObjectProxy } from './IStatefulObjectProxy';
export { StatefulObjectProxy } from './StatefulObjectProxy';
export {
  StatefulObjectConfiguration,
  createDefaultConfig as createOpenfaasConfig,
  getConfig,
} from './config/StatefulObjectConfiguration';
export { GCounterProxy } from './proxies/counters/GCounterProxy';
export { PNCounterProxy } from './proxies/counters/PNCounterProxy';
export { EWFlagProxy } from './proxies/flag/EWFlagProxy';
export { IMVRegisterProxy } from './proxies/registers/MVRegister/IMVRegisterProxy';
export { MVRegisterProxy } from './proxies/registers/MVRegister/MVRegisterProxy';
export { GSetProxy } from './proxies/sets/GSet/GSetProxy';
export { ORSetProxy } from './proxies/sets/ORSet/ORSetProxy';
export { jsonMapReplacer } from './proxies/shared/utils';
import * as fs from 'fs';
import * as path from 'path';
// Resolve the path to the package.json
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');

// Read the package.json file
const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8');

// Parse the content
const packageJson = JSON.parse(packageJsonString);

console.log(`SDK Version: ${packageJson.version}`);
