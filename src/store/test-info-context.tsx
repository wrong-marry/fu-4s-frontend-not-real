import { Reducer, createContext, useReducer } from "react";

interface TestInfo {
  id: number | null;
  name: string | null;
  totalQuestion: number | null;
}

interface TestInfoContextProps extends TestInfo {
  assignTestInfo: (testInfo: any) => void;
  clearTestInfo: () => void;
}

export const TestInfoContext = createContext<TestInfoContextProps>({
  id: null,
  name: null,
  totalQuestion: null,
  assignTestInfo: () => {},
  clearTestInfo: () => {},
});

function testInfoReducer(state: TestInfo, action: any) {
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

export default function TestInfoProvider({ children }: any) {
  const [testInfoState, testInfoDispatch] = useReducer(testInfoReducer as Reducer<TestInfo, any>, {
    id: null,
    name: null,
    totalQuestion: null
  });

  function handleAssignTestInfo(info: TestInfo) {
    testInfoDispatch({
      type: "ASSIGN_QUIZ_INFO",
      payload: info
    })
  }

  function handleClearTestInfo() {
    testInfoDispatch({
      type: "CLEAR_QUIZ_INFO"
    })
  }

  const contextValues: TestInfoContextProps = {
    ...testInfoState,
    assignTestInfo: handleAssignTestInfo,
    clearTestInfo: handleClearTestInfo
  }

  return <TestInfoContext.Provider value={contextValues}>
    {children}
  </TestInfoContext.Provider>
}

