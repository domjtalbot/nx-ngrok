import {
  addProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import update from './rename-servertarget-to-target';

describe('Migration - rename-servertarget-to-target', () => {
  it('should rename serverTarget to target', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    addProjectConfiguration(
      tree,
      'example',
      {
        root: 'apps/example',
        projectType: 'application',
        targets: {
          dev: {
            executor: 'nx-ngrok:tunnel',
            options: {
              serverTarget: 'my-app:serve',
            },
          },
        },
      },
      true
    );

    await update(tree);

    const config = readProjectConfiguration(tree, 'example');

    expect(config.targets?.dev.options).not.toHaveProperty('serverTarget');
    expect(config.targets?.dev.options).toHaveProperty(
      'target',
      'my-app:serve'
    );
  });

  it('should not add target to configurations without a serverTarget', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    addProjectConfiguration(
      tree,
      'example',
      {
        root: 'apps/example',
        projectType: 'application',
        targets: {
          dev: {
            executor: 'nx-ngrok:tunnel',
            options: {
              port: 3000,
            },
          },
        },
      },
      true
    );

    await update(tree);

    const config = readProjectConfiguration(tree, 'example');

    expect(config.targets?.dev.options).not.toHaveProperty('serverTarget');
    expect(config.targets?.dev.options).not.toHaveProperty('target');

    expect(config.targets?.dev.options).toHaveProperty('port', 3000);
  });
});
