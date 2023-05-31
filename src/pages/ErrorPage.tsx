/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Layout from '@/src/components/layout/Layout';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Link } from '@/src/components/ui/Link';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { HiChevronLeft, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <Layout>
      <div className="space-y-2">
        {/* Back button */}
        <Link
          to="/dashboard"
          icon={HiChevronLeft}
          variant="outline"
          label="Dashboard"
          className="text-lg"
        />
        <HeaderCard
          title={error?.statusText ?? 'An error occurred'}
          aside={
            error &&
            error.status && (
              <StatusBadge
                icon={HiOutlineExclamationTriangle}
                text={error.status}
                size="lg"
              />
            )
          }
        >
          {error?.status === 404 ? (
            <p>
              The page you are looking for does not exist. Please check the URL
              and try again.
            </p>
          ) : (
            <p>
              An error occurred while loading the page. Please try again later.
            </p>
          )}
        </HeaderCard>
      </div>
    </Layout>
  );
};

export default ErrorPage;
