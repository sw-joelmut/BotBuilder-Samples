
export class AppRegistrationQueue {
  public taken = [];
  public idle = [];
  private listeners = [];

  constructor(public apps: any[] = []) {
    this.idle = Array.from(apps);
  }

  public async take(): Promise<any> {
    return new Promise<any>((resolve) => {
      if (this.idle.length === 0) {
        this.listeners.push(resolve);
      } else {
        this._take(resolve);
      }
    });
  }

  public free(app: any): void {
    this.taken = this.taken.filter((e) => !app?.id.includes(e?.id));
    this.idle.push(app);
    if (this.idle.length) {
      const [resolve, ...rest] = this.listeners;
      this.listeners = rest;
      this._take(resolve);
    }
  }

  private _take(resolver) {
    const app = this.idle.splice(0, 1)?.[0];
    this.taken.push(app);
    resolver?.(app);
  }
}