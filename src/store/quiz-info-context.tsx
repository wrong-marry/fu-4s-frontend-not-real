import { Reducer, createContext, useReducer } from "react";

interface QuizInfo {
  id: number | null;
  name: string | null;
  totalQuestion: number | null;
}

interface QuizInfoContextProps extends QuizInfo {
  assignQuizInfo: (quizInfo: any) => void;
  clearQuizInfo: () => void;
}

export const QuizInfoContext = createContext<QuizInfoContextProps>({
  id: null,
  name: null,
  totalQuestion: null,
  assignQuizInfo: () => {},
  clearQuizInfo: () => {},
});

function quizInfoReducer(state: QuizInfo, action: any) {
  switch (action.type) {
    case "ASSIGN_QUIZ_INFO":
      return {
        id: action.payload.id,
        name: action.payload.name,
        totalQuestion: action.payload.totalQuestion
      }
    case "CLEAR_QUIZ_INFO":
      return {
        id: null,
        name: null,
        totalQuestion: null
      }
    default:
      return state
  }
}

export default function QuizInfoProvider({ children }: any) {
  const [quizInfoState, quizInfoDispatch] = useReducer(quizInfoReducer as Reducer<QuizInfo, any>, {
    id: null,
    name: null,
    totalQuestion: null
  });

  function handleAssignQuizInfo(info: QuizInfo) {
    quizInfoDispatch({
      type: "ASSIGN_QUIZ_INFO",
      payload: info
    })
  }

  function handleClearQuizInfo() {
    quizInfoDispatch({
      type: "CLEAR_QUIZ_INFO"
    })
  }

  const contextValues: QuizInfoContextProps = {
    ...quizInfoState,
    assignQuizInfo: handleAssignQuizInfo,
    clearQuizInfo: handleClearQuizInfo
  }

  return <QuizInfoContext.Provider value={contextValues}>
    {children}
  </QuizInfoContext.Provider>
}

