import type { ExecutorContext } from '@nrwl/devkit';

import type { TunnelExecutorSchema } from '../schema';

import { parseTargetString, runExecutor } from '@nrwl/devkit';
import getPort from 'get-port';

export async function* startTarget(
  options: TunnelExecutorSchema,
  context: ExecutorContext
) {
  let port: number | undefined;

  if (options.port === 'auto') {
    port = await getPort();
  }

  if (typeof options.port === 'number') {
    port = options.port;
  }

  if (!options.target) {
    yield { baseUrl: options.address ?? undefined };

    return;
  }

  const parsedDevtarget = parseTargetString(
    options.target,
    context.projectGraph
  );

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
    info?: { port: number; baseUrl?: string };
  }>(
    parsedDevtarget,
    {
      port,
    },
    context
  )) {
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
