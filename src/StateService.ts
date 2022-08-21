
export class StateService {
  private static loadingListeners: { (x: boolean): void }[] = [];
  private static errorListeners: { (x: boolean): void }[] = [];

  static setLoading(b: boolean): void {
    for (const listener of StateService.loadingListeners) {
      listener(b);
    }
  }

  static addLoadingListener(f: { (x: boolean): void }): void {
    StateService.loadingListeners.push(f);
  }

  static setError(b: boolean): void {
    for (const listener of StateService.errorListeners) {
      listener(b);
    }
  }

  static addErrorListener(f: { (x: boolean): void }): void {
    StateService.errorListeners.push(f);
  }
}