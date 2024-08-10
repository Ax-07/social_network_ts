import type { FunctionComponent } from 'react';

interface PreviewPictureProps {
    image: string;
    onCancel: () => void;
}

const PreviewPicture: FunctionComponent<PreviewPictureProps> = (props) => {
  return (
    <div className='preview-picture'>
        <img src={props.image} alt="preview" />
        <button type="button" onClick={props.onCancel}>Cancel</button>
    </div>
  );
};

export default PreviewPicture;
