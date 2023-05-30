/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The MainCard module provides a customizable card component with an icon, header, and aside section.
 * It is designed to be used as a main container for other components and elements.
 */

import { HiArrowTopRightOnSquare, HiLink } from 'react-icons/hi2';
import {
  DefaultMainCardHeader,
  MainCard,
  MainCardProps,
} from '@/src/components/ui/MainCard';
import { Card } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';
import { ProposalResource } from '@plopmenz/diamond-governance-sdk';
import DOMPurify from "dompurify";

export interface ProposalResourcesProps
  extends Omit<MainCardProps, 'icon' | 'header'> {
  resources: ProposalResource[] | undefined;
  loading?: boolean;
}

/**
 * MainCard component for displaying resources
 * @param props.resources List of resources to be displayed in the card
 * @param props.loading Whether or not the card should show a loading state
 */
export const ProposalResources = ({
  resources,
  loading = false,
  className,
  ...props
}: ProposalResourcesProps) => {

  const sanitizeHref = (v) => {
    const regex = /^<a href="(.+)"><\/a>$/;
    const clean = DOMPurify.sanitize(`<a href="${v}"></a>`);
    const matches = regex.exec(clean);
    //matches: [<a href="example.com"></a>, example.com]
    //Or in case of failure: matches: null.
    return matches && matches.length >= 1 ? matches[1] : '';
  }

  return (
    <MainCard
      loading={loading ?? resources ? true : false}
      className={cn(className, 'shrink')}
      icon={HiLink}
      header={
        <DefaultMainCardHeader
          value={resources?.length ?? 0}
          label="resources"
        />
      }
      {...props}
    >
      {!resources || resources.length === 0 ? (
        <div className="italic text-highlight-foreground/80">
          No resources added
        </div>
      ) : (
        <ul className="space-y-2">
          {resources.map((resource) => (
            <li key={resource.url}>
              <Card size="sm" variant="light">
                <a
                  href={sanitizeHref(resource.url)}
                  rel="noreferrer"
                  target="_blank"
                  className="flex flex-row items-center gap-x-2 font-medium text-primary transition-colors duration-200 hover:text-primary/80"
                >
                  {resource.name}
                  <HiArrowTopRightOnSquare className="h-4 w-4 shrink-0" />
                </a>
                <p className="text-xs text-popover-foreground/80">
                  {resource.url}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </MainCard>
  );
};
