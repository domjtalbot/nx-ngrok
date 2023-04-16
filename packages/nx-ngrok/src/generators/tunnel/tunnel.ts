import type { Tree } from '@nrwl/devkit';

import type { TunnelGeneratorSchema } from './schema';

import {
  convertNxGenerator,
  formatFiles,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export async function tunnelGenerator(
  tree: Tree,
  config: TunnelGeneratorSchema
) {
  const project = readProjectConfiguration(tree, config.project);

  project.targets = project.targets || {};

  const options = {
    address: config.address,
    auth: config.auth,
    port: undefined,
    protocol: config.protocol,
    region: config.region,
    target: config.target,
    subdomain: config.subdomain,
  };

  if (config.port === 'auto' || typeof config.port === 'number') {
    options.port = config.port;
  }

  Object.keys(options).forEach(
    (key) => options[key] === undefined && delete options[key]
  );

  project.targets[config.name] = {
    executor: 'nx-ngrok:tunnel',
    options,
  };

  updateProjectConfiguration(tree, config.project, project);

  await formatFiles(tree);
}

export default tunnelGenerator;

export const tunnelSchematic = convertNxGenerator(tunnelGenerator);
