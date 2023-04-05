/**
 * This code is based on the Radix UI React Collapsible component, which provides a set of composable and accessible primitives to build collapsible components.
 * For more information on the available props and examples of usage, see https://ui.shadcn.com/docs/primitives/collapsible.
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
