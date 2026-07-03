import { chain, keys as lodashKeys } from 'lodash-es';

export const getSortedKeys = (object: object): string[] =>
  chain(lodashKeys(object))
    // Left as native Array.prototype.sort: lodash's sortBy does not accept a
    // Custom comparator (no localeCompare equivalent), so it isn't a
    // Behavior-preserving replacement here.
    .thru((keys) => keys.sort((a, b) => a.localeCompare(b)))
    .value();
