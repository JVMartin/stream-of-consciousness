import { default as pino } from 'pino';

import { ConfigService } from './services/config.service';
import { ImageDtoCollectionService } from './services/image-dto-collection.service';
import { OrchestrationService } from './services/orchestration.service';
import { ServerService } from './services/server.service';
import { TwitterService } from './services/twitter.service';

(async () => {
  const configService = new ConfigService();
  const logger = pino({ level: configService.logLevel });
  const imageCollectionService = new ImageDtoCollectionService(logger);
  const serverService = new ServerService(configService, logger);
  const twitterService = new TwitterService(configService, logger);
  const orchestrationService = new OrchestrationService(
    configService,
    logger,
    twitterService,
    serverService,
    imageCollectionService,
  );

  await orchestrationService.run();
})();
