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

  const authtoken =
    options.authToken ?? process.env['NGROK_AUTHTOKEN'] ?? undefined;

  for await (const serverValues of startTarget(options, context)) {
    logger.info(' ');
    logger.info(' ');

    const ngrokConfig = {
      addr: serverValues.baseUrl,
      auth: options.auth,
      authtoken,
      configPath: options.ngrokConfig,
      proto: options.protocol,
      region: options.region,
      subdomain: options.subdomain,
      // onLogEvent: (log) => {
      //   logger.debug(chalk.dim(`${chalk.yellow('ngrok')} - log - ${log}`));
      // },
    };

    Object.keys(ngrokConfig).forEach(
      (key) => ngrokConfig[key] === undefined && delete ngrokConfig[key]
    );

    try {
      const version = await ngrok.getVersion(ngrokConfig);

      logger.info(
        `[ ${chalk.yellow.bold(`ngrok`)} ${chalk.yellow.dim(version)} ]`
      );

      tunnelUrl = await ngrok.connect(ngrokConfig);

      webInterfaceUrl = ngrok.getUrl();

      success = true;

      logger.info(`${chalk.yellow('tunnel')} - ${tunnelUrl}`);

      logger.info(
        chalk.dim(`${chalk.yellow('web interface')} - ${webInterfaceUrl}`)
      );
    } catch (error) {
      logger.error(`nx-ngrok:tunnel - error - ${error?.message}`);

      success = false;
    }

    logger.info(' ');
    logger.info(' ');
  }

  process.on('exit', async () => {
    await ngrok.disconnect();
    await ngrok.kill();
  });

  process.on('SIGTERM', async () => {
    await ngrok.disconnect();
    await ngrok.kill();
  });

  yield {
    baseUrl: tunnelUrl,
    success,
  };

  if (success) {
    await new Promise<{ success: boolean }>(() => {
      // This Promise intentionally never resolves, leaving the process running.
    });
  }

  return {
    baseUrl: tunnelUrl,
    success,
  };
}

export default tunnelExecutor;
