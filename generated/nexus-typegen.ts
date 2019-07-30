/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as ctx from "../src/types"
import * as photon from "@generated/photon"
import { core } from "nexus"

declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  EventWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  UserWhereUniqueInput: { // input type
    email?: string | null; // String
    id?: string | null; // ID
    username?: string | null; // String
  }
}

export interface NexusGenEnums {
  EventType: photon.EventType
}

export interface NexusGenRootTypes {
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Event: photon.Event;
  Mutation: {};
  Query: {};
  User: photon.User;
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  EventWhereUniqueInput: NexusGenInputs['EventWhereUniqueInput'];
  UserWhereUniqueInput: NexusGenInputs['UserWhereUniqueInput'];
  EventType: NexusGenEnums['EventType'];
}

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Event: { // field return type
    address: string | null; // String
    createdAt: any; // DateTime!
    date: any; // DateTime!
    description: string | null; // String
    id: string; // ID!
    participants: NexusGenRootTypes['User'][] | null; // [User!]
    race: boolean; // Boolean!
    subtitle: string; // String!
    time: string | null; // String
    title: string; // String!
    type: NexusGenEnums['EventType']; // EventType!
    updatedAt: any; // DateTime!
  }
  Mutation: { // field return type
    login: NexusGenRootTypes['AuthPayload']; // AuthPayload!
  }
  Query: { // field return type
    allEvents: NexusGenRootTypes['Event'][] | null; // [Event!]
    allUsers: NexusGenRootTypes['User'][] | null; // [User!]
    event: NexusGenRootTypes['Event'] | null; // Event
    user: NexusGenRootTypes['User'] | null; // User
  }
  User: { // field return type
    email: string; // String!
    events: NexusGenRootTypes['Event'][] | null; // [Event!]
    id: string; // ID!
    name: string | null; // String
    username: string; // String!
  }
}

export interface NexusGenArgTypes {
  Event: {
    participants: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    login: { // args
      password?: string | null; // String
      username?: string | null; // String
    }
  }
  Query: {
    allEvents: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    allUsers: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    event: { // args
      where: NexusGenInputs['EventWhereUniqueInput']; // EventWhereUniqueInput!
    }
    user: { // args
      where: NexusGenInputs['UserWhereUniqueInput']; // UserWhereUniqueInput!
    }
  }
  User: {
    events: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthPayload" | "Event" | "Mutation" | "Query" | "User";

export type NexusGenInputNames = "EventWhereUniqueInput" | "UserWhereUniqueInput";

export type NexusGenEnumNames = "EventType";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: ctx.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}