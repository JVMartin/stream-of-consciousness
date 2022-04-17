import { Logger } from 'pino';
import { ImageDto } from '../types/image.dto';

export class ImageDtoCollectionService {
  private static MAX_LENGTH: number = 500;

  /**
   * Map allows for hyper-fast lookups with no array search
   */
  private readonly map: Map<string, boolean>;

  /**
   * Array is our FIFO queue
   */
  private readonly queue: ImageDto[];

  constructor(private readonly logger: Logger) {
    this.map = new Map<string, boolean>();
    this.queue = [];
  }

  public add(image: ImageDto) {
    if (this.map.has(image.url)) {
      return false;
    }
    if (this.queue.length >= ImageDtoCollectionService.MAX_LENGTH) {
      return false;
    }

    this.logger.trace(`Adding image ${image.url}`);
    this.map.set(image.url, true);
    this.queue.push(image);
  }

  public remove(): ImageDto {
    const image = this.queue.shift();

    if (image) {
      this.map.delete(image.url);
    }

    return image;
  }

  public size(): number {
    return this.queue.length;
  }
}
