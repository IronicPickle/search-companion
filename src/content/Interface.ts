import moment from "moment";

export default class Interface {
  name: string = `${this.constructor.name} Interface`;
  signatures: { [key: string]: { signature: () => any, handler: () => any } };

  intervalId?: number;
  timeoutId?: number;

  constructor(signatures: { [key: string]: { signature: () => any, handler: () => any } }) {
    this.signatures = signatures;
    console.log(`[${this.name}] Registered signatures: ${Object.keys(signatures).join(" | ").toUpperCase()}`);
  }

  startInterval(interval: number) {
    this.intervalId = window.setInterval(() => this.start(), interval);
    console.log(`[${this.name}] ${moment(interval).format("s")} second(s) interval started - ID: ${this.intervalId}`);
  }

  startTimeout(timeout: number) {
    this.timeoutId = window.setTimeout(() => this.start(), timeout);
    console.log(`[${this.name}] ${moment(timeout).format("s.S")} second(s) timeout started - ID: ${this.timeoutId}`);
  }

  start() {
    const signature = this.checkSignature();
    if(signature != null) this.signatures[signature].handler();
  }

  checkSignature() {
    for(const i in this.signatures) {
      const signature = this.signatures[i];
      if(signature.signature()) return i;
    }
    return null;
  }
}