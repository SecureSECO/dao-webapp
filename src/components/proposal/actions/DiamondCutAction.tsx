/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import { ACTIONS } from '@/src/lib/constants/actions';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { BigNumberish, BytesLike } from 'ethers';

import ActionWrapper from './ActionWrapper';

interface FacetCutStruct {
  facetAddress: string;
  action: BigNumberish;
  functionSelectors: BytesLike[];
  initCalldata: BytesLike;
}

export interface ProposalFormDiamondCut {
  name: 'whitelist_member';
}

export const emptyProposalFormDiamondCut: ProposalFormDiamondCut = {
  name: 'whitelist_member',
};

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
      description="Add, replace or remove a facet of the diamond.

          This is an advanced action. The proposal creator must provide adequate
          information on how to inspect this diamond cut. If the creator does
          not provide adequate information, you are advised to vote against this
          proposal.
      "
      {...props}
    >
      <div className="space-y-2 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {action.params._diamondCut.map((x, index) => (
            <Card variant="outline" size="sm" key={index + 1}>
              <p className="text-xs text-popover-foreground/80">
                Facet address {index}
              </p>
              <p className="font-medium">{x.facetAddress}</p>
            </Card>
          ))}
        </div>
      </div>
    </ActionWrapper>
  );
};
