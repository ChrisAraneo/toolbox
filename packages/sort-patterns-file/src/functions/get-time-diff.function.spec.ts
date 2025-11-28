import { getTimeDiff } from './get-time-diff.function';

describe('getTimeDiff', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return time difference as string with 6 digits precision', () => {
    jest.spyOn(performance, 'now').mockReturnValue(1250.123_456_789);

    const result = getTimeDiff(1000);

    expect(result).toBe('250.123');
  });

  it('should return string type', () => {
    jest.spyOn(performance, 'now').mockReturnValue(200);

    const result = getTimeDiff(100);

    expect(typeof result).toBe('string');
  });
});
