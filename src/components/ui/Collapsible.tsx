/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This code is based on the Radix UI React Collapsible component, which provides a set of composable and accessible primitives to build collapsible components.
 *
 * For more information on the available props and examples of usage:
 * @see https://www.radix-ui.com/docs/primitives/components/collapsible - Radix UI Collapsible Primitive
 *
 * Inspired by https://ui.shadcn.com/docs/primitives/collapsible.
 */

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

/**
 * Parent component that provides the context for the other components.
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * The trigger component that toggles the collapsible content.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

/**
 * The content component that is collapsed or expanded.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
