import { default as pino } from 'pino';

import { ConfigService } from './services/config.service';
import { TwitterService } from './services/twitter.service';

(async () => {
  const configService = new ConfigService();
  const logger = pino({ level: configService.logLevel });
  const twitterService = new TwitterService(configService, logger);

  logger.info('Starting up');
  if (configService.loadRules) {
    const rules = await twitterService.getRules();
    await twitterService.deleteRules(rules);
    await twitterService.setRules();
  }
  // twitterService.flood();
})().catch((e) => {
  console.log(JSON.stringify(e));
});
