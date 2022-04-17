import { default as pino } from 'pino';

import { ConfigService } from './services/config.service';
import { TwitterService } from './services/twitter.service';
import { ServerService } from './services/server.service';
import { ImageCollectionService } from './services/image-collection.service';
import { OrchestrationService } from './services/orchestration.service';

(async () => {
  const configService = new ConfigService();
  const logger = pino({ level: configService.logLevel });
  const imageCollectionService = new ImageCollectionService();
  const serverService = new ServerService(configService, logger);
  const twitterService = new TwitterService(configService, logger);
  const orchestrationSevice = new OrchestrationService(configService, logger, twitterService, serverService, imageCollectionService);

  await orchestrationSevice.run();
})().catch((e) => {
  console.log(JSON.stringify(e));
});
