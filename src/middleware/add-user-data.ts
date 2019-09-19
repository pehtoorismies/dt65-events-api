const fetchUser = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any,
) => {
  const {
    sub,
    mongoose: { UserModel },
  } = context;

  if (!sub) {
    return new Error('Middleware error, no sub found');
  }
  const user = await UserModel.findOne({ auth0Id: sub });
  if (!user) {
    return new Error('Middleware error. No user found in db');
  }
  
  const newContext = {
    ...context,
    user,
  };
  const result = await resolve(root, args, newContext, info);
  return result;
};

const addUserData = {
  Query: {
    // allUsers: rules.isUserReader,
    // allEvents: rules.isEventReader,
    // event: §
    me: fetchUser,
  },
  Mutation: {
    createEvent: fetchUser,
    // deleteEvent: rules.isEventWriter,
    // updateEvent: rules.isEventWriter,
    joinEvent: fetchUser,
    unjoinEvent: fetchUser,
  },
};

export default addUserData;
