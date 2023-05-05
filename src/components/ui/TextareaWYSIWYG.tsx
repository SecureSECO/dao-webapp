/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This file contains a custom TextareaWYSIWYG component that provides rich text editing functionality.
 * It utilizes 'tiptap' and 'react-hook-form' to create a feature-rich textarea component for various use cases.
 * The MenuBar component is also defined here to handle toolbar actions and styling.
 */

import { Toggle } from '@/src/components/ui/Toggle';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import React, { useCallback, useState, useEffect } from 'react';
import {
  FieldError,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
  useFormContext,
} from 'react-hook-form';
import ReactDOM from 'react-dom';
import {
  FaBold,
  FaItalic,
  FaLink,
  FaUnlink,
  FaListOl,
  FaListUl,
  FaExpandAlt,
  FaCompressAlt,
} from 'react-icons/fa';

type MenuBarProps = {
  disabled: boolean;
  editor: Editor | null;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  fullScreen?: boolean;
};

/**
 * The MenuBar component represents the toolbar for the TextareaWYSIWYG component.
 * It contains buttons for applying formatting and other actions.
 *
 * @param props - The properties for the MenuBar component.
 * @param {boolean} props.disabled - Indicates whether the editor is disabled.
 * @param {Editor} props.editor - The 'tiptap' Editor instance.
 * @param {boolean} props.isExpanded - Indicates whether the editor is in fullscreen mode.
 * @param {React.SetStateAction<boolean>} props.setIsExpanded - A function to toggle the editor's fullscreen mode.
 * @param {boolean} [props.fullScreen=false] - Optional flag to indicate if the menu bar should be displayed in fullscreen mode.
 * @returns A MenuBar React element.
 */
const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  disabled,
  isExpanded,
  setIsExpanded,
  fullScreen = false,
}) => {
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: `http://${url}` })
        .run();
    } else {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex w-full flex-wrap items-center justify-between bg-accent px-4 py-2',
        fullScreen && 'sticky top-0 z-10',
        disabled && 'bg-muted'
      )}
    >
      <div className="flex flex-wrap space-x-1.5">
        <Toggle
          //isActive={editor.isActive('bold')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </Toggle>
        <Toggle
          //isActive={editor.isActive('italic')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </Toggle>
        <Toggle
          //isActive={editor.isActive('link')}
          disabled={disabled}
          onClick={setLink}
        >
          <FaLink />
        </Toggle>
        <Toggle
          //isActive={editor.isActive('link')}
          disabled={!editor.isActive('link') || disabled}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <FaUnlink />
        </Toggle>

        <Toggle
          //isActive={editor.isActive('bulletList')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </Toggle>
        <Toggle
          //isActive={editor.isActive('orderedList')}
          disabled={disabled}
          //
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </Toggle>
      </div>

      <Toggle disabled={disabled} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaCompressAlt /> : <FaExpandAlt />}
      </Toggle>
    </div>
  );
};

/**
 * The TextareaWYSIWYG component represents a styled WYSIWYG textarea element with rich text editing functionality.
 * It supports error handling with 'react-hook-form' and can be easily integrated into forms.
 *
 * @template T - The generic type parameter for FieldValues.
 * @param {Object} props - The properties for the TextareaWYSIWYG component.
 * @param {string} [props.placeholder=''] - Optional placeholder text for the textarea.
 * @param {boolean} [props.disabled=false] - Optional flag to disable the editor.
 * @param {(html: string) => void} [props.onBlur] - Optional callback to handle the onBlur event.
 * @param {(html: string) => void} [props.onChange] - Optional callback to handle the onChange event.
 * @param {string} [props.name='editor'] - Optional name attribute for the textarea.
 * @param {string} [props.value=''] - Optional initial value for the textarea.
 * @param {FieldError} [props.error] - Optional 'react-hook-form' FieldError object to handle error states.
 * @param {() => void} props.setError - A function to set the error state for the textarea.
 * @param {() => void} props.clearErrors - A function to clear the error state for the textarea.
 * @returns A TextareaWYSIWYG React element.
 */
