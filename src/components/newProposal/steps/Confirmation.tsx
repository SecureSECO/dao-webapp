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
import DOMPurify from 'dompurify';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import { add, format } from 'date-fns';
import { MainCard } from '@/src/components/ui/MainCard';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import ProposalActions, {
  IProposalAction,
} from '@/src/components/proposal/ProposalActions';
import { inputToDate } from '@/src/lib/date-utils';
import { ProposalFormAction } from '@/src/components/newProposal/steps/Actions';
import { ProposalFormVotingSettings } from '@/src/components/newProposal/steps/Voting';

export const Confirmation = () => {
  const { dataStep1, dataStep2, dataStep3 } = useNewProposalFormContext();

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
                    tokenAddress: import.meta.env.VITE_REP_CONTRACT,
                  };
                }),
              },
            };
          case 'merge_pr':
            return {
              method: 'mergePullRequest',
              interface: 'IMerge', // FIXME: This is not the correct interface
              params: {
                owner: action.inputs.owner,
                repo: action.inputs.repo,
                pull_number: action.inputs.pull_number,
              },
            };
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
    dataStep1?.description ?? '<p>Proposal has no description </p>'
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* View proposal details */}
        <HeaderCard
          variant="outline"
          title={dataStep1?.title ?? 'No title'}
          className="md:col-span-2"
        >
          <p className="text-lg font-medium leading-5 text-slate-500 dark:text-slate-400">
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
            <p>No data available</p>
          ) : (
            <>
              {getCategories(dataStep2).map((category) => (
                <div key={category.title}>
                  <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium dark:text-slate-300">
                      {category.title}
                    </p>
                    <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                  {category.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between gap-x-2"
                    >
                      <p className="text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-primary-300 dark:text-primary-400">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </MainCard>
      </div>
      <StepNavigator />
    </div>
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
