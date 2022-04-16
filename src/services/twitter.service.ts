import { ConfigService } from './config.service';
import * as needle from 'needle';

export class TwitterService {
  constructor(private readonly configService: ConfigService) {}

  public stream() {
    needle.get();
  }
}
