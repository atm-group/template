import pkg from '../package.json';
import { North } from '@zblock/north';

export const config = {
  sentry: {
    dsn: "REPLACE_SENTRY_DSN",
    tracesSampleRate: 1.0,
    release: `${pkg.name}@${pkg.version}`
  },
  ga: {
    code: 'REPLACE_GACODE',
    debug: false,
  }
};

const north = new North(config);
export default north;