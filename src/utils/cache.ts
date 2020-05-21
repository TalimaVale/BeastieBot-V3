import Timeout = NodeJS.Timeout;

export type CacheKeyValPair<T> = {
  key: string;
  val: T;
};

export class Cache<T> {
  timeoutArray: Timeout[] = [];
  private storage: Map<string, T> = new Map<string, T>();
  private readonly fetch: (
    key: string | string[]
  ) => Promise<T | CacheKeyValPair<T>[]>;
  private readonly clearTime: number;

  // Default clear time of 24 hours
  constructor(
    fetchFunc: (key: string | string[]) => Promise<T | CacheKeyValPair<T>[]>,
    clearTime: number = 1000 * 60 * 60 * 24
  ) {
    this.fetch = fetchFunc;
    this.clearTime = clearTime;
  }

  async get(key: string | string[]): Promise<T | T[]> {
    return await (Array.isArray(key)
      ? this.getArray(key)
      : this.getSingle(key));
  }

  private addToCache(key: string, val: T) {
    this.storage.set(key, val);
    let timeoutId = setTimeout(() => {
      this.storage.delete(key);
      for (let i = 0; i < this.timeoutArray.length; i++) {
        if (this.timeoutArray[i] === timeoutId) {
          this.timeoutArray.splice(i, 1);
          break;
        }
      }
    }, this.clearTime);
    this.timeoutArray.push(timeoutId);
  }

  private async getSingle(key: string): Promise<T> {
    if (this.storage.has(key)) {
      return this.storage.get(key);
    }
    let val: T = (await this.fetch(key)) as T;

    if (val === null) {
      throw `Failed to fetch ${key}`;
    }

    this.addToCache(key, val);
    return val;
  }

  private async getArray(keys: string[]): Promise<T[]> {
    let retVals: T[] = [];

    keys = keys.filter((key: string): boolean => {
      if (!this.storage.has(key)) {
        return true;
      }

      retVals.push(this.storage.get(key));
      return false;
    });

    let vals: CacheKeyValPair<T>[] = (await this.fetch(
      keys
    )) as CacheKeyValPair<T>[];

    if (vals === null) {
      throw `Failed to fetch ${JSON.stringify(keys)}`;
    }

    vals.forEach(kvPair => {
      this.addToCache(kvPair.key, kvPair.val);
      retVals.push(kvPair.val);
    });

    return retVals;
  }
}
