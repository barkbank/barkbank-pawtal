export class Website {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public urlOf(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
