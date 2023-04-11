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

export const StepFour = () => {
  const { setStep, dataStep1, dataStep2, dataStep3 } =
    useNewProposalFormContext();

  return (
    <div className="flex flex-col gap-4">
      <ViewStepOne data={dataStep1} />
      <ViewStepTwo data={dataStep2} />
      <ViewStepThree data={dataStep3} />
      <StepNavigator />
    </div>
  );
};
