export interface QuestionTypes {
    id: string;
    question: string;
    answers: {
        title: string;
        votes: number;
    }[];
    }

export interface QuestionResponseArray {
    status: string;
    data: QuestionTypes[];
    message: string;
}

export interface QuestionResponse {
    status: string;
    data: QuestionTypes;
    message: string;
}

