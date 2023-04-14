/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HeaderCard } from '../../ui/HeaderCard';
import { StepOneMetadata } from '../newProposalData';
import DOMPurify from 'dompurify';
import { ProposalResources } from '../../proposal/ProposalResources';

export const ViewStepOne = ({
  data,
}: {
  data: StepOneMetadata | undefined;
}) => {
  const htmlClean = DOMPurify.sanitize(
    data?.description ?? '<p>Proposal has no description </p>'
  );

  return (
    <>
      <HeaderCard
        variant="light"
        title={data?.title ?? 'Proposal has no title'}
      >
        <h3 className="text-xl">
          {data?.summary ?? 'Proposal has no summary'}{' '}
        </h3>
        {/* Note that since our HTML is sanitized, this dangerous action is safe */}
        <div dangerouslySetInnerHTML={{ __html: htmlClean }} />
      </HeaderCard>
      <ProposalResources
        className="bg-slate-50 dark:bg-slate-700/50"
        resources={data?.resources ?? []}
      />
    </>
  );
};
