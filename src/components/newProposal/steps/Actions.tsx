/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useState } from 'react';
import Loading from '@/src/components/icons/Loading';
import { Button } from '@/src/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { Label } from '@/src/components/ui/Label';
import { ACTIONS, ProposalFormActionData } from '@/src/lib/constants/actions';
import { CONFIG } from '@/src/lib/constants/config';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import {
  FieldError,
  FieldErrors,
  FieldValues,
  FormProvider,
  Merge,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { HiPlus } from 'react-icons/hi2';

export type ActionFormContextData = {
  index: number;
  prefix: `actions.${number}`;
  onRemove: () => void;
};
export const ActionFormContext = createContext<ActionFormContextData>(null!);

export interface ProposalFormActions {
  actions: ProposalFormActionData[];
}

export const Actions = () => {
  const { setStep, dataStep3, setDataStep3 } = useNewProposalFormContext();

  const methods = useForm<ProposalFormActions>({ defaultValues: dataStep3 });

  const { fields, append, remove } = useFieldArray<ProposalFormActions>({
    name: 'actions',
    control: methods.control,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ProposalFormActions) => {
    setIsLoading(true);

    // Loop over every action
    const actionPromises = data.actions.map(async (action, index) => {
      // If it's the merge action, fetch the latest commit hash
      if (action.name === 'merge_pr') {
        try {
          // Fetch (encrypted) commit hash from the pr-merger server
          const res = await fetch(
            `${CONFIG.PR_MERGER_API_URL}/latestCommit?url=${action.url}`
          );

          const json = await res.json();

          // Validate response
          if (json.status !== 'ok' || json.data?.sha == null) {
            throw new Error('Could not fetch latest commit hash');
          }

          // Return new action object with latest commit hash
          return {
            ...action,
            sha: json.data.sha,
          };
        } catch (error) {
          console.error(error);

          // If it fails, show error message under appropriate field and throw error
          methods.setError(`actions.${index}.url`, {
            type: 'manual',
            message: 'Could not fetch latest commit hash',
          });

          throw error;
        }
      }
    });

    Promise.all(actionPromises)
      .then(() => {
        // If everything went OK, go to next step
        setDataStep3(data);
        setStep(4);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleBack = () => {
    const data = methods.getValues();
    setDataStep3(data);
  };

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="space-y-2">
        <div className="flex flex-col gap-y-1">
          <Label tooltip="These actions can be executed after a vote successfully passes">
            Actions
          </Label>
          {fields.length === 0 ? (
            <p className="italic text-highlight-foreground/80">No actions</p>
          ) : (
            <>
              {/* List of proposal actions */}
              <FormProvider {...methods}>
                <div className="flex flex-col gap-6">
                  {fields.map((field: Record<'id', string>, index: number) => {
                    const prefix: `actions.${number}` = `actions.${index}`;
                    const context: ActionFormContextData = {
                      prefix: prefix,
                      index: index,
                      onRemove: () => remove(index),
                    };
                    const action: ProposalFormActionData =
                      methods.getValues(prefix);
                    const { input: ActionInput } = ACTIONS[action.name];

                    //This should not happen
                    if (ActionInput === null) {
                      console.error(
                        'Action to be rendered does not have an action input'
                      );
                      return <></>;
                    }

                    return (
                      <ActionFormContext.Provider value={context} key={index}>
                        <ActionInput />
                      </ActionFormContext.Provider>
                    );
                  })}
                </div>
              </FormProvider>
            </>
          )}
        </div>
        <AddActionButton append={append} actions={methods.getValues()} />
      </div>
      <StepNavigator
        onBack={handleBack}
        nextStepConditions={[
          {
            when: isLoading,
            content: <Loading className="h-5 w-5 shrink-0" />,
          },
        ]}
      />
    </form>
  );
};

export type ActionFormError<T extends FieldValues> =
  | Merge<FieldError, FieldErrors<NonNullable<T> | T>>
  | undefined;

/**
 * @param append function that is called with ActionFormData to be appended to some parent-like component.
 * @returns A dropdown component to add proposal action input cards
 */
export const AddActionButton = ({
  append,
  actions,
}: {
  // eslint-disable-next-line no-unused-vars
  append: (fn: ProposalFormActionData) => void;
  actions: ProposalFormActions;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" icon={HiPlus} label="Add action" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {Object.entries(ACTIONS)
            .filter(
              // eslint-disable-next-line no-unused-vars
              ([name, action]) =>
                action.input !== null && action.emptyInputData !== null
            )
            .map(([name, action], i) => (
              <DropdownMenuItem
                key={i}
                onClick={() =>
                  // action.emptyInputData will never be null here due to filter above
                  append(
                    action.emptyInputData ??
                      ({} as unknown as ProposalFormActionData)
                  )
                }
                className="gap-x-2 hover:cursor-pointer"
                disabled={
                  !actions ||
                  (action.maxPerProposal !== undefined &&
                    actions.actions &&
                    actions.actions.filter((x) => x.name === name).length >=
                      action.maxPerProposal) ||
                  // There's a limit of 256 actions per proposals
                  // This is because AragonOSx uses a uint256 to store a failure map
                  // for actions, and each bit represents an action (so max 256 actions)
                  (actions.actions && actions.actions.length >= 256)
                }
              >
                <action.icon className="h-5 w-5 shrink-0" />
                <span>{action.longLabel}</span>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
