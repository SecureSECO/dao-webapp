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
import { useSearchSECO } from '@/src/hooks/useSearchSECO';

interface QueryFormData {
  searchUrl: string;
  token: string;
}

const Query = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryFormData>();
  const [searchUrl, setSearchUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const searchSECO = useSearchSECO({ searchUrl, token });

  const onSubmit = async (data: QueryFormData) => {
    console.log('Valid URL:', data.searchUrl);
    setSearchUrl(data.searchUrl);
    setToken(data.token);
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <HeaderCard
          title="SearchSECO"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="token">Enter your Github token</Label>
                <ErrorWrapper name="Token" error={errors.token}>
                  <Input
                    {...register('token', {
                      required: true,
                      pattern: {
                        value: /^[\w\d-]+$/,  //placeholder
                        message: 'Invalid token',
                      },
                    })}
                    type="text"
                    placeholder="Enter your Github token"
                    id="token"
                    className="..."
                    aria-invalid={errors.token ? 'true' : 'false'}
                    error={errors.token}
                  />
                </ErrorWrapper>
              </div>
              <Button type="submit" className="...">
                Submit
              </Button>
            </form>
          </Card>
          <Card className="my-6">
            <h2 className="text-xl font-bold">Search Result</h2>
            {searchSECO.loading && <p>Loading...</p>}
            {searchSECO.error && <p>Error: {searchSECO.error}</p>}
            {searchSECO.result && (
              <pre>{JSON.stringify(searchSECO.result, null, 2)}</pre>
            )}
          </Card>
        </div>
        <Card className="my-6">
          <h2 className="text-xl font-bold">Rewards</h2>
          <p className="text-base font-normal">This card will be used for claiming rewards</p>
        </Card>
      </div>
    </div>
  );
};

export default Query;