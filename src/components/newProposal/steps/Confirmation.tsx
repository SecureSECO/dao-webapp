/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ProposalFormAction } from '@/src/components/newProposal/steps/Actions';
import { ProposalFormVotingSettings } from '@/src/components/newProposal/steps/Voting';
import ProposalActions, {
  IProposalAction,
} from '@/src/components/proposal/ProposalActions';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { MainCard } from '@/src/components/ui/MainCard';
import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { useToast } from '@/src/hooks/useToast';
import { getTimeInxMinutesAsDate, inputToDate } from '@/src/lib/date-utils';
import { anyNullOrUndefined } from '@/src/lib/utils';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { add, format } from 'date-fns';
import DOMPurify from 'dompurify';
import { useForm } from 'react-hook-form';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import CategoryList from '@/src/components/ui/CategoryList';

export const Confirmation = () => {
  const { dataStep1, dataStep2, dataStep3 } = useNewProposalFormContext();

  const { votingClient, votingPluginAddress } = useAragonSDKContext();
  const { toast } = useToast();

  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    defaultValues: {
      step1: dataStep1,
      step2: dataStep2,
      step3: dataStep3,
      step4: { startTimevalidation: '' },
    },
  });

  const onSubmitSend = async (data: any) => {
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

  /**
   * Checks if the form is valid and displays a dialog to fix invalidities if needed.
   * @returns true if form is valid, false otherwise
   * */
  const onSubmitValidate = (): Boolean => {
    // All step data needs to be defined
    if (anyNullOrUndefined(dataStep1, dataStep2, dataStep3)) {
      setError('root.step4error', {
        type: 'custom',
        message: 'Some data appears to be missing, please enter all steps',
      });
      return false;
    }

    //If step2 start time is custom, it must be in the future.
    if (dataStep2!.start_time_type === 'custom') {
      let start = inputToDate(
        dataStep2!.custom_start_date!,
        dataStep2!.custom_start_time!,
        dataStep2!.custom_start_timezone!
      );
      let minStart = getTimeInxMinutesAsDate(5);
      // If the start is past our minStart (less or equal), there is a proplem
      if (start <= minStart) {
        setError('root.step4error', {
          type: 'custom',
          message:
            'The proposal start time must be in the future at the moment of execution',
        });
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (data: any) => {
    const valid = onSubmitValidate();
    if (isValid && valid) {
      onSubmitSend(data);
    }
  };

  // Map the actions to the IProposalAction interface
  const actions: IProposalAction[] = dataStep3
    ? dataStep3?.actions.map((action: ProposalFormAction) => {
        switch (action.name) {
          case 'withdraw_assets':
            return {
              method: 'withdraw',
              interface: 'IWithdraw',
              params: {
                to: action.recipient,
                amount: action.amount,
                tokenAddress: action.tokenAddress,
              },
            };
          case 'mint_tokens':
            return {
              method: 'mint',
              interface: 'IMint',
              params: {
                to: action.wallets.map((wallet) => {
                  return {
                    to: wallet.address,
                    amount: wallet.amount,
                    tokenId: 0,
                  };
                }),
              },
            };
          case 'merge_pr':
            return {
              method: 'merge',
              interface: 'IMerge', // FIXME: This is not the correct interface
              params: {
                url: action.inputs.url,
              },
            };
          case 'change_parameter':
            return{
            method: 'change',
            interface: 'IChange', //FIXME: This is not the correct interface
            params: {
              plugin: action.plugin,
              parameter: action.parameter,
              value: action.value,
            }

          }
          default:
            return {
              method: '',
              interface: '',
              params: {},
            };
        }
      })
    : [];

  // Sanitize the HTML of the body
  const htmlClean = DOMPurify.sanitize(
    dataStep1?.description ?? '<p>Proposal has no body</p>'
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* View proposal details */}
        <HeaderCard
          variant="outline"
          title={dataStep1?.title ?? 'No title'}
          className="md:col-span-2"
        >
          <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
            {dataStep1?.summary ?? 'No summary'}{' '}
          </p>
          {/* Note that since our HTML is sanitized, this dangerous action is safe */}
          {dataStep1?.description !== '<p></p>' && (
            <div
              className="styled-editor-content"
              dangerouslySetInnerHTML={{ __html: htmlClean }}
            />
          )}
        </HeaderCard>

        <div className="flex flex-col gap-y-4">
          <ProposalResources
            variant="outline"
            resources={dataStep1?.resources ?? []}
          />

          {/* View actions */}
          <ProposalActions variant="outline" actions={actions} />
        </div>

        {/* View voting settings */}
        <MainCard
          icon={HiChatBubbleLeftRight}
          variant="outline"
          header="Voting settings"
        >
          {!dataStep2 ? (
            <p className="italic text-highlight-foreground/80">
              No data available
            </p>
          ) : (
            <CategoryList categories={getCategories(dataStep2)} />
          )}
        </MainCard>
      </div>
      <ErrorWrapper name="submit" error={errors?.root?.step4error as any}>
        <StepNavigator />
      </ErrorWrapper>
    </form>
  );
};

/**
 * Gets data to be used to render by ViewStepTwo. The data summerizes the voting options and timing.
 * @param data The StepTwoData
 * @returns A JSON object for summarizing step two data
 */
const getCategories = (data: ProposalFormVotingSettings) => {
  // Convert start date to correct string
  let startDate;
  if (data.start_time_type === 'now') startDate = 'now';
  else
    startDate =
      !data.custom_start_date ||
      !data.custom_start_time ||
      !data.custom_start_timezone
        ? 'N/A'
        : format(
            inputToDate(
              data.custom_start_date,
              data.custom_start_time,
              data.custom_start_timezone
            ),
            'Pp'
          );

  // Convert end time to correct string
  let endDate;
  if (data.end_time_type == 'end-custom')
    endDate =
      !data.custom_end_date ||
      !data.custom_end_time ||
      !data.custom_end_timezone
        ? 'N/A'
        : format(
            inputToDate(
              data.custom_end_date,
              data.custom_end_time,
              data.custom_end_timezone
            ),
            'Pp'
          );
  else {
    const now = new Date();
    const duration = {
      days: data.duration_days,
      hours: data.duration_hours,
      minutes: data.duration_minutes,
    };
    endDate = format(add(now, duration), 'Pp');
  }

  return [
    {
      title: 'Decision rules',
      items: [
        {
          label: 'Voting Option',
          value: data.option,
        },
      ],
    },
    {
      title: 'Voting Period',
      items: [
        {
          label: 'Start',
          value: startDate,
        },
        {
          label: 'End',
          value: endDate,
        },
      ],
    },
  ];
};
