/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @file RecentVerificationCard - Component that displays information about a past verification
 * It shows the stamp that was verified, and the time of the verification
 */

import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import {
  StampInfo,
  VerificationHistory,
  availableStamps,
} from '@/src/pages/Verification';
import { HiCalendar, HiQuestionMarkCircle } from 'react-icons/hi2';

/**
 * @returns A Card element containing information about a previous verification
 */
const RecentVerificationCard = ({
  history,
}: {
  history: VerificationHistory;
}) => {
  const fallBackStampInfo = {
    id: 'unknown',
    displayName: 'Unknown',
    url: 'https://www.google.com',
    icon: <HiQuestionMarkCircle />,
  } as StampInfo;

  const stamp = history.stamp;
  const stampInfo: StampInfo = stamp
    ? availableStamps.find((stampInfo) => stampInfo.id === stamp[0]) ??
      fallBackStampInfo
    : fallBackStampInfo;

  return (
    <Card variant="light" className="flex flex-col gap-y-1 font-normal">
      <div className="flex items-center gap-x-2">
        {stampInfo.icon}
        <Header level={3}>{stampInfo.displayName}</Header>
      </div>
      <div className="flex items-center gap-x-2 text-popover-foreground/80">
        <HiCalendar className="h-5 w-5 shrink-0" />
        <p className="font-normal">
          {new Date(history.timestamp * 1000).toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default RecentVerificationCard;
