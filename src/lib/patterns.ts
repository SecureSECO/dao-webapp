/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberPattern is a pattern for positive floats. See the test cases for examples
 */
export const NumberPattern = /^\d+\.?\d*$/;

/**
 * AddressPattern is a pattern for Addresses, starting with 0x, followed by 20 to 60 hex characters.
 * See the test cases for examples.
 */
export const AddressPattern = /^0x[a-fA-F0-9]{20,60}$/;

/**
 * UrlPattern is a pattern for urls. See the test cases for examples.
 *  taken from: https://urlregex.com/
 */
export const UrlPattern = /^(https?:\/\/)?[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/;

export function patternToString(pattern: RegExp): string {
  return pattern.toString().slice(1, -1);
}
