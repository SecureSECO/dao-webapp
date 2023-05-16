/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HiOutlineExclamationCircle } from 'react-icons/hi2';

/**
 * Shows a warning that the user does not own enough REP (voting power) to perform the action specified
 * @param props.action A string that represents the action the user is trying to perform (e.g. "to vote")
 * @returns A div with a warning message
 */
const InsufficientRepWarning = ({ action }: { action: string }) => {
  return (
    <div className="flex flex-row items-center gap-x-1 opacity-80">
      <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
      <p className="leading-4">Insufficient voting power {action}</p>
    </div>
  );
};

export default InsufficientRepWarning;
