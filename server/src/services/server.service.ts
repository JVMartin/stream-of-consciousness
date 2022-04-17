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

    app.get('/image', (req, res) => {
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      });

      this.eventEmitter.on('image', (image) => {
        res.write(`data:${JSON.stringify({ image })}`);
        res.write(`\n\n`);
      });
    });

    app.listen(this.configService.port, () => {
      this.logger.info(`Listening on port ${this.configService.port}`);
    });
  }
}
