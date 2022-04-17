import * as cors from 'cors';
import { EventEmitter } from 'events';
import * as express from 'express';
import { Logger } from 'pino';

import { ConfigService } from './config.service';

export class ServerService {
  public imageEmitter: EventEmitter;

  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {
    this.imageEmitter = new EventEmitter();
  }

  public run(): any {
    this.logger.trace('Initializing express server');

    const app = express();
    app.use(cors());

    let i = 0;

    app.get('/image', (req, res) => {
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      });

      const num = ++i;

      this.logger.info(`ADD ${num}`);

      const listener = (image) => {
        this.logger.trace(`EMIT ${num} ${image.url}`);
        res.write(`data:${JSON.stringify(image)}`);
        res.write(`\n\n`);
      };

      const handle = this.imageEmitter.on('image', listener);

      req.on('close', () => {
        this.logger.info(`REMOVE ${num}`);
        handle.removeListener('image', listener);
      });
    });

    app.listen(this.configService.port, () => {
      this.logger.info(`Listening on port ${this.configService.port}`);
    });
  }
}
