/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NumberPattern } from '@/src/lib/patterns';
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
  FieldError,
  Controller,
  UseFormRegister,
  useWatch,
} from 'react-hook-form';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { isNullOrUndefined } from '@/src/lib/utils';
import { Input } from '@/src/components/ui/Input';

type Validator = {
  validate?: (param: Parameter) => undefined | string;
  pattern?: RegExp;
};

type Parameter = {
  param: string;
  validator?: Validator;
};

type Plugin = {
  plugin: string;
  parameters: Parameter[];
};

const numberValidator: Validator = {
  pattern: NumberPattern,
};

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
          param: 'Plugin 2 param 1',
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
  errors,
  prefix,
}: {
  control: Control<any, any>;
  register: UseFormRegister<any>;
  errors?: FieldError;
  prefix: string;
}) => {
  // react-hook-form input names
  const name_plugin = `${prefix}.plugin`;
  const name_param = `${prefix}.param`;
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
    <div>
      <div className="w-full">
        <Controller
          control={control}
          name={name_plugin}
          render={({ field: { onChange, name, value } }) => (
            <Select defaultValue={value} onValueChange={onChange} name={name}>
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
      </div>
      <div className="w-full">
        <Controller
          control={control}
          name={name_param}
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
      </div>
      <div className="w-full">
        <Input
          {...register(name_value, {
            required: true,
            // TODO: Validation logic
            // pattern: {
            //   value: AddressPattern,
            //   message:
            //     'Please enter an address starting with 0x, followed by 40 address characters',
            // },
            // // Custom validation function to prevent duplicate addresses
            // validate: (value: string) => {
            //   let anyDuplicates = someUntil(
            //     getValues(walletsPrefix),
            //     (a) => a.address === value,
            //     index
            //   );
            //   return !anyDuplicates || 'Duplicate address';
            // },
          })}
          type="text"
          id="parameterValue"
          disabled={isNullOrUndefined(watchParam)}
          // error={errors?.address}
          // className="w-full basis-2/5"
          // placeholder="0x..."
        />
      </div>
    </div>
  );
};
