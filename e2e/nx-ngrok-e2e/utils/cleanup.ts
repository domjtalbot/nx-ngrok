import { removeSync } from 'fs-extra';

import { killPorts } from './kill-ports';

export const cleanup = async (e2ePath: string, ports: number[]) => {
  await killPorts(4200, ...ports);

  removeSync(e2ePath);
};

export default cleanup;
