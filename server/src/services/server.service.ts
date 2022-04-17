import { ConfigService } from './config.service';
import * as express from 'express';
import * as cors from 'cors';
import { Logger } from 'pino';

export class ServerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  public run(): any {
    const app = express();
    app.use(cors());

    app.get('/image', (req, res) => {
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      });

      let i = 0;
      setInterval(() => {
        res.write(JSON.stringify({ image: `${++i}.png` }));
        res.write(`\n\n`);
      }, 500);
    });

    app.listen(this.configService.port, () => {
      this.logger.info(`Listening on port ${this.configService.port}`);
    });
  }
}
