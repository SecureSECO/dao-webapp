/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import Loading from '@/src/components/icons/Loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/AlertDialog';
import { Button } from '@/src/components/ui/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import { Table } from '@/src/components/ui/Table';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { useSearchSECO } from '@/src/hooks/useSearchSECO';
import { UrlPattern } from '@/src/lib/constants/patterns';
import { TOKENS } from '@/src/lib/constants/tokens';
import { saveAs } from 'file-saver';
import { useForm } from 'react-hook-form';
import {
  HiArrowDownTray,
  HiOutlineCodeBracketSquare,
  HiOutlineDocumentMagnifyingGlass,
} from 'react-icons/hi2';
import { useAccount } from 'wagmi';
import { toast } from '@/src/hooks/useToast';

import {
  ConditionalButton,
  ConnectWalletWarning,
} from '../components/ui/ConditionalButton';

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
  const {
    queryResult,
    runQuery,
    startSession,
    hashes,
    cost,
    session,
    resetQuery,
    payForSession,
  } = useSearchSECO({
    useDummyData: false,
  });

  const { isConnected } = useAccount();
  const [isQuerying, setIsQuerying] = useState<boolean>(true);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const [storedToken, setStoredToken] = useLocalStorage<string>(
    'githubAccessToken',
    ''
  );

  const [paymentSent, setPaymentSent] = useState<boolean>(false);

  /**
   * Downloads the results of the query as a JSON file.
   */
  const downloadResults = () => {
    if (queryResult) {
      const data = new Blob([JSON.stringify(queryResult, null, 2)], {
        type: 'application/json',
      });
      saveAs(data, 'results.json');
    }
  };

  const onSubmit = async (data: QueryFormData) => {
    console.log('Valid URL:', data.searchUrl);

    setIsQuerying(false);

    toast.promise(
      runQuery(data.searchUrl, data.token)
        .then(() => {
          setStoredToken(data.token);
        })
        .finally(() => {
          setIsQuerying(true);
        }),
      {
        loading: 'Querying SearchSECO database...',
        success: 'Query successful!',
        error: () => ({
          title: 'Query failed',
        }),
      }
    );
  };

  return (
    <div className="space-y-6">
      <HeaderCard title="SearchSECO" />
      <div className="grid grid-cols-7 gap-6">
        <MainCard
          header="Query"
          className="col-span-full lg:col-span-3"
          icon={HiOutlineDocumentMagnifyingGlass}
          aside={<ExplanationButton />}
        >
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
                  defaultValue={storedToken}
                />
              </ErrorWrapper>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <ConditionalButton
                type="submit"
                disabled={!isQuerying}
                conditions={[
                  {
                    when: !isConnected,
                    content: (
                      <ConnectWalletWarning action="to query the database" />
                    ),
                  },
                ]}
                icon={isQuerying ? null : Loading}
              >
                Submit
              </ConditionalButton>
            </div>
          </form>
        </MainCard>
        <MainCard
          header="Result"
          className="col-span-full lg:col-span-4"
          icon={HiOutlineCodeBracketSquare}
        >
          {hashes.length > 0 && cost != null ? (
            <>
              <p>
                Number of hashes found: <strong>{hashes.length}</strong>
              </p>
              <p>
                Cost:{' '}
                <strong>
                  {cost} {TOKENS.secoin.symbol}
                </strong>
              </p>
              {session == null ? (
                <Button
                  onClick={async () => {
                    setIsPaying(true);

                    try {
                      const session = await startSession();
                      await payForSession(session);
                      setPaymentSent(true);
                    } catch (error: any) {
                      console.log(error);

                      toast.error({
                        title: error.message.substring(0, 100),
                      });

                      // Reset session
                      resetQuery();
                    }

                    setIsPaying(false);
                  }}
                  disabled={!isConnected || isPaying}
                  icon={isPaying ? Loading : null}
                >
                  Pay for hashes
                </Button>
              ) : (
                <>
                  {session.fetch_status === 'success' &&
                    queryResult &&
                    queryResult.methodData && (
                      <>
                        <Table
                          columns={[
                            { header: 'Hash', accessor: 'method_hash' },
                            { header: 'File Name', accessor: 'file' },
                            {
                              header: 'Function Name',
                              accessor: 'method_name',
                            },
                            { header: 'Line Number', accessor: 'lineNumber' },
                          ]}
                          data={queryResult.methodData}
                        />
                        <div className="flex items-center gap-x-2">
                          <Button
                            onClick={downloadResults}
                            disabled={!queryResult}
                            icon={HiArrowDownTray}
                          >
                            Download as JSON
                          </Button>
                          <CancelButton
                            resetQuery={resetQuery}
                            setPaymentSent={setPaymentSent}
                          />
                        </div>
                      </>
                    )}

                  {session.fetch_status === 'idle' && (
                    <p className="text-base font-normal italic text-highlight-foreground/80">
                      Awaiting payment...
                    </p>
                  )}

                  {session.fetch_status === 'error' && (
                    <>
                      <p className="text-base font-normal text-destructive">
                        An error occurred, please try again.
                      </p>
                    </>
                  )}

                  {session.fetch_status === 'pending' && (
                    <p className="text-base font-normal italic text-highlight-foreground/80">
                      Fetching data from the SearchSECO database...
                    </p>
                  )}

                  {session.fetch_status !== 'success' && (
                    <CancelButton
                      resetQuery={resetQuery}
                      setPaymentSent={setPaymentSent}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-base font-normal italic text-highlight-foreground/80">
              Query results will be displayed here
            </p>
          )}
        </MainCard>
      </div>
    </div>
  );
};

/**
 * Button that deletes the current session and resets the query
 * @returns An AlertDialog that asks the user if they are sure they want to cancel the current session
 */
export const CancelButton = ({
  resetQuery,
  setPaymentSent,
}: {
  resetQuery: () => void;
  // eslint-disable-next-line no-unused-vars
  setPaymentSent: (value: boolean) => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="subtle">Cancel</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            current session and the received data if not downloaded.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              resetQuery();
              setPaymentSent(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/**
 * Button that opens a dialog containg an explanation of how querying works
 * @returns A Dialog component with the querying process as its desription
 */
const ExplanationButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="subtle" label="How does it work?" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How does querying work?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p className="block">
                On this page you can query the SearchSECO database for data
                about methods that have been uploaded to the database. The
                process is as follows:
              </p>
              <ol className="list-decimal pl-5">
                <li>
                  Enter the URL of the GitHub repository you want to query. You
                  also need to enter your GitHub token to be able to query the
                  database. This token will be used to download the repository.
                  Only read access is required.
                </li>
                <li>
                  After submitting the form, the repository will be downloaded
                  and you will be informed about the cost of the query.
                </li>
                <li>
                  If you want to go ahead with the payment, you can press the
                  &apos;pay for hashes&apos; button. You will then be asked to
                  approve of the transaction in your wallet.
                </li>
                <li>
                  Once the payment has been confirmed, you will be able to see
                  the data in the &apos;Result&apos; section. You can download
                  the data as a JSON file.
                </li>
                <li>
                  If something went wrong or you simply want to start over, you
                  can press the &apos;Cancel&apos; button to delete the current
                  data.
                </li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <div className="flex items-end justify-end">
            <Button variant="subtle" label="Close" className="self-end" />
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default Query;
