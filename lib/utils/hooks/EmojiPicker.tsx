import Picker, { PickerProps } from 'emoji-picker-react';
import { forwardRef } from 'react';

export type EmojiPickerElement = HTMLDivElement;

export const EmojiPicker = forwardRef<EmojiPickerElement, PickerProps>(
  (props, ref) => {
    return (
      <div ref={ref}>
        <Picker {...props} />
      </div>
    );
  }
);

EmojiPicker.displayName = 'EmojiPicker';