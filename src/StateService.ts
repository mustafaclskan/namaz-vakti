
export class StateService {
  private static listeners: { (x: boolean): void }[] = [];

  static setLoading(b: boolean): void {
    for (const listener of StateService.listeners) {
      listener(b);
    }
  }

  static addListener(f: { (x: boolean): void }): void {
    StateService.listeners.push(f);
  }
}