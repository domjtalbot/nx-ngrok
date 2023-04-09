import { ensureDirSync, removeSync } from 'fs-extra';

import { runCli } from './run-cli';
import { killPorts } from './kill-ports';

type CreateWorkspaceProps = {
  e2ePath: string;
  workspacePath: string;
  workspaceName: string;
};

export const createWorkspace = async (props: CreateWorkspaceProps) => {
  await killPorts(4200);
  removeSync(props.e2ePath);
  ensureDirSync(props.e2ePath);
  removeSync(props.workspacePath);

  await runCli(
    `pnpm dlx create-nx-workspace@15.7.1 proj --appName=${props.workspaceName} --style=css --preset=next --no-nxCloud --unitTestRunner=none --e2eTestRunner=none --no-interactive --verbose --skipGit`,
    { cwd: props.e2ePath }
  );

  await runCli(
    'pnpm add -d --ignore-workspace-root-check ../../../dist/packages/nx-ngrok',
    { cwd: props.workspacePath }
  );
};

export default createWorkspace;
