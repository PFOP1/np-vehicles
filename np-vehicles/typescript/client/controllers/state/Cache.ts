// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

class Cache {
    private _entries = new Map();
  
    constructor() {
      this._entries = new Map();
    }
  
    has(key: string): boolean {
      return this._entries.has(key);
    }
  
    isExpired(key: string): boolean {
      const { ttl, timestamp } = this._entries.get(key);
      return Date.now() - timestamp > ttl;
    }
  
    get(key: string): any {
      return this._entries.get(key).value;
    }
  
    set(key: string, value: any, ttl: number = 1000): void {
      this._entries.set(key, {
        value,
        timestamp: Date.now(),
        ttl
      });
    }
  
    delete(key: string): boolean {
      return this._entries.delete(key);
    }
  
    clear(): void {
      this._entries.clear();
    }
  
    forEach(callbackfn: (value: any, key: string) => void): void {
      this._entries.forEach((entry, key) => callbackfn(entry.value, key));
    }
  
    find(callbackfn: (value: any, key: string) => boolean): [string, { value: any, timestamp: number, ttl: number }] | undefined {
      return [...this._entries.entries()].find(([key, entry]) => callbackfn(entry.value, key));
    }
  
    some(callbackfn: (value: any, key: string) => boolean): boolean {
      return [...this._entries.entries()].some(([key, entry]) => callbackfn(entry.value, key));
    }
  }
  
  

export {
    Cache,
};