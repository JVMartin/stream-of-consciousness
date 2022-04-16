import { Level } from 'pino';

type NodeEnv = 'production' | 'development' | 'test';

const NODE_ENV = 'NODE_ENV';
const LOG_LEVEL = 'LOG_LEVEL';
const TWITTER_API_KEY = 'TWITTER_API_KEY';

export class ConfigService {
  public readonly nodeEnv: NodeEnv;

  /**
   * The log level, application-wide.
   */
  public readonly logLevel: Level;

  public readonly twitterApiKey: string;

  constructor() {
    if (process.env[NODE_ENV] !== 'test') {
      this.checkRequiredVars();
    }

    /**
     * -------------------------------------------------------------------------
     * OPTIONAL VARIABLES
     * -------------------------------------------------------------------------
     */
    if (process.env[NODE_ENV]) {
      if (['production', 'development', 'test'].includes(process.env[NODE_ENV])) {
        this.nodeEnv = process.env[NODE_ENV] as NodeEnv;
      } else {
        throw new Error(`Invalid NODE_ENV: ${process.env[NODE_ENV]}`);
      }
    } else {
      this.nodeEnv = 'production';
    }
    if (process.env[LOG_LEVEL]) {
      if (['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(process.env[LOG_LEVEL])) {
        this.logLevel = process.env[LOG_LEVEL] as Level;
      } else {
        throw new Error(`Invalid LOG_LEVEL: ${process.env[LOG_LEVEL]}`);
      }
    } else {
      this.logLevel = 'info';
    }

    /**
     * -------------------------------------------------------------------------
     * REQUIRED VARIABLES
     * -------------------------------------------------------------------------
     */
    // We can safely cast these to strings because we already called
    // checkRequiredVars();
    this.twitterApiKey = process.env[TWITTER_API_KEY] as string;
  }

  private checkRequiredVars(): void {
    const requiredVars: string[] = [TWITTER_API_KEY];

    const missingVars = requiredVars.reduce((vars: string[], v: string) => {
      if (!process.env[v]) {
        vars.push(v);
      }

      return vars;
    }, []);

    if (missingVars.length) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}
