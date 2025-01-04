// Stryker disable all

export class CurrentDirectory {
  getCurrentDirectory(): string {
    return __dirname;
  }
}
