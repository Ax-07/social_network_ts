import type { FunctionComponent, PropsWithChildren } from 'react';
import Picker from "emoji-picker-react";

interface BtnEmojiProps extends PropsWithChildren <{
    onEmojiClick: (emojiData: { emoji: string }) => void;
    isPicker: boolean;
    setIsPicker: (isPicker: boolean) => void;
}> {}

const BtnEmoji: FunctionComponent<BtnEmojiProps> = ({onEmojiClick, isPicker, setIsPicker}) => {
  return (
    <>
            <img src={'/src/assets/icons/icon_emoji.svg'} alt="emoji" onClick={()=> setIsPicker(!isPicker)} />
            {isPicker && <div className="picker-container">
              <Picker
                onEmojiClick={onEmojiClick}
                height={300}
                width={400} // Ajuste en fonction de ton besoin
                reactionsDefaultOpen={true}
                />
              </div>
            }
    </>
  );
};

export default BtnEmoji;