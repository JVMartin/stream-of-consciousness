import { ConfigService } from './services/config.service';
import { default as pino } from 'pino';

(async () => {
  const configService = new ConfigService();
  const logger = pino({ level: configService.logLevel });

  logger.info('Starting up');
})();
