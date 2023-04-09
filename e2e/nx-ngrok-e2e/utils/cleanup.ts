import { removeSync } from 'fs-extra';

import { runCli } from './run-cli';
import { killPorts } from './kill-ports';

export const cleanup = async (e2ePath: string) => {
  await killPorts(4200);

  removeSync(e2ePath);
};

export default cleanup;
