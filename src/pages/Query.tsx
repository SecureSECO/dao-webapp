/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/src/components/ui/Card';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { Label } from '@/src/components/ui/Label';

interface QueryFormData {
  searchUrl: string;
}

const Query = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryFormData>();

  const onSubmit = (data: QueryFormData) => {
    console.log('Valid URL:', data.searchUrl);
    // Logic
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <HeaderCard
          title="SearchSECO"
        />
      </div>
      <div className="gap-4 md:grid md:grid-cols-2">
        <Card className="my-6">
          <h2 className="text-xl font-bold">Query the SearchSECO database</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="searchUrl">Enter a valid URL</Label>
              <ErrorWrapper name="URL" error={errors.searchUrl}>
                <Input
                  {...register('searchUrl', {
                    required: true,
                    pattern: {
                      value: /^(https?:\/\/)(\w+:{0,1}\w*@)?([\w.-]+\.[a-zA-Z]{2,6}|[\d.]+)(:[0-9]{1,5})?(\/.*)?$/,
                      message: 'Invalid URL',
                    },
                  })}
                  type="text"
                  placeholder="Enter a valid URL"
                  id="searchUrl"
                  className="..."
                  aria-invalid={errors.searchUrl ? 'true' : 'false'}
                  error={errors.searchUrl}
                />
              </ErrorWrapper>
            </div>
            <Button type="submit" className="...">
              Submit
            </Button>
          </form>
        </Card>
        <Card className="my-6">
          <h2 className="text-xl font-bold">Rewards</h2>
          <p className="text-base font-normal">This card will be used for claiming rewards</p>
        </Card>
      </div>
    </div>
  );
};

export default Query;