/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AddressPattern, NumberPattern } from '@/src/lib/patterns';
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectValue,
} from '@/src/components/ui/Select';
import {
  Control,
  Controller,
  UseFormRegister,
  useWatch,
} from 'react-hook-form';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { isNullOrUndefined } from '@/src/lib/utils';
import { Input } from '@/src/components/ui/Input';
import { MainCard } from '../../ui/MainCard';
import { HiCog, HiXMark } from 'react-icons/hi2';
import { Label } from '../../ui/Label';
import { ActionFormError } from '../steps/Actions';
import { Button } from '../../ui/Button';

export type ProposalFormChangeParameter = {
  name: 'change_parameter';
  plugin: string;
  parameter: string;
  value: string;
};

export const emptyChangeParameter: ProposalFormChangeParameter = {
  name: 'change_parameter',
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

/*
 * A function to apply a validator for a given value
 * @returns true if the value is valid,
 *    a string with an error message for the user if the value is invalid.
 * */
const applyValidator = (validator: Validator | undefined, value: string) => {
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

//Plugins and parameters:
//Note: this is the place to add new plugins/parameters
const PluginParameterOptions: { plugins: Plugin[] } = {
  plugins: [
    {
      plugin: 'ABC',
      parameters: [
        {
          param: 'ABC param 1',
          validator: numberValidator,
        },
        {
          param: 'ABC param 2',
          validator: numberValidator,
        },
      ],
    },
    {
      plugin: 'Plugin 2',
      parameters: [
        {
          param: 'Plugin 2 param 1 - address',
          validator: addressValidator,
        },
        {
          param: 'Plugin 2 param 2',
        },
      ],
    },
  ],
};

export const ChangeParametersInput = ({
  control,
  register,
  onRemove,
  errors,
  prefix,
}: {
  control: Control<any, any>;
  register: UseFormRegister<any>;
  onRemove: any;
  errors?: ActionFormError<ProposalFormChangeParameter>;
  prefix: `actions.${number}`;
}) => {
  // react-hook-form input names
  const name_plugin = `${prefix}.plugin`;
  const name_param = `${prefix}.parameter`;
  const name_value = `${prefix}.value`;

  //Watches
  const watchPluginText = useWatch({ control: control, name: name_plugin });
  const watchPlugin = PluginParameterOptions.plugins.find(
    (x) => x.plugin === watchPluginText
  );

  const watchParamText = useWatch({ control: control, name: name_param });
  const watchParam = watchPlugin?.parameters.find(
    (x) => x.param === watchParamText
  );

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
                      {PluginParameterOptions.plugins.map((plugin) => (
                        <SelectItem key={plugin.plugin} value={plugin.plugin}>
                          {plugin.plugin}
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
                      {watchPlugin?.parameters.map((param) => (
                        <SelectItem key={param.param} value={param.param}>
                          {param.param}
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
      <div className="flex flex-col gap-y-1">
        <div className="w-full">
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
                  const validator = watchParam?.validator;
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
      </div>
    </MainCard>
  );
};
