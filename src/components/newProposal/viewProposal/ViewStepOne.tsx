/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HeaderCard } from '../../ui/HeaderCard';
import { StepOneMetadata } from '../newProposalData';

export const ViewStepOne = ({
  data,
}: {
  data: StepOneMetadata | undefined;
}) => {
  return (
    <HeaderCard title={data?.title ?? 'Proposal has no title'}>
      <h3 className="text-xl">{data?.summary ?? 'Proposal has no summary'} </h3>
      <p className="text-lg">
        {data?.description ?? 'Proposal has no description'}{' '}
      </p>
    </HeaderCard>
  );
};
