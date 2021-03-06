export interface AuthConfig {
  domain: string;
  clientId: string;
  clientSecret: string;
  jwtAudience: string;
}

export interface IMailRecipient {
  email: string;
  name: string;
}

export interface IMailgunConfig {
  apiKey: string;
  domain: string;
  fromMail: string;
  host: string;
}

export interface ISimpleUser {
  id: string;
  username?: string;
  nickname: string;
  sub: string;
}

interface IAuth0Response {
  error?: {
    name: string;
    message: string;
    statusCode: number;
  };
}

export interface IEventType {
  id: string;
  title: string;
}

export interface IAuth0RegisterResponse extends IAuth0Response {
  auth0UserId?: string | number;
}

export interface IAuth0LoginResponse extends IAuth0Response {
  user?: {
    accessToken: string;
    idToken: string;
    expiresIn: number;
  };
}

export interface IKeyValuePair {
  key: string;
  value: string;
}

export interface IEventEmailOptions {
  title: string;
  type: string;
  typeHeader: string;
  date: string;
  eventUrl: string;
  preferencesUrl: string;
  creator: string;
  description: string;
}

export interface IWeeklyOptions extends IEventEmailOptions {
  weekDay: string;
  participantCount: number;
  subtitle: string;
}
export interface IWeeklyEmailOptions {
  eventOptions: IWeeklyOptions[];
  preferencesUrl: string;
}

export interface IEmailTemplate {
  plainText: string;
  mjmlText: string;
}

export interface IAuth0User {
  email: string;
  nickname: string;
  password: string;
  name: string;
}

export interface IPreferences {
  subscribeEventCreationEmail: boolean;
  subscribeWeeklyEmail: boolean;
}

export interface IAuth0Profile {
  id: string;
  email: string;
  username: string;
  nickname: string;
  name: string;
  picture: string;
  createdAt: string;
  updatedAt?: string;
  preferences: IPreferences;
}

export interface IAuth0ProfileUpdate {
  name?: string | null;
  username?: string | null;
  nickname?: string | null;
}

export interface IAuth0UserMetaData {
  subscribeEventCreationEmail: string;
  subscribeWeeklyEmail: string;
}

export interface IAuth0UserBasic {
  name: string;
  email: string;
  nickname: string;
}
