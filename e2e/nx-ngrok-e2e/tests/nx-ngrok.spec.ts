import { readJson, uniq } from '@nrwl/nx-plugin/testing';

import { cleanup, createWorkspace, runCli } from '../utils';

describe('test e2e', () => {
  let workspaceName;
  let workspacePath;
  let e2ePath;
  let customPorts: number[] = [];

  beforeAll(async () => {
    workspaceName = uniq('test-e2e');
    e2ePath = `${process.cwd()}/tmp/nx-e2e`;
    workspacePath = `${e2ePath}/proj`;

    await createWorkspace({
      e2ePath,
      workspaceName,
      workspacePath,
    });
  }, 480000);

  afterAll(async () => {
    await cleanup(e2ePath, customPorts);
  }, 120000);

  it('should create a nextjs app with a ngrok tunnel target', async () => {
    const appName = uniq('my-app');

    await runCli(
      `pnpm nx generate @nrwl/next:application ${appName} --e2eTestRunner=none --unitTestRunner=none --no-interactive"`,
      { cwd: workspacePath }
    );

    await runCli(
      `pnpm nx generate nx-ngrok:tunnel dev --project=${appName} --serverTarget=${appName}:serve`,
      { cwd: workspacePath }
    );

    const project = readJson(`apps/${appName}/project.json`);

    expect(project?.targets?.dev?.options).toEqual({
      serverTarget: `${appName}:serve`,
    });
  }, 120000);

  it('should run a nextjs app through a ngrok tunnel', async () => {
    const appName = uniq('my-app');

    await runCli(
      `pnpm nx generate @nrwl/next:application ${appName} --e2eTestRunner=none --unitTestRunner=none --no-interactive"`,
      { cwd: workspacePath }
    );

    await runCli(
      `pnpm nx generate nx-ngrok:tunnel dev --project=${appName} --serverTarget=${appName}:serve`,
      { cwd: workspacePath }
    );

    const output = await runCli(`pnpm nx run ${appName}:dev`, {
      cwd: workspacePath,
      until: (data) => data.includes('http://127.0.0.1'),
    });

    expect(output).toContain('[ ngrok ');
    expect(output).toContain('tunnel - https://');
    expect(output).toContain('.ngrok.io');
    expect(output).toContain('web interface - http://127.0.0.1');
  }, 120000);

  it('should override the target port with a user defined port', async () => {
    const appName = uniq('my-app');
    const port = 8000;
    customPorts.push(port);

    await runCli(
      `pnpm nx generate @nrwl/next:application ${appName} --e2eTestRunner=none --unitTestRunner=none --no-interactive"`,
      { cwd: workspacePath }
    );

    await runCli(
      `pnpm nx generate nx-ngrok:tunnel dev --project=${appName} --serverTarget=${appName}:serve --port=${port}`,
      { cwd: workspacePath }
    );

    const output = await runCli(`pnpm nx run ${appName}:dev`, {
      cwd: workspacePath,
      until: (data) => data.includes('http://127.0.0.1'),
    });

    expect(output).not.toContain('[ ready ] on http://localhost:4200');
    expect(output).toContain('[ ready ] on http://localhost:8000');
    expect(output).toContain('[ ngrok ');
    expect(output).toContain('tunnel - https://');
    expect(output).toContain('.ngrok.io');
  }, 120000);

  it('should override the target port with a random free port', async () => {
    const appName = uniq('my-app');

    await runCli(
      `pnpm nx generate @nrwl/next:application ${appName} --e2eTestRunner=none --unitTestRunner=none --no-interactive"`,
      { cwd: workspacePath }
    );

    await runCli(
      `pnpm nx generate nx-ngrok:tunnel dev --project=${appName} --serverTarget=${appName}:serve --port=auto`,
      { cwd: workspacePath }
    );

    const output = await runCli(`pnpm nx run ${appName}:dev`, {
      cwd: workspacePath,
      until: (data) => data.includes('http://127.0.0.1'),
    });

    try {
      const customPortText = '[ ready ] on http://localhost:';
      const portIndex = output.indexOf(customPortText) + customPortText.length;
      const customPortString = output
        .substring(portIndex, portIndex + 5)
        .trim();

      const customPort = parseInt(customPortString);
      customPorts.push(customPort);
    } catch {
      //
    }

    expect(output).not.toContain('[ ready ] on http://localhost:4200');
    expect(output).toContain('[ ready ] on http://localhost:');
    expect(output).toContain('[ ngrok ');
    expect(output).toContain('tunnel - https://');
    expect(output).toContain('.ngrok.io');
  }, 120000);
});
