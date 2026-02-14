// Stryker disable all

export interface FindOptions {
  readonly root?: string;
  readonly cwd?: string;
  readonly ignore?: readonly string[];
  readonly dot?: boolean;
}
