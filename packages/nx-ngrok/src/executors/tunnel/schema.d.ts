import type { Ngrok } from 'ngrok';

export interface TunnelExecutorSchema {
  address?: string | number;
  auth?: string;
  authToken?: string;
  ngrokConfig?: string;
  port?: 'targetDefault' | 'auto' | number;
  protocol?: Ngrok.Options['proto'];
  region?: Ngrok.Options['region'];
  target?: string;
  subdomain?: string;
}
