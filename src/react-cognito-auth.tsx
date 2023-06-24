import { CognitoUser } from '@aws-amplify/auth';
import { Auth, Amplify } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { User } from './react-cognito-auth-atom';

type AmplifyConfigProps = {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  idleTime?: number;
};
const DEFAULT_IDLE_TIME = 3600000;
let IdleTimeConfigure = DEFAULT_IDLE_TIME;

const setIdleTimeConfigure = (idleTime: number) => {
  IdleTimeConfigure = idleTime;
};

export const getIdleTimeConfigure = () => {
  return IdleTimeConfigure;
};

export const ReactCognitoAuthConfig = (props: AmplifyConfigProps) => {
  Amplify.configure({
    Auth: {
      region: props.region,
      userPoolId: props.userPoolId,
      userPoolWebClientId: props.userPoolWebClientId,
      authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
  });

  setIdleTimeConfigure(props.idleTime ? props.idleTime : DEFAULT_IDLE_TIME);
};

export const signup = async (email: string, username: string, password: string): Promise<ISignUpResult> => {
  try {
    const response = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
      },
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const confirmSignup = async (username: string, code: string): Promise<any> => {
  try {
    const response = await Auth.confirmSignUp(username, code);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const login = async (username: string, password: string): Promise<User> => {
  try {
    const user = (await Auth.signIn(username, password)) as CognitoUser;
    return {
      username: user.getUsername(),
      token: user.getSignInUserSession()!.getIdToken().getJwtToken(),
      expire: user.getSignInUserSession()!.getIdToken().getExpiration(),
    };
  } catch (error: any) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await Auth.signOut();
  } catch (error: any) {
    throw error;
  }
};

export const forgotPasword = async (email: string) => {
  try {
    await Auth.forgotPassword(email);
  } catch (error) {
    throw error;
  }
}

export const currentSession = async () => {
  try {
    return await Auth.currentSession();
  } catch (error) {
    throw error;
  }
}

export const sessionIsValid = async () => {
  try {
    const response = await currentSession()
    return response?.isValid();
  } catch (error) {
    return false;
  }
}

export const getIdToken = async () => {
  try {
    const response = await currentSession()
    return response?.getIdToken();
  } catch (error) {
    return null;
  }
}


export const resetPassword = async (username: string, code: string, password: string) => {
  try {
    await Auth.forgotPasswordSubmit(username, code, password);
  } catch (error) {
    throw error;
  }
};