export type TextareaWYSIWYGProps<T extends FieldValues> = {
  placeholder?: string;
  disabled?: boolean;
  onBlur?: (html: string) => void;
  onChange?: (html: string) => void;
  name?: string;
  value?: string;
  error?: FieldError;
  setError: () => void;
  clearErrors: () => void;
  isRequired?: boolean;
};

export const TextareaWYSIWYG = <T extends FieldValues>({
  placeholder = '',
  disabled = false,
  onBlur,
  onChange,
  name = 'editor',
  value = '',
  error,
  setError,
  clearErrors,
  isRequired = false,
}: TextareaWYSIWYGProps<T>) => {
  // State for handling expanded mode
  const [isExpanded, setIsExpanded] = useState(false);

  // State for handling focus state
  const [isFocused, setIsFocused] = useState(false);

  // Initialize tiptap editor
  const editor = useEditor(
    {
      content: value,
      editable: !disabled,
      extensions: [
        StarterKit,
        Link,
        Placeholder.configure({
          placeholder,
        }),
      ],
      // Handle onBlur event
      onBlur: ({ editor }) => {
        if (onBlur) {
          onBlur(editor.getHTML());
        }

        if (isRequired) {
          if (isEmptyContent(editor.getHTML())) {
            setError();
          } else {
            clearErrors();
          }
        }

        setIsFocused(false);
      },
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
      onFocus: () => {
        setIsFocused(true);
      },
    },
    [disabled]
  );

  // Helper function to check if content is empty
  const isEmptyContent = (content: string) => {
    const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, '').trim();
    return strippedContent === '';
  };

  // Update editor content and handle onChange event
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }

    if (editor && onChange) {
      onChange(editor.getHTML());
    }
  }, [editor, onChange, value]);

  // Handle expanded mode and create portal if necessary
  if (isExpanded) {
    // Handle escape key to exit fullscreen mode
    document.onkeydown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(!isExpanded);
      }
    };

    // Create and render portal for fullscreen mode
    let portalNode = document.querySelector('#fullscreen-editor');
    if (!portalNode) {
      const div = document.createElement('div');
      div.id = 'fullscreen-editor';
      document.body.appendChild(div);
      portalNode = div;
    }

    const fullScreenEditor = (
      <EditorComponent
        isExpanded={isExpanded}
        disabled={disabled}
        error={error}
        isFocused={isFocused}
        name={name}
        editor={editor}
        setIsExpanded={setIsExpanded}
      />
    );

    return ReactDOM.createPortal(fullScreenEditor, portalNode);
  }

  return (
    <EditorComponent
      isExpanded={isExpanded}
      disabled={disabled}
      error={error}
      isFocused={isFocused}
      name={name}
      editor={editor}
      setIsExpanded={setIsExpanded}
    />
  );
};

const EditorWrapper: React.FC<{
  isExpanded: boolean;
  disabled: boolean;
  error?: FieldError;
  isFocused: boolean;
  children: React.ReactNode;
}> = ({ isExpanded, disabled, error, isFocused, children }) => {
  return (
    <div
      className={clsx(
        isExpanded
          ? 'fixed top-0 flex h-screen w-screen flex-col overflow-auto bg-highlight text-highlight-foreground'
          : 'group w-full overflow-auto rounded-md bg-transparent',
        disabled
          ? 'cursor-not-allowed border-input opacity-50'
          : error
          ? 'border border-destructive ring-destructive'
          : 'border border-input ring-primary/50',
        isFocused && 'outline-none ring-2 ring-offset-2 ring-offset-background'
      )}
    >
      {children}
    </div>
  );
};

const EditorComponent = ({
  isExpanded,
  setIsExpanded,
  name,
  disabled,
  error,
  isFocused,
  editor,
}: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  disabled: boolean;
  error?: FieldError;
  isFocused: boolean;
  editor: Editor | null;
}) => {
  return (
    <EditorWrapper
      isExpanded={isExpanded}
      disabled={disabled}
      error={error}
      isFocused={isFocused}
    >
      <div className="sticky top-0 z-10 flex flex-wrap justify-between">
        <MenuBar
          disabled={disabled}
          editor={editor}
          fullScreen
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <EditorContent
        name={name}
        editor={editor}
        className="styled-editor-content"
      />
    </EditorWrapper>
  );
};
