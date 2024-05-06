import { RichTextEditor, Link } from "@mantine/tiptap";
import { EditorEvents, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";

import "@mantine/tiptap/styles.css";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Input } from "@mantine/core";

type RichTextRHFProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  control?: Control<T>;
  editable?: boolean;
  onUpdate?: (props: EditorEvents["update"]) => void;
  onBlur?: (props: EditorEvents["blur"]) => void;
};

export const RichTextRHF = <T extends FieldValues>({
  name,
  label,
  description,
  control,
  onUpdate,
  onBlur,
  editable = true,
}: RichTextRHFProps<T>) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name, control });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editable: editable && !isSubmitting,
    onUpdate: ({ editor, transaction }) => {
      onFieldChange(editor.getHTML());
      onUpdate?.({ editor, transaction });
    },
    onBlur: (props) => {
      onFieldBlur();
      onBlur?.(props);
    },
  });
  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error?.message}
    >
      <RichTextEditor editor={editor} color={"red"}>
        {editable && !isSubmitting && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}

        <RichTextEditor.Content ref={ref} />
      </RichTextEditor>
    </Input.Wrapper>
  );
};
