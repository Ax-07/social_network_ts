import type { FunctionComponent } from 'react';
import { FormOrigin } from '../../Form/utils/switchOrigin';
import { useForm } from '../../Form/hooks/useForm';

interface BtnEventsProps {
    origin: FormOrigin;
}

const BtnEvents: FunctionComponent<BtnEventsProps> = ({origin}) => {
    const { form, setFormState } = useForm(origin);

    const onEventClick = () => {
        setFormState({ isEvent: !form.isEvent });
    };
    
    return (
        <>
          <img src='/src/assets/icons/eventsIcon.svg' alt='question' onClick={onEventClick}/>
        </>
      );
    };

export default BtnEvents;