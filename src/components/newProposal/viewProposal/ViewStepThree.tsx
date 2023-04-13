/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { jsNumberForAddress } from 'react-jazzicon';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
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
      <ul role="list" className="divide-y divide-gray-200">
        <li className="flex items-center py-4">
          <Jazzicon diameter={40} seed={jsNumberForAddress(data.recipient)} />
          <div className="ml-3">
            <p className="text-base font-medium text-gray-900">
              <span className="font-bold">Recipient:</span>
              <Address
                address={data.recipient}
                maxLength={AddressLength.Full}
                hasLink={true}
                showCopy={true}
              />
            </p>
            <p className="text-base font-medium text-gray-900">
              <span className="font-bold">Amount: </span>
              {data.amount}
            </p>
            <p className="text-base font-medium text-gray-900">
              <span className="font-bold">Token Address:</span>
              <Address
                address={data.tokenAddress}
                maxLength={AddressLength.Small}
                hasLink={true}
                showCopy={true}
              />
            </p>
          </div>
        </li>
      </ul>
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
    <ul role="list" className="divide-y divide-gray-200">
      {data.wallets.map((item, index) => (
        <li key={index} className="flex py-4">
          <Jazzicon diameter={40} seed={jsNumberForAddress(item.address)} />
          <div className="ml-3">
            <p className="text-base font-medium text-gray-900">
              <span className="font-bold">Amount: {item.amount} </span>
            </p>
            <Address
              address={item.address}
              maxLength={AddressLength.Large}
              hasLink={true}
              showCopy={true}
            />
          </div>
        </li>
      ))}
    </ul>
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
