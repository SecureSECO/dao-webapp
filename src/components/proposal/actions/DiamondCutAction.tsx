/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { ACTIONS } from '@/src/lib/constants/actions';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { Action } from '@secureseco-dao/diamond-governance-sdk';
import { BytesLike } from 'ethers';

export enum FacetCutAction {
  Add,
  Replace,
  Remove,
  AddWithInit,
  RemoveWithDeinit,
}

interface FacetCutStruct {
  facetAddress: string;
  action: FacetCutAction;
  functionSelectors: BytesLike[];
  initCalldata: BytesLike;
}

export interface ProposalDiamondCutAction extends Action {
  params: {
    _diamondCut: FacetCutStruct[];
  };
}
interface DiamondCutActionProps extends AccordionItemProps {
  action: ProposalDiamondCutAction;
}

export const DiamondCutAction = ({
  action,
  ...props
}: DiamondCutActionProps) => {
  return (
    <ActionWrapper
      icon={ACTIONS.diamond_cut.icon}
      title="Diamond cut"
      description={`
        Add, replace or remove the following facets of the diamond (based on their addresses).
        This is an advanced action. The proposal creator must provide adequate
        information on how to inspect this diamond cut, and if they do not, you are advised to vote against this
        proposal.
      `}
      {...props}
    >
      <div className="space-y-2 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {action.params._diamondCut.map((x, index) => (
            <Card variant="outline" size="sm" key={index + 1}>
              <p className="text-xs text-popover-foreground/80">
                {FacetCutAction[x.action]}
              </p>
              <Address className="font-medium" address={x.facetAddress} />
            </Card>
          ))}
        </div>
      </div>
    </ActionWrapper>
  );
};
