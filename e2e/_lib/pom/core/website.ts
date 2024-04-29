export class Website {
  constructor(public baseUrl: string) {}

  urlOf(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
