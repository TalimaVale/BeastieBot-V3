const handleFollow = payload => {
  const { from_name } = payload.event.data[0];
  return `Welcome to the team ${from_name}! Awesome to have you join us! :D`;
};

export default handleFollow;
