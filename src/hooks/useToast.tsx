/**
 * Used to access the active toasts and create new ones.
 *
 * inspired by https://ui.shadcn.com/docs/primitives/toast
 */

// Inspired by react-hot-toast library

import * as React from 'react';
import { ToastActionElement, type ToastProps } from '@/src/components/ui/Toast';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

interface Toast extends Omit<ToasterToast, 'id'> {}

/**
 * Show a toast with the given props
 * @param props Props for the toast, including duration, variant, title and description
 * @returns The ID of the toast
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return id;
}

toast.dismiss = (id: string) => {
  dispatch({ type: 'DISMISS_TOAST', toastId: id });
};

type BasicToast = Pick<ToasterToast, 'title' | 'description'>;
type PromiseProp<TData> =
  | ToasterToast['title']
  | BasicToast
  | ((data: TData) => BasicToast);

type PromiseToast<TData> = {
  loading: ToasterToast['title'] | BasicToast;
  success: PromiseProp<TData>;
  error: PromiseProp<unknown>;
  onSuccess?: (data: TData) => void;
  onFinish?: () => void;
};

/**
 * Convert a property passed to a promise toast (such as loading) to a title and description for a toast.
 * Takes care of different cases of the property just a string (for the title), an object, or a function.
 * @param prop The property passed to the toast.promise function
 * @param data The data passed to be passed to the function if the property is a function
 */
const promisePropToToast = <TData,>(
  prop: PromiseProp<TData>,
  data?: TData
): BasicToast => {
  const empty = {
    title: '',
    description: '',
  };

  if (typeof prop === 'string') {
    return { title: prop };
  } else if (typeof prop === 'function') {
    return data ? prop(data) : empty;
  } else {
    return prop ?? empty;
  }
};

toast.promise = function <TData>(
  promise: Promise<TData>,
  config: PromiseToast<TData>
) {
  const id = toast.loading(promisePropToToast(config.loading));

  promise.then(
    (data) => {
      toast.success(promisePropToToast(config.success, data), id);
      config.onSuccess && config.onSuccess(data);
    },
    (error) => {
      toast.error(promisePropToToast(config.error, error), id);
    }
  );
  promise.finally(() => {
    config.onFinish && config.onFinish();
  });

  return id;
};

// Show specific types of toasts
toast.loading = (props: Toast) =>
  toast({ ...props, variant: 'loading', duration: Infinity });
toast.update = (id: string, props: Toast) => {
  dispatch({
    type: 'UPDATE_TOAST',
    toast: { ...props, id },
  });
};
toast.error = (props: Toast, id?: string) =>
  id
    ? toast.update(id, {
        ...props,
        variant: 'destructive',
        duration: TOAST_REMOVE_DELAY,
      })
    : toast({ ...props, variant: 'destructive' });
toast.success = (props: Toast, id?: string) =>
  id
    ? toast.update(id, {
        ...props,
        variant: 'success',
        duration: TOAST_REMOVE_DELAY,
      })
    : toast({ ...props, variant: 'success' });

interface ContractTransactionPromiseResult {
  hash: string;
  wait: (confirmations?: number | undefined) => Promise<ContractReceipt>;
}

type ContractTransactionToast = Omit<PromiseToast<ContractReceipt>, 'loading'>;

/**
 * Show a toast that will be updated based on interaction with a smart contract, using the provided content.
 * This will show a loading toast that says "Awaiting signature" until the user signs the transaction, after which
 * it will show a loading toast that says "Awaiting confirmation" until the transaction is confirmed. If it is successful, or an error occurs,
 * a toast with corresponding style and using the given content will be shown.
 * @param promise A promise that returns an ethers ContractTransaction object
 * @param config An object containing the content to show when an error is encountered, and when the transaction has is successful, plus optionally a callback function to call when the transation is finished (and confirmed)
 * @returns An object containing the id of the toast
 */
toast.contractTransaction = async (
  promise: () => Promise<ContractTransactionPromiseResult>,
  config: ContractTransactionToast
) => {
  const id = toast.loading({
    title: 'Awaiting signature...',
  });

  try {
    // Get block explorer url for the currently preferred network
    const explorerURL = PREFERRED_NETWORK_METADATA.explorer;
    const transaction = await promise();

    // Show link to transaction on block explorer
    toast.update(id, {
      title: 'Awaiting confirmation...',
      description: explorerURL ? (
        <a
          href={`${explorerURL}/tx/${transaction.hash}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center gap-x-1 text-xs text-primary"
        >
          View on block explorer
          <HiArrowTopRightOnSquare />
        </a>
      ) : (
        ''
      ),
    });

    // Await confirmation of the transaction
    const receipt = await transaction.wait();

    // Call the given success callback function
    toast.success(promisePropToToast(config.success, receipt), id);
    config.onSuccess && config.onSuccess(receipt);
  } catch (e) {
    console.error(e);
    toast.error(promisePropToToast(config.error, e), id);
  }

  return id;
};

/**
 * @returns The current state of the active toasts, and a function to add a new toast
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
  };
}

export { useToast, toast };
