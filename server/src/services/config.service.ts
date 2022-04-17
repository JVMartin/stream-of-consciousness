import { Level } from 'pino';

type NodeEnv = 'production' | 'development' | 'test';

const PORT = 'PORT';
const NODE_ENV = 'NODE_ENV';
const LOG_LEVEL = 'LOG_LEVEL';
const LOAD_RULES = 'LOAD_RULES';
const TWITTER_TAGS = 'TWITTER_TAGS';
const TWITTER_BEARER_TOKEN = 'TWITTER_BEARER_TOKEN';

export class ConfigService {
  public readonly port: number;

  public readonly nodeEnv: NodeEnv;

  /**
   * The log level, application-wide.
   */
  public readonly logLevel: Level;

  public readonly loadRules: boolean;

  public readonly twitterTags: string;
  public readonly twitterBearerToken: string;

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
    this.port = Number(process.env[PORT]) || 80;
    this.loadRules = `${process.env[LOAD_RULES]}`.toLowerCase()[0] !== 'f';

    /**
     * -------------------------------------------------------------------------
     * REQUIRED VARIABLES
     * -------------------------------------------------------------------------
     */
    // We can safely cast these to strings because we already called
    // checkRequiredVars();
    this.twitterTags = process.env[TWITTER_TAGS] as string;
    this.twitterBearerToken = process.env[TWITTER_BEARER_TOKEN] as string;
  }

  private checkRequiredVars(): void {
    const requiredVars: string[] = [TWITTER_TAGS, TWITTER_BEARER_TOKEN];

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
