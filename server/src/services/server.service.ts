import { ConfigService } from './config.service';
import * as express from 'express';
import * as cors from 'cors';
import { Logger } from 'pino';
import { EventEmitter } from 'events';

export class ServerService {
  public eventEmitter: EventEmitter;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  public run(): any {
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
        this.logger.info(`EMIT ${num} ${image}`);
        res.write(`data:${JSON.stringify({ image })}`);
        res.write(`\n\n`);
      };

      const handle = this.eventEmitter.on('image', listener);

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
