import { AiFillCheckCircle, AiFillHourglass } from 'react-icons/ai';
import React from 'react';
import { Stamp } from '../../types/Stamp';
import { Button } from './Button';
import { Card } from './Card';
import { VerificationThreshold } from '@/src/types/VerificationThreshold';
import { BigNumber } from 'ethers';
import { isVerified } from '@/src/pages/Verification';
import { HiCalendar, HiChartBar, HiLink, HiXCircle } from 'react-icons/hi2';
import { StampInfo } from '@/src/types/StampInfo';
import { intervalToDuration } from 'date-fns';
import { FaHourglass } from 'react-icons/fa';
import { StatusBadge } from './StatusBadge';

const StampTag = ({
  icon,
  text,
  className,
}: {
  icon: JSX.Element;
  text: string;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-x-2 text-slate-600 dark:text-slate-400 ${className}`}
  >
    {icon}
    <p className="font-normal">{text}</p>
  </div>
);

const StampCard = ({
  stampInfo,
  stamp,
  thresholdHistory,
  verify,
}: {
  stampInfo: StampInfo;
  stamp: Stamp | null;
  thresholdHistory: VerificationThreshold[];
  // eslint-disable-next-line no-unused-vars
  verify: (providerId: string) => void;
}) => {
  const {
    verified,
    expired,
    preCondition,
    timeLeftUntilExpiration,
  }: {
    verified: boolean;
    expired: boolean;
    preCondition: boolean;
    timeLeftUntilExpiration: number | null;
  } = isVerified(thresholdHistory, stamp);

  const providerId = stampInfo.id;

  return (
    <Card
      padding="sm"
      variant="light"
      className="flex flex-col gap-y-2 p-4 font-normal"
    >
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          {stampInfo.icon}
          <h2 className="text-xl font-semibold">{stampInfo.displayName}</h2>
        </div>
        <StatusBadge
          status={verified ? 'Verified' : expired ? 'Expired' : 'Unverified'}
        />
      </div>
      <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
        <HiLink />
        <p className="font-normal">
          {/* Url:{' '} */}
          <a
            href={stampInfo.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            {stampInfo.url}
          </a>
        </p>
      </div>
      {stamp && stamp[2] && stamp[2].length > 0 && (
        <>
          <div className="flex items-center gap-x-6">
            <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
              <HiCalendar />
              <p className="font-normal">
                {/* Last verified at:{' '} */}
                {new Date(
                  stamp[2][stamp[2].length - 1].toNumber() * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            {verified && timeLeftUntilExpiration != null && (
              <div
                className={`flex items-center gap-x-2 ${
                  expired || timeLeftUntilExpiration / 86400 < 7
                    ? 'text-red-500'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FaHourglass size={14} />
                <p className="font-normal">
                  {Math.max(0, timeLeftUntilExpiration / 86400).toFixed(1)} days
                  until expiration
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
            <HiChartBar />
            <p className="font-normal">
              {/* Last verified at:{' '} */}
              Verified {stamp[2].length} time{stamp[2].length > 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}

      <Button
        className="mt-4"
        disabled={true}
        onClick={() => verify(providerId)}
      >
        {verified ? 'Reverify' : 'Verify'}
      </Button>
    </Card>
  );
};

export default StampCard;
