import type { Tree } from '@nrwl/devkit';

import {
  formatFiles,
  getProjects,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export async function update(tree: Tree) {
  const projects = getProjects(tree);

  projects.forEach((config, name) => {
    let shouldUpdate = false;

    Object.entries(config.targets ?? {})?.forEach(([targetName, target]) => {
      if (target.executor === 'nx-ngrok:tunnel') {
        if (
          Object.prototype.hasOwnProperty.call(target.options, 'serverTarget')
        ) {
          const value = target.options['serverTarget'];

          if (config.targets?.[targetName].options['serverTarget']) {
            shouldUpdate = true;

            delete config.targets[targetName].options['serverTarget'];
            config.targets[targetName].options['target'] = value;
          }
        }
      }
    });

    if (shouldUpdate) updateProjectConfiguration(tree, name, config);
  });

  await formatFiles(tree);
}

export default update;
