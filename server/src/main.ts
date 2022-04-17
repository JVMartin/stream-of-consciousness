import { default as pino } from 'pino';

import { ConfigService } from './services/config.service';
import { TwitterService } from './services/twitter.service';
import { ServerService } from './services/server.service';

(async () => {
  const configService = new ConfigService();
  const logger = pino({ level: configService.logLevel });
  const serverService = new ServerService(configService, logger);
  const twitterService = new TwitterService(configService, logger, serverService);

  logger.info('Starting up');
  if (configService.loadRules) {
    const rules = await twitterService.getRules();
    await twitterService.deleteRules(rules);
    await twitterService.setRules();
  }
  serverService.run();

  twitterService.flood();
})().catch((e) => {
  console.log(JSON.stringify(e));
});
