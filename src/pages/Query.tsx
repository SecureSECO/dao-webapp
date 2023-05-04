/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useForm } from 'react-hook-form';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { Label } from '@/src/components/ui/Label';
import { useSearchSECO } from '@/src/hooks/useSearchSECO';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  HiOutlineCodeBracketSquare,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentMagnifyingGlass,
} from 'react-icons/hi2';
import { UrlPattern } from '@/src/lib/patterns';
import { promise } from '@/src/hooks/useToast';

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
  const { queryResult, runQuery } = useSearchSECO({});

  const onSubmit = async (data: QueryFormData) => {
    console.log('Valid URL:', data.searchUrl);

    promise(runQuery(data.searchUrl, data.token), {
      loading: 'Querying SearchSECO database...',
      success: 'Query successful!',
      error: (err) => ({
        title: err,
        description: '',
      }),
    });
  };

  return (
    <div className="space-y-6">
      <HeaderCard title="SearchSECO" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-6">
          <MainCard header="Query" icon={HiOutlineDocumentMagnifyingGlass}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="space-y-1">
                <Label
                  htmlFor="searchUrl"
                  tooltip="Github URL to the repository to query the SearchSECO database for"
                >
                  Github URL
                </Label>
                <ErrorWrapper name="URL" error={errors.searchUrl}>
                  <Input
                    {...register('searchUrl', {
                      required: true,
                      pattern: {
                        value: UrlPattern,
                        message: 'Invalid URL',
                      },
                    })}
                    type="text"
                    placeholder="https://github.com/..."
                    id="searchUrl"
                    aria-invalid={errors.searchUrl ? 'true' : 'false'}
                    error={errors.searchUrl}
                  />
                </ErrorWrapper>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="token"
                  tooltip="Your Github access token will be used to download the repository to know what to fetch from the SearchSECO database. Only read access is required for the access token."
                >
                  Github access token
                </Label>
                <ErrorWrapper name="Token" error={errors.token}>
                  <Input
                    {...register('token', {
                      required: true,
                      pattern: {
                        value: /^[\w\d-]+$/, //placeholder
                        message: 'Invalid token',
                      },
                    })}
                    type="text"
                    placeholder="Your Github token"
                    id="token"
                    aria-invalid={errors.token ? 'true' : 'false'}
                    error={errors.token}
                  />
                </ErrorWrapper>
              </div>
              <Button type="submit" className="">
                Submit
              </Button>
            </form>
          </MainCard>
          <MainCard header="Result" icon={HiOutlineCodeBracketSquare}>
            {queryResult ? (
              <pre>{JSON.stringify(queryResult, null, 2)}</pre>
            ) : (
              <p className="text-base font-normal italic text-highlight-foreground/80">
                Query results will be displayed here
              </p>
            )}
          </MainCard>
        </div>
        <MainCard header="Rewards" icon={HiOutlineCurrencyDollar}>
          <p className="text-base font-normal italic text-highlight-foreground/80">
            This card will be used for claiming rewards
          </p>
        </MainCard>
      </div>
    </div>
  );
};

export default Query;
