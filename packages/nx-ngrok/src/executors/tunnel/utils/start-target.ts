import type { ExecutorContext } from '@nrwl/devkit';

import type { TunnelExecutorSchema } from '../schema';

import { parseTargetString, runExecutor } from '@nrwl/devkit';

export async function* startTarget(
  options: TunnelExecutorSchema,
  context: ExecutorContext
) {
  // no dev server, return the provisioned base url
  if (!options.serverTarget) {
    yield { baseUrl: undefined };

    return;
  }

  const parsedDevServerTarget = parseTargetString(
    options.serverTarget,
    context.projectGraph
  );

  const overrides: Record<string, unknown> = {};

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
    info?: { port: number; baseUrl?: string };
  }>(parsedDevServerTarget, overrides, context)) {
    if (!output.success) throw new Error('Could not start target');

    if (
      !options.address &&
      !output.baseUrl &&
      !output.info?.baseUrl &&
      output.info?.port
    ) {
      output.baseUrl = `http://localhost:${output.info.port}`;
    }

    yield {
      baseUrl: options.address || output.baseUrl || output.info?.baseUrl,
      success: output.success,
    };
  }
}

export default startTarget;
