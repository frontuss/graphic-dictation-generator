import React, { InputHTMLAttributes, useCallback } from 'react';
import { Btn } from '../Btn/Btn';

interface IDrawingAreaFileSelectionButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  onChoice: (file: File) => unknown;
}

export function DrawingAreaFileSelectionButton(props: IDrawingAreaFileSelectionButtonProps) {
  const onChoice = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
      const node = e.target as HTMLInputElement;

      if (typeof props.onSelect === 'function') {
        props.onSelect(e);
      }

      if (node.files && node.files.length > 0) {
        props.onChoice(node.files[0]);
      }
    },
    [props]
  );

  return (
    <div className="drawing-area__file-input-wrap btn-wrap">
      <Btn>Select file</Btn>
      <input type="file" id="__drawing-area-file-input" onChange={onChoice} />
    </div>
  );
}
