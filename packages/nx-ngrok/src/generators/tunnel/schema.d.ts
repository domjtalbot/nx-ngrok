import type { Ngrok } from 'ngrok';

export interface TunnelGeneratorSchema {
  address?: string | number;
  auth?: string;
  project: string;
  name: string;
  protocol?: Ngrok.Options['proto'];
  region?: Ngrok.Options['region'];
  serverTarget?: string;
  subdomain?: string;
}
