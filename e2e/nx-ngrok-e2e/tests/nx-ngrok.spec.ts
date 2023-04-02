import { ensureNxProject, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

xdescribe('nx-ngrok e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('nx-ngrok', 'dist/packages/nx-ngrok');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  xit('should create nx-ngrok', async () => {
    // const project = uniq('nx-ngrok');
    // await runNxCommandAsync(`generate nx-ngrok:nx-ngrok ${project}`);
    // const result = await runNxCommandAsync(`build ${project}`);
    // expect(result.stdout).toContain('Executor ran');
  }, 120000);
});
