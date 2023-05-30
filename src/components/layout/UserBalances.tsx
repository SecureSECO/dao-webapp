import Rep from '@/src/components/icons/Rep';
import Secoin from '@/src/components/icons/Secoin';
import TokenAmount from '@/src/components/ui/TokenAmount';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { useSecoinBalance } from '@/src/hooks/useSecoinBalance';
import { useVotingPower } from '@/src/hooks/useVotingPower';
import { TOKENS } from '@/src/lib/constants/tokens';
import { BigNumber } from 'ethers';
import { IconType } from 'react-icons';
import { useAccount } from 'wagmi';

const UserBalances = () => {
  const { address, isConnected } = useAccount();
  const { votingPower, loading: repLoading } = useVotingPower({
    address,
  });
  const { secoinBalance, loading: secoinLoading } = useSecoinBalance({
    address,
  });

  const showBalances = isConnected && !repLoading && !secoinLoading;

  return showBalances ? (
    <div className="flex flex-col leading-5">
      <UserBalance
        bal={votingPower}
        decimals={TOKENS.rep.decimals}
        name={TOKENS.rep.name}
        icon={Rep}
      />
      <UserBalance
        bal={secoinBalance}
        decimals={TOKENS.secoin.decimals}
        name={TOKENS.secoin.name}
        icon={Secoin}
      />
    </div>
  ) : (
    <></>
  );
};

export const UserBalance = ({
  bal,
  decimals,
  name,
  ...props
}: {
  bal: BigNumber;
  decimals: number;
  name: string;
  icon: IconType;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger className="hover:cursor-help">
        <div className="flex items-center justify-end">
          <TokenAmount
            amount={bal}
            tokenDecimals={decimals}
            displayDecimals={0}
            className="h-fit text-right"
          />
          <props.icon className="text-primary" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{name} balance</TooltipContent>
    </Tooltip>
  );
};

export default UserBalances;
