import * as needle from 'needle';
import { Logger } from 'pino';

import { ConfigService } from './config.service';

export class TwitterService {
  private readonly userAgent: string =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
  private readonly rulesUrl: string = 'https://api.twitter.com/2/tweets/search/stream/rules';
  private readonly searchUrl: string = 'https://api.twitter.com/2/tweets/search/stream';

  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {}

  public async getRules(): Promise<any> {
    this.logger.info(this.getRules.name);

    const response = await needle('get', this.rulesUrl, {
      headers: {
        'User-Agent': this.userAgent,
        Authorization: `Bearer ${this.configService.twitterBearerToken}`,
      },
    });

    if (response.statusCode !== 200) {
      this.logger.error({ body: response.body });
      process.exit(1);
    }

    return response.body.data;
  }

  public async setRules(): Promise<any> {
    this.logger.info(this.setRules.name);

    const response = await needle(
      'post',
      this.rulesUrl,
      {
        add: [
          {
            value: '(ukraine OR #ukraine OR #war) has:images -is:retweet',
          },
        ],
      },
      {
        headers: {
          'User-Agent': this.userAgent,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.configService.twitterBearerToken}`,
        },
      },
    );

    if (response.statusCode !== 201) {
      this.logger.error({ body: response.body });
      process.exit(1);
    }

    return response.body;
  }

  public async deleteRules(rules): Promise<any> {
    this.logger.info(this.deleteRules.name);

    if (!Array.isArray(rules)) {
      return null;
    }

    const ids = rules.map((rule) => rule.id);

    const data = {
      delete: {
        ids,
      },
    };

    const response = await needle('post', this.rulesUrl, data, {
      headers: {
        'User-Agent': this.userAgent,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.twitterBearerToken}`,
      },
    });

    if (response.statusCode !== 200) {
      this.logger.error({ body: response.body });
      process.exit(1);
    }

    return response.body;
  }

  public streamSearchImages(cb: (image: string) => any) {
    this.logger.info(this.streamSearchImages.name);

    const url = `${this.searchUrl}?expansions=attachments.media_keys&tweet.fields=text&media.fields=url`;

    let consecutiveErrors = 0;

    needle.get(url, {
      headers: {
        'User-Agent': this.userAgent,
        Authorization: `Bearer ${this.configService.twitterBearerToken}`,
      },

      timeout: 20 * 1000,
    }).on('data', (data) => {
      try {
        const tweet = JSON.parse(data);
        // this.logger.info({ tweet }, 'Tweet');
        const images = tweet?.includes?.media.filter((x) => x.type === 'photo').map((x) => x.url);
        for (const image of images) {
          cb(image);
        }
        consecutiveErrors = 0;
      } catch (e) {
        this.logger.error({ data }, e.message);
        if (++consecutiveErrors > 10) {
          process.exit(1);
        }
      }
    });
  }
}
