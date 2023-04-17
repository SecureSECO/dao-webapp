/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { ViewStepOne } from './viewProposal/ViewStepOne';
import { ViewStepTwo } from './viewProposal/ViewStepTwo';
import { ViewStepThree } from './viewProposal/ViewStepThree';
import { useForm } from 'react-hook-form';
import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { contractInteraction, useToast } from '@/src/hooks/useToast';
import {
  CreateMajorityVotingProposalParams,
  ProposalCreationStepValue,
  ProposalCreationSteps,
} from '@aragon/sdk-client';
import { getChainDataByChainId } from '@/src/lib/constants/chains';

type test = CreateMajorityVotingProposalParams;

export const StepFour = () => {
  const { dataStep1, dataStep2, dataStep3 } = useNewProposalFormContext();
  const { votingClient, votingPluginAddress } = useAragonSDKContext();
  const { toast } = useToast();

  const { handleSubmit } = useForm({
    defaultValues: { step1: dataStep1, step2: dataStep2, step3: dataStep3 },
  });

  const onSubmit = async (data: any) => {
    console.log(data);

    if (!votingClient || !votingPluginAddress)
      return toast({
        title: 'Error submitting proposal',
        description: 'Voting client not found',
        variant: 'error',
      });
    // contractInteraction<ProposalCreationSteps, ProposalCreationStepValue>(
    //   () =>
    //     votingClient.methods.createProposal({
    //       pluginAddress: votingPluginAddress,
    //       actions: dataStep3?.actions ?? [],
    //     }),
    //   {
    //     steps: {
    //       confirmed: ProposalCreationSteps.DONE,
    //       signed: ProposalCreationSteps.CREATING,
    //     },
    //     messages: {
    //       error: 'Error creating proposal',
    //       success: 'Proposal created!',
    //     },
    //     onFinish: () => {
    //       // Send user to proposal page
    //     },
    //   }
    // );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ViewStepOne data={dataStep1} />
      <ViewStepTwo data={dataStep2} />
      <ViewStepThree data={dataStep3} />
      <StepNavigator />
    </form>
  );
};
