import { Logger } from 'pino';

import { ConfigService } from './config.service';
import { ImageCollectionService } from './image-collection.service';
import { ServerService } from './server.service';
import { TwitterService } from './twitter.service';

export class OrchestrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly twitterService: TwitterService,
    private readonly serverService: ServerService,
    private readonly imageCollectionService: ImageCollectionService,
  ) {}

  public async run() {
    this.logger.info('Starting up');

    if (this.configService.loadRules) {
      this.logger.info('Loading rules');

      const rules = await this.twitterService.getRules();
      await this.twitterService.deleteRules(rules);
      await this.twitterService.setRules();
    }

    this.serverService.run();
    this.twitterService.streamSearchImages((image) => {
      this.imageCollectionService.add(image);
    });

    // Every N seconds, grab an image from the collection and
    // emit it via the server's imageEmitter.
    setInterval(() => {
      const image = this.imageCollectionService.remove();
      if (image) {
        this.logger.info(`Emitting image ${image} (${this.imageCollectionService.size()} remaining)`);
        this.serverService.imageEmitter.emit('image', image);
      }
    }, 2000);
  }
}
