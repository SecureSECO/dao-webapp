/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useNewProposalFormContext } from '@/src/pages/NewProposal';
import { StepOneMetadata } from './newProposalData';
import { HeaderCard } from '../ui/HeaderCard';
import { ViewStepOne } from './viewProposal/ViewStepOne';

export const StepFour = () => {
  const { setStep, dataStep1, dataStep2, dataStep3 } =
    useNewProposalFormContext();

  return (
    <div>
      <ViewStepOne data={dataStep1} />;{/* <ViewStepTwo data={dataStep2} /> */}
    </div>
  );
};
