import { Card } from './Card';
import { availableStamps } from '@/src/pages/Verification';
import { HiCalendar, HiQuestionMarkCircle } from 'react-icons/hi2';
import {
  StampInfo,
  VerificationHistory,
  VerificationThreshold,
} from '../../pages/Verification';

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
    <Card
      padding="sm"
      variant="light"
      className="flex flex-col gap-y-2 p-4 font-normal"
    >
      <div className="flex items-center gap-x-2">
        {stampInfo.icon}
        <h2 className="text-xl font-semibold">{stampInfo.displayName}</h2>
      </div>
      <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
        <HiCalendar />
        <p className="font-normal">
          {new Date(history.timestamp * 1000).toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default RecentVerificationCard;
