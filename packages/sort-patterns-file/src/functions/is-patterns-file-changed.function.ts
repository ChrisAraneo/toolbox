import { find, isUndefined } from 'lodash-es';
import { match } from 'ts-pattern';

const hasDifferentLength = ([a, b]: [string[], string[]]): boolean =>
  a.length !== b.length;

const hasDifferentElementAt = ([a, b]: [string[], string[]]): boolean =>
  !isUndefined(find(a, (value, index) => value !== b[index]));

export const isPatternsFileChanged = (a: string[], b: string[]): boolean =>
  match([a, b] as [string[], string[]])
    .when(hasDifferentLength, () => true)
    .otherwise(hasDifferentElementAt);
