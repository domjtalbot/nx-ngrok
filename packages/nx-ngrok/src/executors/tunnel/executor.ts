import type { ExecutorContext } from '@nrwl/devkit';

import type { TunnelExecutorSchema } from './schema';

import { logger } from '@nrwl/devkit';
import chalk from 'chalk';
import ngrok from 'ngrok';

import { startTarget } from './utils';
export async function* tunnelExecutor(
  options: TunnelExecutorSchema,
  context: ExecutorContext
) {
  let tunnelUrl: string | undefined;
  let webInterfaceUrl: string | undefined;
  let success: boolean | undefined;

  for await (const serverValues of startTarget(options, context)) {
    logger.info(' ');
    logger.info(' ');
    logger.info(`[ ${chalk.yellow.bold('ngrok')} ]`);

    try {
      tunnelUrl = await ngrok.connect({
        addr: serverValues.baseUrl,
        auth: options.auth,
        authtoken: options.authToken,
        configPath: options.ngrokConfig,
        proto: options.protocol,
        region: options.region,
        subdomain: options.subdomain,
        // onLogEvent: (log) => {
        //   logger.debug(chalk.dim(`${chalk.yellow('ngrok')} - log - ${log}`));
        // },
      });

      webInterfaceUrl = ngrok.getUrl();

      success = true;

      logger.info(`${chalk.yellow('tunnel')} - ${tunnelUrl}`);
      logger.info(
        chalk.dim(`${chalk.yellow('web interface')} - ${webInterfaceUrl}`)
      );
    } catch (error) {
      logger.error(error.message);

      success = false;
    }

    logger.info(' ');
    logger.info(' ');
  }

  yield {
    baseUrl: tunnelUrl,
    success,
  };

  await new Promise<{ success: boolean }>(() => {
    // This Promise intentionally never resolves, leaving the process running.
  });

  return {
    baseUrl: tunnelUrl,
    success,
  };
}

export default tunnelExecutor;
