import type { FunctionComponent, PropsWithChildren } from 'react';
import { useForm } from '../../Form/hooks/useForm';
import { FormOrigin } from '../../Form/utils/switchOrigin';

interface BtnQuestionProps extends PropsWithChildren <{
  origin: FormOrigin;
}> {}

const BtnQuestion: FunctionComponent<BtnQuestionProps> = ({origin}) => {
  const { form, setFormState } = useForm(origin);

  const onQuestionClick = () => {
    setFormState({ isQuestion: !form.isQuestion });
  };
  return (
    <>
      <img src='/src/assets/icons/icon_question.svg' alt='question' onClick={onQuestionClick}/>
    </>
  );
};

export default BtnQuestion;

