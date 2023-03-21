import { AiFillCheckCircle } from 'react-icons/ai';
import React from 'react';
import { Stamp } from '../../types/Stamp';
import { Button } from './Button';
import { Card } from './Card';

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
