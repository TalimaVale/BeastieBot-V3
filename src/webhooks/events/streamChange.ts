const handleStreamChange = payload => {
  console.log(payload);
  console.log(JSON.stringify(payload.event, null, 2));

  return `Our stream info has changed! :O`;
};

export default handleStreamChange;

// when stream changes, update beastie.state.isStreaming
