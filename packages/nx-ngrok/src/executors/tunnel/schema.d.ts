import type { Ngrok } from 'ngrok';

export interface TunnelExecutorSchema {
  address?: string | number;
  auth?: string;
  authToken?: string;
  ngrokConfig?: string;
  protocol?: Ngrok.Options['proto'];
  region?: Ngrok.Options['region'];
  serverTarget?: string;
  subdomain?: string;
}
