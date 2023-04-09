import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { libraryGenerator } from '@nrwl/workspace';
import { readProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

import tunnelGenerator from './tunnel';

describe('tunnel', () => {
  it('should generate a target with a server target', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    await libraryGenerator(tree, {
      name: 'my-lib',
    });

    await tunnelGenerator(tree, {
      name: 'dev',
      project: 'my-lib',
      serverTarget: 'my-lib:serve',
    });

    const customTarget = readProjectConfiguration(tree, 'my-lib').targets.dev;

    expect(customTarget).toEqual({
      executor: 'nx-ngrok:tunnel',
      options: {
        serverTarget: 'my-lib:serve',
      },
    });
  });

  it('should generate a target with a custom address', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    await libraryGenerator(tree, {
      name: 'my-lib',
    });

    await tunnelGenerator(tree, {
      address: 'http://localhost:4200',
      name: 'dev',
      project: 'my-lib',
      protocol: 'tcp',
      region: 'eu',
      subdomain: 'test.dev',
    });

    const customTarget = readProjectConfiguration(tree, 'my-lib').targets.dev;

    expect(customTarget).toEqual({
      executor: 'nx-ngrok:tunnel',
      options: {
        address: 'http://localhost:4200',
        protocol: 'tcp',
        region: 'eu',
        subdomain: 'test.dev',
      },
    });
  });
});