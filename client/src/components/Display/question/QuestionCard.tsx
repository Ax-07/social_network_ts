import { useEffect, useState, type FunctionComponent } from "react";
import { useResponseToQuestionMutation } from "../../../services/api/questionApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/stores";

interface QuestionCardProps {
  question: {
    id: string;
    question: string;
    answers: {
      title: string;
      votes: number;
    }[];
    expiredAt: string;
  };
}

const QuestionCard: FunctionComponent<QuestionCardProps> = ({ question }) => {
  const [responseToQuestion] = useResponseToQuestionMutation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [timeRemaining, setTimeRemaining] = useState("");

  const calculPercentValue = (votes: number) => {
    const totalVotes = question.answers.reduce((acc, answer) => acc + answer.votes, 0);
    return ((votes / totalVotes) * 100).toFixed(2);
  };

  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const expirationTime = new Date(question.expiredAt).getTime();
    const timeDiff = expirationTime - currentTime;

    if (timeDiff <= 0) {
      return "";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 1) {
      return `${days} jours`;
    } else if (hours > 0) {
      return `${hours} heures`;
    } else {
      return `${minutes} minutes`;
    }
  };
  const expired = new Date() > new Date(question.expiredAt);

  useEffect(() => {
      setTimeRemaining(calculateTimeRemaining());
  }, []);
  
  if (!question || !userId) return null;

  const handleResponse = async (answer: string) => {
    if(expired) return;
    try {
      await responseToQuestion({ id: question.id, answer, userId });
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="question">
      <p className="question__title">{question.question}</p>
      <ul className="question__list">
        {question.answers.map((answer, index) => (
          <li className="question__item" 
            key={index} 
            onClick={()=> handleResponse(answer.title)}
            style={{ cursor: expired ? "not-allowed" : "pointer" }}
          >
            <p className="question__item-title">{answer.title}</p>
            <p className="question__item-votes">{answer.votes}</p>
              <div
                className="question__item-percent"
                style={{ width: `${calculPercentValue(answer.votes)}%` }}
              ></div>
          </li>
        ))}
      </ul>
      <p className="question__expired">{expired ? "Expired" : "Expires dans "}{timeRemaining}</p>
    </div>
  );
};

export default QuestionCard;
