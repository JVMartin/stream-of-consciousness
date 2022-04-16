import * as needle from 'needle';
import { Logger } from 'pino';

import { ConfigService } from './config.service';

export class TwitterService {
  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {}

  public flood() {
    this.logger.info(this.flood.name);

    const stream = needle.get(
      'https://api.twitter.com/2/tweets/sample/stream?tweet.fields=text,attachments&media.fields=url',
      {
        headers: {
          'User-Agent': 'v2SampleStreamJS',
          Authorization: `Bearer ${this.configService.twitterBearerToken}`,
        },

        timeout: 20 * 1000,
      },
    );

    stream.on('data', (data) => {
      try {
        const tweet = JSON.parse(data);
        this.logger.info({ tweet }, 'Tweet');
      } catch (e) {
        this.logger.error({ data }, e.message);
      }
    });
  }
}
