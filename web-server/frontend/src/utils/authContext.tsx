import React, { useContext, useState } from 'react';

function getLocalStorageAuth() {
  let state;
  try {
    state = JSON.parse(localStorage.getItem('authed') as string);
  } catch (error) {
    state = null;
  }
  return state;
}

function setLocalStorageAuth(obj) {
  // obg: {
  //   isAuthed: Boolean,
  //   authInfo: Object
  // }
  localStorage.setItem('authed', JSON.stringify(obj));
}

function isObject(toCheck) {
  return (
    typeof (toCheck === 'object') && !Array.isArray(toCheck) && toCheck !== null
  );
}

if (!getLocalStorageAuth()) {
  setLocalStorageAuth({
    isAuthed: false,
    authInfo: {},
  });
}

const authedStateFromPreviousSession = getLocalStorageAuth();

const AuthContext = React.createContext(authedStateFromPreviousSession);

let refreshAuthContext: React.Dispatch<React.SetStateAction<number>>;

export function useAuthedUser() {
  useContext(AuthContext);

  return getLocalStorageAuth() as {
    isAuthed: boolean;
    authInfo: Record<string, any>;
  };
}

export function updateAuthContext(
  obj:
    | {
        isAuthed: true;
        authInfo: Record<string, any>;
      }
    | { isAuthed: false }
) {
  const prevAuthState = getLocalStorageAuth();

  const isObjectCorrect =
    isObject(obj) &&
    (obj.isAuthed === false || (obj.isAuthed === true && 'authInfo' in obj));

  if (!isObjectCorrect) {
    throw new Error('You tried to set a bad auth context object');
  }

  setLocalStorageAuth(obj);

  const areLocalStoragesEqual =
    JSON.stringify(prevAuthState) === JSON.stringify(getLocalStorageAuth());

  if (!areLocalStoragesEqual) {
    refreshAuthContext(Math.random());
  }
}

export function AuthContextProvider({ children }) {
  const setAuthContextState = useState(1)[1];

  refreshAuthContext = setAuthContextState;

  return (
    <AuthContext.Provider value={getLocalStorageAuth()}>
      {children}
    </AuthContext.Provider>
  );
}
