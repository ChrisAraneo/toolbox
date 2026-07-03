import { indexOf, noop, pullAt } from 'lodash-es';
import { match } from 'ts-pattern';

export const removeArrayItem = (array: string[], item: string): void =>
  match(indexOf(array, item))
    .when(
      (index) => index !== -1,
      (index) => void pullAt(array, index),
    )
    .otherwise(noop);
