import { cn } from './utils';

test('cn with padding conflicts uses last padding', () => {
  const className = 'p-0 p-32';
  const expected = 'p-32';
  expect(cn(className)).toBe(expected);
});
