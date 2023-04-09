import { check as portCheck } from 'tcp-port-used';
import kill from 'kill-port';

import { isVerbose } from './run-cli';

const KILL_PORT_DELAY = 5000;

export async function killPort(port: number): Promise<boolean> {
  if (await portCheck(port, 'localhost')) {
    try {
      if (isVerbose()) {
        process.stdout.write(`Attempting to close port ${port}`);
      }

      await kill(port);

      await new Promise<void>((resolve) =>
        setTimeout(() => resolve(), KILL_PORT_DELAY)
      );

      if (await portCheck(port)) {
        if (isVerbose()) {
          process.stdout.write(`Port ${port} still open`);
        }
      } else {
        if (isVerbose()) {
          process.stdout.write(`Port ${port} successfully closed`);
        }
        return true;
      }
    } catch {
      if (isVerbose()) {
        process.stdout.write(`Port ${port} closing failed`);
      }
    }
    return false;
  } else {
    return true;
  }
}

export async function killPorts(...ports: number[]): Promise<boolean> {
  const killed = await Promise.all(ports.map((p) => killPort(p)));

  return killed.every(Boolean);
}
