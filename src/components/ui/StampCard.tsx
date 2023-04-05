/**
 * The StampCard component displays information about a specific stamp.
 * It shows the providerId, the last verified date, and a button to verify or reverify the stamp.
 * If the stamp is verified, a checkmark icon will be displayed next to the providerId.
 */

import { AiFillCheckCircle } from 'react-icons/ai';
import React from 'react';
import { Stamp } from '../../types/Stamp';
import { Button } from './Button';
import { Card } from './Card';

/**
 * @param {Object} props - The properties for the StampCard component.
 * @param {string} props.providerId - The providerId for the stamp.
 * @param {Stamp | null} props.stamp - The stamp object, or null if there is no stamp.
 * @param {(providerId: string) => void} props.verify - Callback to verify the stamp.
 * @returns A StampCard React element.
 */
const StampCard = ({
  providerId,
  stamp,
  verify,
}: {
  providerId: string;
  stamp: Stamp | null;
  verify: (providerId: string) => void;
}) => {
  const verified: boolean =
    stamp != null && stamp[2] > Date.now() / 1000 - 60 * 24 * 60 * 60; // 60 days

  return (
    <Card className="w-auto min-w-[min(80%,300px)]">
      <div className="flex items-center gap-x-2">
        {verified && (
          <AiFillCheckCircle className="max-w-[24px] text-green-500" />
        )}
        <h2 className="text-xl font-medium capitalize">{providerId}</h2>
      </div>
      <p className="mt-2 font-normal">
        Last verified at:{' '}
        {stamp ? new Date(stamp[2] * 1000).toDateString() : 'never'}
      </p>
      <Button className="mt-4" onClick={() => verify(providerId)}>
        {verified ? 'Reverify' : 'Verify'}
      </Button>
    </Card>
  );
};

export default StampCard;
