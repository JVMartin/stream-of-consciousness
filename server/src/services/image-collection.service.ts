export class ImageCollectionService {
  private static MAX_LENGTH: number = 500;

  /**
   * Map allows for hyper-fast lookups with no array search
   */
  private readonly map: Map<string, boolean>;

  /**
   * Array is our FIFO queue
   */
  private readonly queue: string[];

  constructor() {
    this.map = new Map<string, boolean>();
    this.queue = [];
  }

  public add(image: string) {
    if (this.map.has(image)) {
      return false;
    }
    if (this.queue.length >= ImageCollectionService.MAX_LENGTH) {
      return false;
    }

    this.map.set(image, true);
    this.queue.push(image);
  }

  public remove(): string {
    const image = this.queue.shift();
    if (image) {
      this.map.delete(image);
    }
    return image;
  }
}