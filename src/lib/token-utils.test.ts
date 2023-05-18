import { bigIntToFloat, toAbbreviatedTokenAmount } from '@/src/lib/token-utils';

test('bigIntToFloat correct on 12345678n, decimal 4', () => {
  expect(bigIntToFloat(12345678n, 4)).toBe(1234.5678);
  expect(bigIntToFloat(12345678n, 4)).not.toBe(12345.678);
});

test('bigIntToFloat correct on 123456781234567812345678n, decimal 18', () => {
  expect(bigIntToFloat(123456781234567812345678n, 18)).toBeCloseTo(
    123456.78123456781
  );
});

test('bigIntToFloat correct on 1n, decimal 0 (ERC721)', () => {
  expect(bigIntToFloat(1n, 0)).toBe(1);
});
