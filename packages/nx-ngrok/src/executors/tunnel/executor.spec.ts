import type { ExecutorContext } from '@nrwl/devkit';

import devkit from '@nrwl/devkit';
import Ngrok from 'ngrok';

import { tunnelExecutor } from './executor';

jest.mock('@nrwl/devkit');

describe('tunnel Executor', () => {
  const mockContext: ExecutorContext = {
    root: '/root',
    projectsConfigurations: {
      version: 0,
      projects: {
        'my-app': {
          root: 'apps/my-app',
          targets: {
            serve: { executor: '@nrwl/webpack:webpack', options: {} },
          },
        },
      },
    },
    cwd: '',
    isVerbose: false,
  };

  const ngrokRun = jest
    .spyOn(Ngrok, 'connect')
    .mockReturnValue(Promise.resolve(''));

  beforeEach(async () => {
    (devkit as unknown)['readTargetOptions'] = jest.fn().mockReturnValue({});

    (devkit as unknown)['runExecutor'] = jest.fn().mockReturnValue([
      {
        success: true,
        baseUrl: 'http://localhost:4200',
      },
    ]);

    (devkit as unknown)['parseTargetString'] = (s) => {
      const [project, target, configuration] = s.split(':');

      return {
        project,
        target,
        configuration,
      };
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('should fail early if application build fails', async () => {
    (devkit as unknown)['runExecutor'] = jest.fn().mockReturnValue([
      {
        success: false,
      },
    ]);

    try {
      await tunnelExecutor({}, mockContext).next();

      fail('Should not execute');
    } catch (e) {
      //
    }
  });

  it('should start a Ngrok tunnel with provided address', async () => {
    const tunnel = await tunnelExecutor(
      {
        address: 4200,
      },
      mockContext
    ).next();

    expect(tunnel?.value?.success).toEqual(true);

    expect(ngrokRun).toHaveBeenCalledWith(
      expect.objectContaining({
        addr: 4200,
      })
    );
  });

  it('should get baseUrl from the target', async () => {
    const tunnel = await tunnelExecutor(
      { target: 'myapp:serve' },
      mockContext
    ).next();

    expect(tunnel?.value?.success).toEqual(true);

    expect(ngrokRun).toHaveBeenLastCalledWith(
      expect.objectContaining({
        addr: 'http://localhost:4200',
      })
    );
  });
});
