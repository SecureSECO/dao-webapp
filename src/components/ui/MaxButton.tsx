/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TokenAmount from '@/src/components/ui/TokenAmount';

export type MaxButtonProps = {
  max: bigint;
  decimals: number;
  setMaxValue: () => void;
};
export const MaxButton = ({ max, decimals, setMaxValue }: MaxButtonProps) => {
  return (
    <div className="inline-flex items-center justify-center gap-x-1">
      <TokenAmount
        amount={max}
        tokenDecimals={decimals}
        displayDecimals={6}
        className="whitespace-nowrap"
      />
      <button
        type="button"
        onClick={() => setMaxValue()}
        className="w-full p-1 h-fit text-blue-500 underline underline-offset-2 active:scale-95 hover:text-blue-300"
      >
        Max
      </button>
    </div>
  );
};
