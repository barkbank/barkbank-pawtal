import { Result } from "../utilities/result";
import { HashService } from "./hash";

export class EmailHashService implements HashService {
  constructor(private hashService: HashService) {}
  digest(data: string): Promise<Result<{ hashHex: string }, string>> {
    return this.hashService.digest(data.toLowerCase());
  }
  getHashHex(data: string): Promise<string> {
    return this.hashService.getHashHex(data.toLowerCase());
  }
}
