/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { ProposalFormVotingSettings } from '@/src/components/newProposal/steps/Voting';
import ProposalActions from '@/src/components/proposal/ProposalActions';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import CategoryList from '@/src/components/ui/CategoryList';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { MainCard } from '@/src/components/ui/MainCard';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import {
  useBurnVotingProposalCreationCost,
  usePartialVotingProposalMinDuration,
} from '@/src/hooks/useFacetFetch';
import { toast } from '@/src/hooks/useToast';
import { useVotingPower } from '@/src/hooks/useVotingPower';
import { ACTIONS, ProposalFormActionData } from '@/src/lib/constants/actions';
import { TOKENS } from '@/src/lib/constants/tokens';
import { anyNullOrUndefined } from '@/src/lib/utils';
import { getTimeInxMinutesAsDate, inputToDate } from '@/src/lib/utils/date';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { add, format } from 'date-fns';
import DOMPurify from 'dompurify';
import { useForm } from 'react-hook-form';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router';
import { useAccount } from 'wagmi';

import Loading from '../../icons/Loading';
import {
  ConnectWalletWarning,
  InsufficientRepWarning,
  Warning,
} from '../../ui/ConditionalButton';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import TokenAmount from '../../ui/TokenAmount';

/**
 * Converts actions in their input form to Action objects, to be used to view proposals and sending proposal to SDK.
 * @param actions List of actions in their input form
 * @returns A list of corresponding Action objects
 */
const parseActionInputs = async (
  actions: ProposalFormActionData[]
): Promise<Action[]> => {
  const res: Action[] = [];
  const parsed = await Promise.all(
    actions.map((action) => ACTIONS[action.name].parseInput(action as any))
  );
  parsed.forEach((action) => action && res.push(action));

  return res;
};

/**
 * Convert the proposal voting settings form input to a start date.
 * @param settings Proposal voting settings form input
 * @returns The start date of the proposal as a Date object
 */
const parseStartDate = (settings: ProposalFormVotingSettings): Date => {
  if (settings.start_time_type === 'now') {
    const res = new Date();
    res.setTime(0);
    return res;
  } else
    return inputToDate(
      settings!.custom_start_date!,
      settings!.custom_start_time!,
      settings!.custom_start_timezone!
    );
};

/**
 * Convert the proposal voting settings form input to a end date.
 * Will add extra time if proposal start is now
 * @param settings Proposal voting settings form input
 * @returns The end of the proposal as a Date object
 */
const parseEndDate = (settings: ProposalFormVotingSettings): Date => {
  return settings.end_time_type === 'end-custom'
    ? inputToDate(
        settings!.custom_end_date!,
        settings!.custom_end_time!,
        settings!.custom_end_timezone!
      )
    : add(new Date(), {
        minutes: settings!.duration_minutes!,
        hours: settings!.duration_hours!,
        days: settings!.duration_days!,
      });
};

const addBufferToEnd = (
  start: Date,
  end: Date,
  settings: ProposalFormVotingSettings,
  minDuration: number | null
) => {
  if (settings.start_time_type === 'now' && minDuration !== null) {
    const duration = (end.getTime() - start.getTime()) / 1000;
    // duration is less than the min duration (with a 60 second extra buffer), add 3 minutes to the end duration.
    if (duration <= minDuration + 60) {
      return add(end, { minutes: 3 });
    }
  }
  return end;
};

export const Confirmation = () => {
  const { dataStep1, dataStep2, dataStep3 } = useNewProposalFormContext();
  const [actions, setActions] = useState<Action[]>([]);
  const { client } = useDiamondSDKContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //retrieve settings for the minDuration
  const { data: minDurationBN } = usePartialVotingProposalMinDuration();
  const minDuration = minDurationBN?.toNumber() ?? null;

  const { address, isConnected } = useAccount();
  const { votingPower, loading: votingPowerLoading } = useVotingPower({
    address: address,
  });

  const {
    data: proposalCreationCost,
    loading: proposalCreationCostLoading,
    error: proposalCreationCostError,
  } = useBurnVotingProposalCreationCost();

  // Maps the action form iputs to Action interface
  useEffect(() => {
    if (dataStep3)
      parseActionInputs(dataStep3.actions).then((res) => setActions(res));
  }, [dataStep3]);

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

  const onSubmitSend = async () => {
    if (!client)
      return toast.error({
        title: 'Error submitting proposal',
        description: 'SDK client not found',
      });

    if (!dataStep1 || !dataStep2 || !dataStep3)
      return toast.error({
        title: 'Error submitting proposal',
        description: 'Some data appears to be missing',
      });

    const parsedActions = await parseActionInputs(dataStep3.actions);

    const start = parseStartDate(dataStep2);
    const endRaw = parseEndDate(dataStep2);
    const end = addBufferToEnd(start, endRaw, dataStep2, minDuration);

    // Send proposal to SDK
    setIsSubmitting(true);
    toast.contractTransaction(
      () =>
        client.sugar.CreateProposal(
          {
            ...dataStep1,
            resources: dataStep1.resources.filter((res) => res.url !== ''),
          },
          parsedActions,
          start,
          end
        ),
      {
        error: 'Error creating proposal',
        success: 'Proposal created!',
        onSuccess: async (receipt) => {
          // Fetch ID of created proposal to send user to that page
          const id = await client.sugar.GetProposalId(receipt);
          // Send user to proposals page
          navigate(`/governance/proposals/${id}`);
        },
        onFinish: () => setIsSubmitting(false),
      }
    );
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
      let minStart = getTimeInxMinutesAsDate(3);
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

    //No issues, is valid
    return true;
  };

  const onSubmit = async () => {
    const valid = onSubmitValidate();
    if (isValid && valid) {
      onSubmitSend();
    }
  };

  // Sanitize the HTML of the body
  const cleanedBody = DOMPurify.sanitize(dataStep1?.body ?? '<p></p>');

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
            {dataStep1?.description ?? 'No description'}{' '}
          </p>
          {/* Note that since our HTML is sanitized, this dangerous action is safe */}
          {dataStep1?.body !== '<p></p>' && (
            <div
              className="styled-editor-content"
              dangerouslySetInnerHTML={{ __html: cleanedBody }}
            />
          )}
        </HeaderCard>

        <div className="flex flex-col gap-y-4">
          <ProposalResources
            variant="outline"
            resources={
              dataStep1?.resources.filter((res) => res.url !== '') ?? []
            }
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
      <ErrorWrapper
        className="flex gap-x-2 flex-row items-center"
        name="submit"
        error={errors?.root?.step4error as any}
      >
        <StepNavigator
          isSubmitting={isSubmitting}
          nextStepConditions={[
            {
              when: !isConnected,
              content: <ConnectWalletWarning action="to submit" />,
            },
            {
              when: votingPowerLoading || proposalCreationCostLoading,
              content: <Loading className="w-5 h-5" />,
            },
            {
              when: proposalCreationCostError !== null,
              content: (
                <Warning>
                  Can not determine if you may create a proposal
                </Warning>
              ),
            },
            {
              when:
                proposalCreationCost !== null &&
                votingPower.lt(proposalCreationCost),
              content: <InsufficientRepWarning action="to create proposal" />,
            },
          ]}
        />
        {isConnected &&
          proposalCreationCost !== null &&
          votingPower.gte(proposalCreationCost) && (
            <p>
              Creating a proposal costs{' '}
              <TokenAmount
                amount={proposalCreationCost}
                symbol={TOKENS.rep.symbol}
                tokenDecimals={TOKENS.rep.decimals}
              />
            </p>
          )}
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
