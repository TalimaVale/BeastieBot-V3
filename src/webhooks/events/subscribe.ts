const handleSubscription = payload => {
  const { user_name } = payload.event.data[0].event_data;
  console.log(payload);
  console.log(JSON.stringify(payload.event, null, 2));
  return `WE HAVE A SUBSCRIBER! Whoohoo! <3 Thanks for supporting our community ${user_name}! :D`;
};

export default handleSubscription;
