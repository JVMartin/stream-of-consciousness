import { ConfigService } from './config.service';
import { Logger } from 'pino';
import { ImageCollectionService } from './image-collection.service';
import { TwitterService } from './twitter.service';
import { ServerService } from './server.service';

export class OrchestrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly twitterService: TwitterService,
    private readonly serverService: ServerService,
    private readonly imageCollectionService: ImageCollectionService,
  ) {
  }

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

    setInterval(() => {
      const image = this.imageCollectionService.remove();
      if (image) {
        this.logger.trace(`Emitting image ${image}`);
        this.serverService.imageEmitter.emit('image', image);
      }
    }, 2000);
  }
}
