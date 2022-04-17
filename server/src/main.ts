import { default as pino } from 'pino';

import { ConfigService } from './services/config.service';
import { TwitterService } from './services/twitter.service';
import { ServerService } from './services/server.service';

(async () => {
  const configService = new ConfigService();
  const logger = pino({ level: configService.logLevel });
  const twitterService = new TwitterService(configService, logger);
  const serverService = new ServerService(configService, logger);

  logger.info('Starting up');
  if (configService.loadRules) {
    const rules = await twitterService.getRules();
    await twitterService.deleteRules(rules);
    await twitterService.setRules();
  }
  // twitterService.flood();

  serverService.run();
})().catch((e) => {
  console.log(JSON.stringify(e));
});
