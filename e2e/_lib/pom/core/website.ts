export class Website {
  constructor(public baseUrl: string) {}

  public urlOf(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
