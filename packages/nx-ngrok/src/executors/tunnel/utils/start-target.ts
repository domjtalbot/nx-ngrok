import type { ExecutorContext } from '@nrwl/devkit';

import type { TunnelExecutorSchema } from '../schema';

import { parseTargetString, runExecutor } from '@nrwl/devkit';

export async function* startTarget(
  options: TunnelExecutorSchema,
  context: ExecutorContext
) {
  if (!options.serverTarget) {
    yield { baseUrl: options.address ?? undefined };

    return;
  }

  const parsedDevServerTarget = parseTargetString(
    options.serverTarget,
    context.projectGraph
  );

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
    info?: { port: number; baseUrl?: string };
  }>(parsedDevServerTarget, {}, context)) {
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
    };
  }
}

export default startTarget;
