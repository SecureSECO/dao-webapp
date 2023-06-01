/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from 'react';
import { Input } from '@/src/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useDaoVariable } from '@/src/hooks/useDaoVariable';
import { useDaoVariables } from '@/src/hooks/useDaoVariables';
import { ProposalFormAction } from '@/src/lib/constants/actions';
import {
  AddressPattern,
  IntegerPattern,
  NumberPattern,
  SignedIntegerPattern,
} from '@/src/lib/constants/patterns';
import { isNullOrUndefined } from '@/src/lib/utils';
import { InterfaceVariables } from '@plopmenz/diamond-governance-sdk';
import { BigNumber } from 'ethers';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { HiCog, HiXMark } from 'react-icons/hi2';

import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { Label } from '../../ui/Label';
import { MainCard } from '../../ui/MainCard';
import {
  ActionFormContext,
  ActionFormError,
  ProposalFormActions,
} from '../steps/Actions';

export interface ProposalFormChangeParamData extends ProposalFormAction {
  plugin: string;
  parameter: string;
  value: string;
}

export const emptyChangeParamData: ProposalFormChangeParamData = {
  name: 'change_param',
  plugin: '',
  parameter: '',
  value: '',
};

// TYPES:
type Validator = {
  // Validation function, returns true if valid, string with error message if invalid
  validate?: (value: string) => true | string;
  // Regexp pattern to validate string value.
  pattern?: RegExp;
  // Message to display if pattern does not match
  message?: string;
};

type Parameter = {
  param: string;
  validator?: Validator;
};

type Plugin = {
  plugin: string;
  parameters: Parameter[];
};

// VALIDATORS:
// This is the place to add new validators

const numberValidator: Validator = {
  pattern: NumberPattern,
  message: 'The value should be a number, e.g.: 3.141',
};

const addressValidator: Validator = {
  pattern: AddressPattern,
  message: 'The value should be an address, starting with 0x',
};

const stringValidator: Validator = {
  validate: (x) => true,
  message: 'The value should be a string',
};

const createIntValidator = (type: string): Validator | null => {
  const isUnsigned = type.startsWith('uint');
  const pattern = isUnsigned ? IntegerPattern : SignedIntegerPattern;

  const sizeStart = isUnsigned ? 4 : 3;
  console.log(sizeStart, type, type.slice(sizeStart));
  const size = BigInt(type.slice(sizeStart));

  console.log(size);

  const maxValueShift = isUnsigned ? size : size - 1n;
  const maxValue = (1n << maxValueShift) - 1n;
  const minValue = isUnsigned ? 0n : -(1n << (size - 1n));

  console.log(maxValue, minValue);

  const message = `Value must be an integer (${type})`;

  const validate = (v: string) => {
    try {
      const value = BigInt(v);
      if (value < minValue) return `Value must be at least ${minValue}`;
      if (value > maxValue) return `Value may not be larger than ${maxValue}`;

      return true;
    } catch {
      return message;
    }
  };

  return { pattern, validate, message };
};

/*
 * A function to apply a validator for a given value
 * @returns true if the value is valid,
 *    a string with an error message for the user if the value is invalid.
 * */
const applyValidator = (
  validator: Validator | null | undefined,
  value: string
) => {
  // No validator, thus it is valid
  if (!validator) return true;

  const patternValid = validator.pattern?.test(value) ?? true;
  if (!patternValid) {
    return validator.message ?? 'Invalid input';
  }
  if (validator.validate) {
    return validator.validate(value);
  }
  // No validators, thus it is valid
  return true;
};

const getValidator = (type: string | null | undefined): Validator | null => {
  if (isNullOrUndefined(type)) return null;
  if (type === 'address') return addressValidator;
  if (type === 'string') return stringValidator;
  const intTypePattern = /^u?int\d+$/;
  if (intTypePattern.test(type)) return createIntValidator(type);
  return null;
};

