import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { Member } from '@/src/hooks/useMembers';
import { jsNumberForAddress } from 'react-jazzicon';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';

const MemberCard = ({ member }: { member: Member }) => {
  return (
    <Card
      padding="sm"
      className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-700/50"
    >
      {/* TODO: possibly include option to show Jazzicon in the Address component */}
      <div className="flex flex-row items-center gap-x-2">
        <div className="h-fit w-fit">
          <Jazzicon diameter={25} seed={jsNumberForAddress(member.address!)} />
        </div>
        <Address
          address={member.address}
          hasLink={true}
          maxLength={20}
          showCopy={false}
        />
      </div>
      <p className="whitespace-nowrap">{member.bal} REP</p>
    </Card>
  );
};

const MembersList = ({
  members,
  loading,
  error,
}: {
  members: Member[];
  loading: boolean;
  error: string | null;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      {members.map((member) => (
        <MemberCard key={member.address} member={member} />
      ))}
    </div>
  );
};

export default MembersList;
