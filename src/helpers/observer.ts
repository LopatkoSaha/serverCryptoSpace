type TListener = (message: string) => void;

class Observer {
  private listeners: TListener[] = [];

  public subscribe(cb: TListener) {
    this.listeners.push(cb);
  }

  public unsubscribe(cb: TListener) {
    this.listeners = this.listeners.filter((item) => item !== cb);
  }

  public emit(msg: string) {
    this.listeners.forEach((cb) => {
      cb(msg);
    });
  }
}
export const observer = new Observer();
