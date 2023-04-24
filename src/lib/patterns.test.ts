import { AddressPattern, NumberPattern } from '@/src/lib/patterns';

test('Success cases for Number Pattern', () => {
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

test('Failure cases for Number Pattern', () => {
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

test('Success cases for Address Pattern', () => {
  const successes = [
    '0xf80A4cbdA4Fb35d59B40d9aD54C198280bBa1B36',
    '0xED45FF9490723c2fb4A354e4B554c357604eA73C',
    '0xdAfAB237B65cf37B3aAB7aF251C99764998e5E97',
    '0xaF7E68bCb2Fc7295492A00177f14F59B92814e70',
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f',
  ];
  testSuccesses(AddressPattern, successes);
});

test('Failure cases for Address Pattern', () => {
  const failures = [
    'Not an address',
    '7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', // No 0x leader
    'null',
    '', //empty string
    ' 0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', //space at beginning
    '0x7f2B04dFE3a529BB6527c F4C33F87F5A87b4AB2f', //space at middle
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f ', // space at end
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', // too long
    '0x7f2B04', // too short
    '0x7f2z04dZE3a529BB6z27cF4C33FZ7F5A87b4zB2f', //contains z and Z
  ];
  testFailures(AddressPattern, failures);
});

function testSuccesses(pattern: string, successes: string[]) {
  const regex = new RegExp(pattern);
  successes.forEach((value) => {
    expect(regex.test(value)).toBeTruthy;
  });
}

function testFailures(pattern: string, failures: string[]) {
  const regex = new RegExp(pattern);
  failures.forEach((value) => {
    expect(regex.test(value)).toBeFalsy;
  });
}
