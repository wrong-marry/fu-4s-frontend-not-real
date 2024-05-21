import { Reducer, createContext, useReducer } from "react";

interface StudyMode {
  mode: string | null;
  settings: {
    flashcard: {
      isSorted: boolean;
      isShuffled: boolean;
    };
    learn: {
      isShuffled: boolean;
      isSorted: boolean;
      currentRound: number;
    };
  };
}

interface StudyModeContextProps extends StudyMode {
  assignStudyMode: (mode: any) => void;
  clearStudyMode: () => void;
  changeFlashcardShuffled: (isShuffled: boolean) => void;
  changeFlashcardSorted: (isSorted: boolean) => void;
  changeLearnShuffled: (isShuffled: boolean) => void;
  changeLearnSorted: (isSorted: boolean) => void;
  changeRoundIndicator: (round: number) => void;
}

export const StudyModeContext = createContext<StudyModeContextProps>({
  mode: null,
  settings: {
    flashcard: {
      isSorted: false,
      isShuffled: false,
    },
    learn: {
      isShuffled: false,
      isSorted: false,
      currentRound: 0,
    },
  },
  assignStudyMode: () => {},
  clearStudyMode: () => {},
  changeFlashcardShuffled: () => {},
  changeFlashcardSorted: () => {},
  changeLearnShuffled: () => {},
  changeLearnSorted: () => {},
  changeRoundIndicator: () => {},
});

function studyModeReducer(state: StudyMode, action: any) {
  switch (action.type) {
    case "ASSIGN_STUDY_MODE":
      return {
        ...state,
        mode: action.payload,
      };
    case "CLEAR_STUDY_MODE":
      return {
        mode: null,
        settings: {
          flashcard: {
            isSorted: false,
            isShuffled: false,
          },
          learn: {
            isShuffled: false,
            isSorted: false,
            currentRound: 0,
          },
        },
      };
    case "CHANGE_FLASHCARD_SHUFFLED":
      return {
        ...state,
        settings: {
          ...state.settings.learn,
          flashcard: {
            ...state.settings.flashcard,
            isShuffled: action.payload.isShuffled,
          },
        },
      };
    case "CHANGE_FLASHCARD_SORTED":
      return {
        ...state,
        settings: {
          ...state.settings.learn,
          flashcard: {
            ...state.settings.flashcard,
            isSorted: action.payload.isSorted,
          },
        },
      };
    case "CHANGE_LEARN_SHUFFLED":
      return {
        ...state,
        settings: {
          ...state.settings.flashcard,
          learn: {
            ...state.settings.learn,
            isShuffled: action.payload.isShuffled,
          },
        },
      };
    case "CHANGE_LEARN_SORTED":
      return {
        ...state,
        settings: {
          ...state.settings.flashcard,
          learn: {
            ...state.settings.learn,
            isSorted: action.payload.isSorted,
          },
        },
      };

    case "CHANGE_ROUND_INDICATOR":
      return {
        ...state,
        settings: {
          ...state.settings.flashcard,
          learn: {
            ...state.settings.learn,
            currentRound: action.payload.round,
          },
        },
      };
    default:
      return state;
  }
}

export default function StudyModeProvider({ children }: any) {
  const [studyModeState, studyModeDispatch] = useReducer(
    studyModeReducer as Reducer<StudyMode, any>,
    {
      mode: null,
      settings: {
        flashcard: {
          isSorted: false,
          isShuffled: false,
        },
        learn: {
          isShuffled: false,
          isSorted: false,
          currentRound: 1,
        },
      },
    }
  );

  function handleAssignStudyMode(mode: string) {
    studyModeDispatch({
      type: "ASSIGN_STUDY_MODE",
      payload: mode,
    });
  }

  function handleClearStudyMode() {
    studyModeDispatch({
      type: "CLEAR_STUDY_MODE",
    });
  }

  function handleFlashcardShuffled(isShuffled: boolean) {
    studyModeDispatch({
      type: "CHANGE_FLASHCARD_SHUFFLED",
      payload: {
        isShuffled: isShuffled,
      },
    });
  }

  function handleFlashcardSorted(isSorted: boolean) {
    studyModeDispatch({
      type: "CHANGE_FLASHCARD_SORTED",
      payload: {
        isSorted: isSorted,
      },
    });
  }

  function handleLearnShuffled(isShuffled: boolean) {
    studyModeDispatch({
      type: "CHANGE_LEARN_SHUFFLED",
      payload: {
        isShuffled: isShuffled,
      },
    });
  }

  function handleLearnSorted(isSorted: boolean) {
    studyModeDispatch({
      type: "CHANGE_LEARN_SORTED",
      payload: {
        isSorted: isSorted,
      },
    });
  }

  function handleChangeRoundIndicator(round: number) {
    studyModeDispatch({
      type: "CHANGE_ROUND_INDICATOR",
      payload: { round: round },
    });
  }

  const contextValues: StudyModeContextProps = {
    ...studyModeState,
    assignStudyMode: handleAssignStudyMode,
    clearStudyMode: handleClearStudyMode,
    changeFlashcardShuffled: handleFlashcardShuffled,
    changeFlashcardSorted: handleFlashcardSorted,
    changeLearnShuffled: handleLearnShuffled,
    changeLearnSorted: handleLearnSorted,
    changeRoundIndicator: handleChangeRoundIndicator,
  };

  return (
    <StudyModeContext.Provider value={contextValues}>
      {children}
    </StudyModeContext.Provider>
  );
}
