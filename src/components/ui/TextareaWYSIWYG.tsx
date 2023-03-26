import { Toggle } from '@/src/components/ui/Toggle';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  FaBold,
  FaItalic,
  FaLink,
  FaUnlink,
  FaListOl,
  FaListUl,
  FaExpandAlt,
} from 'react-icons/fa';

type MenuBarProps = {
  disabled: boolean;
  editor: Editor | null;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  fullScreen?: boolean;
};

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

    // TODO: All possible url validations should be done here instead of just checking for protocol
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
        'flex flex-wrap justify-between bg-slate-50 px-2 py-1.5 dark:bg-slate-800',
        fullScreen && 'sticky top-0 z-10',
        disabled && 'bg-slate-100'
      )}
    >
      <div className="toolgroup flex flex-wrap space-x-1.5">
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
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </Toggle>
      </div>

      <Toggle disabled={disabled} onClick={() => setIsExpanded(!isExpanded)}>
        <FaExpandAlt />
      </Toggle>
    </div>
  );
};

export type TextareaWYSIWYGProps = {
  placeholder?: string;
  disabled?: boolean;
  onBlur?: (html: string) => void;
  onChange?: (html: string) => void;
  name?: string;
  value?: string;
};

export const TextareaWYSIWYG: React.FC<TextareaWYSIWYGProps> = ({
  placeholder = '',
  disabled = false,
  onBlur,
  onChange,
  name = '',
  value = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      onBlur: ({ editor }) => {
        if (onBlur) {
          onBlur(editor.getHTML());
        }
      },
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
    },
    [disabled]
  );

  const body = document.querySelector('body');

  if (isExpanded) {
    document.onkeydown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(!isExpanded);
      }
    };

    if (body) {
      body.style.overflow = 'hidden';
    }

    let portalNode = document.querySelector('#fullscreen-editor');
    if (!portalNode) {
      const div = document.createElement('div');
      div.id = 'fullscreen-editor';
      document.body.appendChild(div);
      portalNode = div;
    }

    const fullScreenEditor = (
      <div
        className={clsx(
          'fixed top-0 flex h-screen w-screen flex-col overflow-auto text-slate-700 dark:bg-slate-950 dark:text-slate-300',
          disabled ? 'border-slate-200 bg-slate-100' : 'bg-white'
        )}
      >
        <div
          className={clsx(
            'styled-menu-bar sticky top-0 z-10 flex flex-wrap justify-between bg-slate-50 px-2 py-1.5 dark:bg-slate-800',
            disabled && 'bg-slate-100'
          )}
        >
          <MenuBar
            disabled={disabled}
            editor={editor}
            fullScreen
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>
        <div className="styled-editor-content">
          <EditorContent name={name} editor={editor} />{' '}
        </div>
      </div>
    );

    return ReactDOM.createPortal(fullScreenEditor, portalNode);
  }

  if (body) {
    body.style.overflow = 'auto';
  }

  return (
    <div
      className={clsx(
        'w-full overflow-auto rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
        disabled ? 'cursor-not-allowed opacity-50' : 'border border-slate-100'
      )}
    >
      <div
        className={clsx(
          'styled-menu-bar flex flex-wrap justify-between bg-slate-50 px-2 py-1.5 dark:bg-slate-800',
          disabled && 'bg-slate-100'
        )}
      >
        <MenuBar
          disabled={disabled}
          editor={editor}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <div className="styled-editor-content">
        <EditorContent name={name} editor={editor} />
      </div>
    </div>
  );
};

type Props = {
  disabled: boolean;
  fullScreen?: boolean;
};
