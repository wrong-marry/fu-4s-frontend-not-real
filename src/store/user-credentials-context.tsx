import { createContext, useReducer } from "react";

export interface UserCredentials {
  info: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  loaded: boolean;
}

interface UserCredentialsContextProps extends UserCredentials {
  assignUserCredentials: (userCredentials: any) => void;
  clearUserCredentials: () => void;
}

export const UserCredentialsContext =
  createContext<UserCredentialsContextProps>({
    info: {
      username: "",
      firstName: "",
      lastName: "",
      email: ""
    },
    loaded: false,
    assignUserCredentials: () => {},
    clearUserCredentials: () => {},
  });

function userCredentialsReducer(state: UserCredentials, action: any) {
  switch (action.type) {
    case "ASSIGN_CREDENTIALS":
      return {
        info: action.payload,
        loaded: true,
      };
    case "CLEAR_CREDENTIALS":
      return {
        info: null,
        loaded: false,
      };
    default:
      return state;
  }
}

export default function UserCredentialsProvider({ children }: any) {
  const [userCredentialsState, userCredentialsDispatch] = useReducer(
    userCredentialsReducer,
    {
      info: null,
      loaded: false,
    }
  );

  function handleAssignUserCredentials(userCredentials: UserCredentials) {
    userCredentialsDispatch({
      type: "ASSIGN_CREDENTIALS",
      payload: userCredentials,
    });
  }

  function handleClearUserCredentials() {
    userCredentialsDispatch({ type: "CLEAR_CREDENTIALS" });
  }

  const contextValues: UserCredentialsContextProps = {
    ...userCredentialsState,
    assignUserCredentials: handleAssignUserCredentials,
    clearUserCredentials: handleClearUserCredentials,
  };

  return (
    <UserCredentialsContext.Provider value={contextValues}>
      {children}
    </UserCredentialsContext.Provider>
  );
}
