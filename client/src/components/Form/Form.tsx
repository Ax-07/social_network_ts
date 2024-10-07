import {
  useEffect,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from "react";
import { ProfilPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../Actions/addPicture/PreviewPicture";
import Button from "../Base/button/Button";
import InputPicture from "../Actions/addPicture/InputPicure";
import RepostCard from "../Display/repost/RepostCard";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { useForm } from "./hooks/useForm";
import ContentField from "./inputFields/ContentField";
import { FormOrigin, switchOrigin } from "./utils/switchOrigin";
import BtnEmoji from "../Actions/btn-emoji/BtnEmoji";
import BtnQuestion from "../Actions/btn-question/BtnQuestion";
import BtnEvents from "../Actions/btn-events/BtnEvents";
import EventsForm from "./components/EventsForm";

interface FormProps
  extends PropsWithChildren<{
    origin: FormOrigin;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }> {}

const Form: FunctionComponent<FormProps> = ({ origin, handleSubmit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    form,
    inputFileRef,
    setFormState,
    changeFile,
    resetFile,
    changeContent,
  } = useForm(origin);
  const { buttonText } = switchOrigin(origin!);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPicker, setIsPicker] = useState<boolean>(false);

  useEffect(() => {
    // Reset le formulaire à chaque ouverture
    if (origin && origin !== "modal-message" && form) {
      setFormState({ userId: user?.id });
    }
  }, [user?.id]);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const newMessage = (form.content || "") + emojiData.emoji;
    changeContent(newMessage); // Met à jour l'état global avec le nouveau message
    setIsPicker(false); // Ferme le picker
  };

  return (
    <div className={`addpost addpost--${origin}`}>
      <figure className="addpost__avatar">
        <ProfilPicture user={user} />
      </figure>
      <form onSubmit={handleSubmit} className="addpost__form">
        <header className="addpost__header">
          <select name="" id="">
            <option value="public">Public</option>
            <option value="private">Privé</option>
          </select>
        </header>
        <ContentField origin={origin} />
        {form.isPreview && (
          <PreviewPicture
            media={form.preview as string}
            mimetype={form.mimetype}
            onCancel={resetFile}
          />
        )}
        {form.originalPostId && (
          <aside className="addpost__repost-card">
            <RepostCard
              origin={origin}
              originalPostId={form.originalPostId}
              originalCommentId={form.originalCommentId}
            />
          </aside>
        )}
        {form.isQuestion && <QuestionAnswer origin={origin}/>}
        {form.isEvent && <EventsForm origin={origin}/>}

        <footer className="addpost__bottom">
          <div className="addpost__bottom-wrapper">
            <InputPicture setMedia={changeFile} inputRef={inputFileRef} />
            <BtnEmoji
              onEmojiClick={onEmojiClick}
              isPicker={isPicker}
              setIsPicker={setIsPicker}
            />
            <BtnQuestion origin={origin}/>
            <BtnEvents origin={origin}/>
          </div>
          <Button
            type="submit"
            className="btn__post btn__post-submit"
            disabled={!form.isValidForm} // Utilisation de isValidForm pour désactiver le bouton
          >
            {buttonText}
          </Button>
        </footer>
      </form>
    </div>
  );
};

export default Form;

interface QuestionAnswerProps {
  origin: FormOrigin;
}
const QuestionAnswer: FunctionComponent<QuestionAnswerProps> = ({origin}) => {
  const {setFormState} = useForm(origin);
  const [answerNumber, setAnswerNumber] = useState(2);
  const [answers, setLocalAnswers] = useState<string[]>(["", ""]);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const addAnswer = () => {
    if (answerNumber < 4) { // Limite à 4 réponses
      setAnswerNumber(answerNumber + 1);
      setLocalAnswers([...answers, ""]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = e.target.value;
    setLocalAnswers(updatedAnswers);
    setFormState({answers: updatedAnswers});
  };

    // Calculer et mettre à jour la date d'expiration
    const handleExpirationChange = (updatedDays: number, updatedHours: number, updatedMinutes: number) => {
      setDays(updatedDays);
      setHours(updatedHours);
      setMinutes(updatedMinutes);
  
      // Calcul de la date d'expiration
      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + updatedDays);
      expiredAt.setHours(expiredAt.getHours() + updatedHours);
      expiredAt.setMinutes(expiredAt.getMinutes() + updatedMinutes);
  
      // Mise à jour du formState avec la date d'expiration
      setFormState({ expiredAt });
    };

    const handleResetQuestion = () => {
      setFormState({
        isQuestion: false,
        answers: undefined,
        expiredAt: undefined,
      })
    }

  return (
    <div className="question-form">
      <div className="answers">
        <ul className="answers__list">
        {Array.from({ length: answerNumber }, (_, i) => (
          <li key={i} className="answers__item">
            <input
              id={`choix${i}`}
              className="answers__input"
              type="text"
              placeholder={`Choix ${i + 1}`}
              onChange={(e) => handleChange(e, i)}
              aria-label={`Choix ${i + 1}`}
            />
          </li>
        ))}
        </ul>
        {answerNumber < 4 && (
          <span 
            className="answers__btn-addAnswer"
            onClick={addAnswer}
            aria-label="Ajouter une réponse supplémentaire"
          >
              <img src="/src/assets/icons/faAdd.svg" alt="" />
          </span>
        )}
      </div>
      <div className="timer">
        <p className="timer__title">Durée de la question</p>
        <div className="timer__options">
          <div className="drop-menu">
            <p>Jours</p>
            <select
              className="drop-menu__select"
              name="jours"
              id="jours"
              onChange={(e) => handleExpirationChange(parseInt(e.target.value), hours, minutes)}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <option className="drop-menu__option" key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <img src="/src/assets/icons/faAngleRight.svg" alt="" />
          </div>
          <div className="drop-menu">
            <p>Heures</p>
            <select
              className="drop-menu__select"
              name="heures"
              id="heures"
              onChange={(e) => handleExpirationChange(days, parseInt(e.target.value), minutes)}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option className="drop-menu__option" key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <img src="/src/assets/icons/faAngleRight.svg" alt="" />
          </div>
          <div className="drop-menu">
            <p>Minutes</p>
            <select
              className="drop-menu__select"
              name="minutes"
              id="minutes"
              onChange={(e) => handleExpirationChange(days, hours, parseInt(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option className="drop-menu__option" key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <img src="/src/assets/icons/faAngleRight.svg" alt="" />
          </div>
        </div>
      </div>
      <div className="question-form__btn-delete"
          onClick={handleResetQuestion}
        >
          Annuler la question
      </div>
    </div>
  );
};