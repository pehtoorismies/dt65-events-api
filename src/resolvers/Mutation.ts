import * as EmailValidator from 'email-validator';
import {
  arg,
  booleanArg,
  idArg,
  inputObjectType,
  objectType,
  stringArg,
} from 'nexus';
import { assoc, findIndex, propEq, remove } from 'ramda';

import {
  createAuth0User,
  loginAuth0User,
  requestChangePasswordEmail,
  updatePreferences,
  updateProfile,
  fetchCreateEventSubscribers,
} from '../auth';
import { config } from '../config';
import { Auth0Error, NotFoundError, UserInputError } from '../errors';
import { notifyEventCreationSubscribers } from '../nofications';
import { IAuth0Profile, ISimpleUser } from '../types';
import { filterUndefined } from '../util';

const findParticipantIndex = (sub: string, participants: ISimpleUser[]) => {
  return findIndex(propEq('sub', sub))(participants);
};

export const EventInput = inputObjectType({
  name: 'EventData',
  definition(t) {
    t.string('title', { required: true });
    t.string('subtitle');
    t.boolean('race');
    t.string('type', { required: true });
    t.string('date', { required: true });
    t.boolean('exactTime', { default: false });
    t.string('description');
  },
});

const createInputError = (
  isValid: boolean,
  errorField: string,
  errorMessage: string,
): any | undefined => {
  if (!isValid) {
    return new UserInputError({
      data: {
        field: errorField,
        message: errorMessage,
      },
    });
  }
};

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'User',
      args: {
        email: stringArg({ required: true }),
        nickname: stringArg({ required: true }),
        password: stringArg({ required: true }),
        name: stringArg({ required: true }),
        registerSecret: stringArg({ required: true }),
      },
      async resolve(_, { email, nickname, password, name, registerSecret }) {
        // Check input
        const errRegisterSecret = createInputError(
          config.registerSecret === registerSecret,
          'registerSecret',
          'Väärä rekisteröintikoodi',
        );
        if (errRegisterSecret) {
          return errRegisterSecret;
        }
        const errEmail = createInputError(
          EmailValidator.validate(email),
          'email',
          'Email väärässä muodossa',
        );
        if (errEmail) {
          return errEmail;
        }
        const errUsername = createInputError(
          !!nickname,
          'nickname',
          'Nick puuttuu',
        );
        if (errUsername) {
          return errUsername;
        }
        const errPassword = createInputError(
          !!password,
          'password',
          'Salasana puuttuu',
        );
        if (errPassword) {
          return errPassword;
        }
        try {
          const createdUser = await createAuth0User({
            email,
            nickname,
            password,
            name,
          });
          console.log('Created user');
          return createdUser;
        } catch (error) {
          console.error(error);
          return new Auth0Error({
            data: {
              message: error.message,
              internalData: {
                error,
              },
            },
          });
        }
      },
    });

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      async resolve(_, { email, password }) {
        if (!email) {
          throw new UserInputError({
            data: {
              field: 'usernameOrEmail',
              message: 'Käyttäjätunnus puuttuu',
            },
          });
        }

        try {
          const tokens = await loginAuth0User(email, password);
          return tokens;
        } catch (error) {
          return new Auth0Error({
            data: {
              message: 'Kirjautumisvirhe',
              internalData: {
                error,
              },
            },
          });
        }
      },
    });

    t.field('forgotPassword', {
      type: 'Boolean',
      args: {
        email: stringArg({ required: true }),
      },
      async resolve(_, { email }, { mongoose }) {
        if (!email) {
          throw new UserInputError({
            data: {
              field: 'email',
              message: 'Sähköposti puuttuu',
            },
          });
        }
        // fire and forget
        requestChangePasswordEmail(email);

        return true;
      },
    });

    t.field('updateMe', {
      type: 'User',
      args: {
        name: stringArg({ required: false }),
        nickname: stringArg({ required: false }),
      },
      async resolve(
        _,
        { name, nickname },
        { mongoose, sub, nickname: currentNickname },
      ) {
        const { EventModel } = mongoose;
        const updatetable = filterUndefined({
          name,
          nickname,
        });

        const auth0User: IAuth0Profile = await updateProfile(sub, updatetable);
        console.log(`current: ${currentNickname} - updated: ${nickname}`);
        if (!nickname || currentNickname === nickname) {
          return auth0User;
        }
        console.log(`Update all events to: ${nickname}`);
        // // update events
        await EventModel.updateMany(
          { 'participants.sub': sub },
          { $set: { 'participants.$.nickname': nickname } },
          { multi: true, upsert: false },
        );
        await EventModel.updateMany(
          { 'creator.sub': sub },
          { $set: { 'creator.nickname': nickname } },
          { multi: true, upsert: false },
        );
        return auth0User;
      },
    });

    t.field('updateMyPreferences', {
      type: 'User',
      args: {
        subscribeEventCreationEmail: booleanArg({ required: true }),
        subscribeWeeklyEmail: booleanArg({ required: true }),
      },
      async resolve(
        _,
        { subscribeEventCreationEmail, subscribeWeeklyEmail },
        { sub },
      ) {
        const auth0User: IAuth0Profile = await updatePreferences(sub, {
          subscribeEventCreationEmail,
          subscribeWeeklyEmail,
        });
        return auth0User;
      },
    });

    t.field('createEvent', {
      type: 'Event',
      args: {
        event: arg({ type: EventInput, required: true }),
        addMe: booleanArg({ default: false }),
        notifySubscribers: booleanArg({ default: true }),
      },
      async resolve(
        _,
        { addMe, event, notifySubscribers },
        {
          mongoose,
          sub,
          nickname,
        }: { mongoose: any; sub: string; nickname: string },
      ) {
        const { EventModel } = mongoose;

        const user = {
          sub,
          nickname,
        };

        const eventWithCreator = {
          ...event,
          creator: user,
        };

        const withMe = addMe
          ? assoc('participants', [user], eventWithCreator)
          : eventWithCreator;

        const createdEvent = await EventModel.create(withMe);

        if (notifySubscribers) {
          const subscribedUsers = await fetchCreateEventSubscribers();
          notifyEventCreationSubscribers(subscribedUsers, createdEvent);
        }

        return createdEvent;
      },
    });

    t.field('updateEvent', {
      type: 'Event',
      args: {
        id: idArg({ required: true }),
        event: EventInput,
      },
      async resolve(_, { event, id }, { mongoose }) {
        const { EventModel } = mongoose;
        const conditions = { _id: id };
        const update = event;
        const options = {
          new: true,
        };

        const res = await EventModel.findOneAndUpdate(
          conditions,
          update,
          options,
        );
        return res;
      },
    });

    t.field('deleteEvent', {
      type: 'IDPayload',
      args: {
        id: idArg({ required: true }),
      },
      async resolve(_, { id }, { mongoose }) {
        const { EventModel } = mongoose;
        const res = await EventModel.deleteOne({ _id: id });

        const { deletedCount } = res;
        if (deletedCount === 1) {
          return { id };
        }
        return new NotFoundError({
          message: `Delete failed. Event with id ${id} not found`,
        });
      },
    });

    t.field('toggleJoinEvent', {
      type: 'Event',
      args: {
        id: idArg({ required: true }),
      },
      resolve: async (_, { id }, { mongoose, sub, nickname }) => {
        const { EventModel } = mongoose;
        const evt = await EventModel.findById(id);

        if (!evt) {
          return new NotFoundError({
            message: `Event with id ${id} not found`,
          });
        }

        const user = {
          sub,
          nickname,
        };

        const partIndex = findParticipantIndex(user.sub, evt.participants);

        const isAlreadyParticipating = partIndex >= 0;
        if (isAlreadyParticipating) {
          const reducedParts = remove(partIndex, 1, evt.participants);
          evt.participants = reducedParts;
          const updated = await evt.save();
          return updated;
        } else {
          evt.participants.push(user);
          const updated = await evt.save();
          return updated;
        }
      },
    });
  },
});
