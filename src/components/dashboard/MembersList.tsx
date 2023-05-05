/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address, AddressLength } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { Member } from '@/src/hooks/useMembers';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';

/**
 * @returns A card containg showing a DAO member's address, jazzicon and REP balance (the latter only if available)
 */
const MemberCard = ({ member }: { member: Member }) => {
  return (
    <Card
      size="sm"
      className="flex flex-row items-center justify-between bg-popover"
    >
      <Address
        address={member.address}
        hasLink={true}
        maxLength={AddressLength.Medium}
        showCopy={false}
        jazziconSize="md"
      />
      {member.bal !== null && (
        <p className="whitespace-nowrap">
          {member.bal} {CHAIN_METADATA.rep.nativeCurrency.symbol}
        </p>
      )}
    </Card>
  );
};

/**
 * @returns An element containing a list of members, showing their address, jazzicon and REP balance
 */
const MembersList = ({
  members,
  loading,
  error,
}: {
  members: Member[];
  loading: boolean;
  error: string | null;
}) => {
  // Note: will not be rendered if loading is set to true
  // We may use the loading and error state differently in the future
  return (
    <div className="flex flex-col gap-y-2">
      {members.map((member) => (
        <MemberCard key={member.address} member={member} />
      ))}
    </div>
  );
};

export default MembersList;
