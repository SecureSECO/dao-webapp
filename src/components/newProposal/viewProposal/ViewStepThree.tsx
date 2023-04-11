/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address, AddressLength } from '../../ui/Address';
import { Card } from '../../ui/Card';
import { HeaderCard } from '../../ui/HeaderCard';
import {
  ActionFormData,
  ActionMintTokenFormData,
  ActionWithdrawFormData,
  StepThreeData,
} from '../newProposalData';

export const ViewStepThree = ({
  data,
}: {
  data: StepThreeData | undefined;
}) => {
  // If data is undefined
  if (!data)
    return (
      <HeaderCard variant="light" title="Actions">
        Actions are not available
      </HeaderCard>
    );
  // If there are no actions
  if (data.actions.length == 0)
    return (
      <HeaderCard variant="light" title="Actions">
        This proposal has no actions
      </HeaderCard>
    );

  return (
    <HeaderCard variant="light" title="Actions">
      {data.actions.map((action: ActionFormData, index: number) => (
        <ViewActionSwitch data={action} index={index} />
      ))}
    </HeaderCard>
  );
};

/**
 * Component that switches on the action type to select the corresponding viewer for each specific action.
 */
const ViewActionSwitch = ({
  data,
  index,
}: {
  data: ActionFormData;
  index: number;
}) => {
  switch (data.name) {
    case 'withdraw_assets':
      return (
        <ViewWithdraw data={data as ActionWithdrawFormData} index={index} />
      );
    case 'mint_tokens':
      return (
        <ViewMintToken data={data as ActionMintTokenFormData} index={index} />
      );
    default:
      return (
        <ActionCard
          title="Invalid Action"
          description="Your proposal contains an action that is invalid"
          index={index}
        />
      );
  }
};

/**
 * ActionCard for viewing Withdraw actions
 */
const ViewWithdraw = ({
  data,
  index,
}: {
  data: ActionWithdrawFormData;
  index: number;
}) => {
  return (
    <ActionCard
      title="Withdraw assets"
      description="The Recipient will withdraw funds from the DAO treasury"
      index={index}
    >
      <div className="grid grid-cols-2">
        <h4>Recipient</h4>
        <Address
          address={data.recipient}
          maxLength={AddressLength.Full}
          hasLink={true}
          showCopy={true}
        />
        <h4>Amount</h4>
        <h4>{data.amount}</h4>
        <h4>Token Address</h4>
        <Address
          address={data.tokenAddress}
          maxLength={AddressLength.Small}
          hasLink={true}
          showCopy={true}
        />
      </div>
    </ActionCard>
  );
};

/**
 * ActionCard for viewing MintToken actions
 */
const ViewMintToken = ({
  data,
  index,
}: {
  data: ActionMintTokenFormData;
  index: number;
}) => (
  <ActionCard
    title="Mint tokens"
    description="Create a proposal to mint more governance tokens. Select the wallets that should receive tokens and determine how many."
    index={index}
  >
    <div className="grid grid-cols-2 gap-2">
      <h3 className="mt-2 text-lg font-semibold">Recipient</h3>
      <h3 className="mt-2 text-lg font-semibold">amount</h3>
      {data.wallets.map((item, index2) => (
        <div key={index2} className="col-span-2 grid grid-cols-2">
          <Address
            address={item.address}
            maxLength={AddressLength.Large}
            hasLink={true}
            showCopy={true}
          />
          <h3 className="text-lg">{item.amount}</h3>
        </div>
      ))}
    </div>
  </ActionCard>
);

interface ActionCardProps extends React.HTMLAttributes<typeof Card> {
  title: string;
  description: string;
  index: number;
}

/**
 * A wrapping card for actions.
 */
const ActionCard = ({
  title,
  description,
  index,
  children,
  ...props
}: ActionCardProps) => (
  <Card key={index}>
    <h2 className="py-2 text-2xl font-bold">{title}</h2>
    <h3 className="py-2 text-xl">{description}</h3>
    <Hbar />
    {children}
  </Card>
);

/**
 * A horizontal bar for breaking up content
 */
const Hbar = () => (
  <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
);
