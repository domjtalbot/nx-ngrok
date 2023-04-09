import { spawn } from 'node:child_process';
import { killPorts } from './kill-ports';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function isVerbose() {
  return (
    process.env.NX_VERBOSE_LOGGING === 'true' ||
    process.argv.includes('--verbose')
  );
}

export const runCli = (
  command: string,
  options: {
    cwd: string;
    until?: (data: string) => boolean;
    timeout?: number;
  }
) => {
  const [root, ...args] = command.split(' ');

  const childProcess = spawn(root, args, {
    stdio: 'pipe',
    cwd: options.cwd,
    env: {
      ...process.env,
      NGROK_AUTHTOKEN: undefined,
      CI: 'true',
      FORCE_COLOR: 'false',
    },
    timeout: options.timeout ? options.timeout + 10000 : undefined,
  });

  return new Promise<string>((resolve, reject) => {
    let isTimedOut = false;
    let output = '';

    // Ensure the child process is killed when the parent exits
    process.on('exit', () => childProcess.kill('SIGKILL'));
    process.on('SIGTERM', () => childProcess.kill('SIGKILL'));

    childProcess?.stdout?.on('data', (chunk) => {
      if (isVerbose()) {
        process.stdout.write(chunk);
      }

      output = `${output}
${chunk.toString()}`;

      if (options.until?.(chunk.toString())) {
        childProcess.kill('SIGKILL');
      }
    });

    childProcess?.stderr?.on('data', (chunk) => {
      if (isVerbose()) {
        process.stderr.write(chunk);
      }
    });

    childProcess.on('error', (err) => {
      if (isTimedOut) {
        resolve(output);
      } else {
        reject(err);
      }
    });

    childProcess.on('exit', (code) => {
      resolve(output);
    });

    if (options.timeout) {
      delay(options.timeout).then(async () => {
        isTimedOut = true;

        childProcess.kill('SIGKILL');
        await killPorts(4200);

        resolve(output);
      });
    }
  });
};
