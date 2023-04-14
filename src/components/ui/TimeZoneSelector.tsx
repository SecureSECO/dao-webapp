/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectValue,
} from './Select';
import { ErrorWrapper } from './ErrorWrapper';

export const TimezoneSelector = ({
  control,
  error,
  name,
  id,
}: {
  control: any;
  error?: FieldError;
  name: string;
  id?: string;
}) => (
  <ErrorWrapper name="Timezone" error={error} id={id}>
    <Controller
      control={control}
      name={name}
      defaultValue="UTC+0"
      render={({ field: { onChange, name } }) => (
        <Select onValueChange={onChange} name={name}>
          <SelectTrigger>
            <SelectValue placeholder="Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>UTC</SelectLabel>
              {Array.from({ length: 25 }, (_, i) => {
                const offset = i - 12;
                const value = `UTC${offset >= 0 ? `+${offset}` : offset}`;
                return (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  </ErrorWrapper>
);