export const ChangeParamInput = () => {
  const {
    register,
    formState: { errors: formErrors },
    control,
  } = useFormContext<ProposalFormActions>();

  const { prefix, index, onRemove } = useContext(ActionFormContext);

  const {
    loading: variablesLoading,
    error: variablesErrors,
    variables,
  } = useDaoVariables({});

  const errors: ActionFormError<ProposalFormChangeParamData> =
    formErrors.actions ? formErrors.actions[index] : undefined;

  // react-hook-form input names
  const name_plugin: `${typeof prefix}.plugin` = `${prefix}.plugin`;
  const name_param: `${typeof prefix}.parameter` = `${prefix}.parameter`;
  const name_value: `${typeof prefix}.value` = `${prefix}.value`;

  //Watches
  const watchPluginText = useWatch({ control: control, name: name_plugin });
  const watchPlugin = variables?.find(
    (x) => x.interfaceName === watchPluginText
  );

  const watchParamText = useWatch({ control: control, name: name_param });
  const watchParam = watchPlugin?.variables.find(
    (x) => x.variableName === watchParamText
  );

  // Retrieve value of selected plugin + param
  const {
    value: paramValue,
    loading: paramValueLoading,
    error: paramValueError,
  } = useDaoVariable({
    interfaceName: watchPlugin?.interfaceName,
    variableName: watchParam?.variableName,
  });

  return (
    <MainCard
      className="flex flex-col gap-4"
      header="Change plugin parameter"
      icon={HiCog}
      variant="light"
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      {variablesLoading && 'Retrieving plugins from DAO'}
      {variablesErrors && 'Could not retrieve plugins from DAO'}
      <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Plugin to change" htmlFor="amount">
            Plugin
          </Label>
          <ErrorWrapper name="Plugin" error={errors?.plugin}>
            <Controller
              control={control}
              name={name_plugin}
              rules={{ required: true }}
              render={({ field: { onChange, name, value } }) => (
                <Select
                  disabled={isNullOrUndefined(variables)}
                  defaultValue={value}
                  onValueChange={onChange}
                  name={name}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Plugin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Plugin</SelectLabel>
                      {variables?.map((plugin) => (
                        <SelectItem
                          key={plugin.interfaceName}
                          value={plugin.interfaceName}
                        >
                          {plugin.interfaceName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Plugin parameter to change" htmlFor="amount">
            Parameter
          </Label>
          <ErrorWrapper name="Parameter" error={errors?.parameter}>
            <Controller
              control={control}
              name={name_param}
              rules={{ required: true }}
              render={({ field: { onChange, name, value } }) => (
                <Select
                  disabled={isNullOrUndefined(watchPlugin)}
                  defaultValue={value}
                  onValueChange={onChange}
                  name={name}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Parameter</SelectLabel>
                      {watchPlugin?.variables
                        .filter((param) => param.changeable)
                        .map((param) => (
                          <SelectItem
                            key={param.variableName}
                            value={param.variableName}
                          >
                            {param.variableName}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </ErrorWrapper>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-x-2 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="recipient"
            tooltip="The value that the plugin parameter will be changed to"
          >
            Parameter value
          </Label>
          <ErrorWrapper name="Value" error={errors?.value}>
            <Input
              {...register(name_value, {
                required: true,
                //since registration happens only once,
                //we must use a validation function that can retrieve the current validator and apply it.
                validate: (v: string) => {
                  const type = watchParam?.variableType;
                  const validator = getValidator(type);
                  return applyValidator(validator, v);
                },
              })}
              type="text"
              id="parameterValue"
              disabled={isNullOrUndefined(watchParam)}
              error={errors?.value}
            />
          </ErrorWrapper>
        </div>
        {watchParam && (
          <div className="flex flex-row gap-x-2 pt-3">
            <Card variant="outline" size="sm">
              <p className="text-xs text-popover-foreground/80">
                Current value
              </p>
              <p className="font-medium">
                {paramValueLoading && 'Loading...'}
                {paramValueError && !paramValueLoading && 'N/A'}
                {!paramValueError &&
                  !paramValueLoading &&
                  paramValue?.toString()}
              </p>
            </Card>
            <Card variant="outline" size="sm">
              <p className="text-xs text-popover-foreground/80">Value type</p>
              <p className="font-medium">{watchParam?.variableType}</p>
            </Card>
          </div>
        )}
      </div>
    </MainCard>
  );
};
