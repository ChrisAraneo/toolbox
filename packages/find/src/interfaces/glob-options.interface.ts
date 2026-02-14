export interface GlobOptions {
  readonly cwd?: string;
  readonly ignore?: string[];
  readonly dot: boolean;
  readonly absolute: boolean;
}
