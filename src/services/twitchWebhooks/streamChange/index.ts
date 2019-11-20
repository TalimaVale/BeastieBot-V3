const handleStreamChange = (stream, curStreamId) => {
  const live: boolean = stream.type ? stream.type === "live" : false;
  const streamId: number = stream.id ? stream.id : 0;
  const newStream: boolean = streamId !== 0 && streamId !== curStreamId;

  return { live, streamId, newStream };
};

export default handleStreamChange;
