import { cn } from './utils';

// These are very simplistic tests, mostly meant as example tests.

test('cn with padding conflicts uses last padding', () => {
  expect(cn('p-0 p-32')).toBe('p-32');
  expect(cn('p-0', 'p-32')).toBe('p-32');
});

test('cn with simple && returns correct', () => {
  expect(cn('p-0', false && 'm-1', true && 'grow-0')).toBe('p-0 grow-0');
});
