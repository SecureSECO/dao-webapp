import { AddressPattern, NumberPattern, UrlPattern } from './patterns';

describe('Success cases for Number Pattern', () => {
  const successes = [
    '1',
    '3',
    '012345678900987654321',
    '0987654321234567890.0987654321234567890',
    '1.0',
    '3.14159',
    '0987654321234567890.0987654321234567890',
  ];
  testSuccesses(NumberPattern, successes);
});

describe('Failure cases for Number Pattern', () => {
  const failures = [
    'Not a number',
    'NaN',
    '-1',
    '-3.14159',
    ' 2',
    '3 ',
    '',
    '1 3',
  ];
  testFailures(NumberPattern, failures);
});

describe('Success cases for Address Pattern', () => {
  const successes = [
    '0xf80A4cbdA4Fb35d59B40d9aD54C198280bBa1B36',
    '0xED45FF9490723c2fb4A354e4B554c357604eA73C',
    '0xdAfAB237B65cf37B3aAB7aF251C99764998e5E97',
    '0xaF7E68bCb2Fc7295492A00177f14F59B92814e70',
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f',
  ];
  testSuccesses(AddressPattern, successes);
});

describe('Failure cases for Address Pattern', () => {
  const failures = [
    'Not an address',
    '7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', // No 0x leader
    'null',
    '', //empty string
    ' 0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', //space at beginning
    '0x7f2B04dFE3a529BB6527c F4C33F87F5A87b4AB2f', //space at middle
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f ', // space at end
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f09876543212345678909876543212345678909897654433212', // too long
    '0x7f2B04', // too short
    '0x7f2z04dZE3a529BB6z27cF4C33FZ7F5A87b4zB2f', //contains z and Z
  ];
  testFailures(AddressPattern, failures);
});

describe('Succes cases for Url Pattern', () => {
  const successes = [
    'http://MVSXX.COMPANY.COM:04445/CICSPLEXSM//JSMITH/VIEW/OURTASK?A_PRIORITY=200&O_PRIORITY=GT',
    'http://MVSXX.COMPANY.COM:04445/CICSPLEXSM//JSMITH/VIEW/OURWLMAWAOR.TABLE1?P_WORKLOAD=WLDPAY01',
    'https://www.example.com/123',
    'example.nl/example',
    'http://example.com',
    'example.com',
  ];
  testSuccesses(UrlPattern, successes);
});

describe('Failures cases for Url Pattern', () => {
  const failures = [
    '', // empty string
    ' ', //Only space
    ' www.example.com/123', // space at start
    'www.examp le.com/123', // space at middle
    'www.example.com/123 ', // space at end
    'www.example.com/😎', // invalid url character 😎
  ];
  testFailures(UrlPattern, failures);
});

function testSuccesses(pattern: RegExp, successes: string[]) {
  test.each(successes)('"%s" should match', (value) => {
    expect(pattern.test(value)).toBe(true);
  });
}

function testFailures(pattern: RegExp, failures: string[]) {
  test.each(failures)('"%s" should fail', (value) => {
    expect(pattern.test(value)).toBe(false);
  });
}
