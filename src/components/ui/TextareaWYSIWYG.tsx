import { Toggle } from '@/src/components/ui/Toggle';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
      className={`styled-menu-bar flex flex-wrap justify-between bg-slate-50 px-2 py-1.5 ${
        fullScreen ? 'sticky top-0 z-10' : 'rounded-t-xl'
      } ${disabled ? 'bg-ui-100' : ''} dark:bg-slate-800`}
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
        className={`container fixed top-0 flex h-screen w-screen flex-col overflow-auto text-slate-700 dark:bg-slate-950 dark:text-slate-300 ${
          disabled ? 'bg-ui-100 border-ui-200' : 'bg-white'
        }`}
      >
        <div
          className={`styled-menu-bar sticky top-0 z-10 flex flex-wrap justify-between bg-slate-50 px-2 py-1.5 dark:bg-slate-800 ${
            disabled ? 'bg-ui-100' : ''
          }`}
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
      className={`container w-full overflow-auto text-slate-700 dark:bg-slate-950 dark:text-slate-300 ${
        disabled
          ? 'bg-ui-100 border-ui-200'
          : 'border-ui-100 hover:border-ui-300 rounded border-2 bg-white focus-within:ring-2 focus-within:ring-primary-500 active:border-primary-500 active:ring-0'
      }`}
    >
      <div
        className={`styled-menu-bar flex flex-wrap justify-between rounded-t-xl bg-slate-50 px-2 py-1.5 dark:bg-slate-800 ${
          disabled ? 'bg-ui-100' : ''
        }`}
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

// const Container = styled.div.attrs(
//   ({ disabled, fullScreen = false }: Props) => ({
//     className: `w-full text-ui-600 overflow-auto ${
//       fullScreen
//         ? 'h-screen flex flex-col fixed top-0'
//         : 'rounded-xl border-2 border-ui-100 hover:border-ui-300 focus-within:ring-2 focus-within:ring-primary-500 active:border-primary-500 active:ring-0 '
//     } ${disabled ? 'bg-ui-100 border-ui-200' : 'bg-white'}`,
//   })
// )<Props>`
//   ::-webkit-input-placeholder {
//     color: #9aa5b1;
//   }
//   ::-moz-placeholder {
//     color: #9aa5b1;
//   }
//   :-ms-input-placeholder {
//     color: #9aa5b1;
//   }
//   :-moz-placeholder {
//     color: #9aa5b1;
//   }
// `;

// const StyledMenuBar = styled.div.attrs(({ disabled, fullScreen }: Props) => ({
//   className: `bg-ui-50 px-2 py-1.5 flex flex-wrap justify-between ${
//     fullScreen ? 'sticky top-0 z-10' : 'rounded-t-xl'
//   } ${disabled ? 'bg-ui-100' : ''}`,
// }))<Props>``;

// const Toolgroup = styled.div.attrs({
//   className: 'flex flex-wrap space-x-1.5',
// })``;

// const StyledEditorContent = styled(EditorContent)`
//   flex: 1;
//   .ProseMirror {
//     padding: 12px 16px;
//     height: 100%;
//     min-height: 112px;
//     :focus {
//       outline: none;
//     }
//     ul {
//       list-style-type: decimal;
//       padding: 0 1rem;
//     }
//     ol {
//       list-style-type: disc;
//       padding: 0 1rem;
//     }
//     a {
//       color: #003bf5;
//       cursor: pointer;
//       font-weight: 700;
//       :hover {
//         color: #0031ad;
//       }
//     }
//   }
//   .ProseMirror p.is-editor-empty:first-child::before {
//     color: #adb5bd;
//     content: attr(data-placeholder);
//     float: left;
//     height: 0;
//     pointer-events: none;
//   }
// `;
