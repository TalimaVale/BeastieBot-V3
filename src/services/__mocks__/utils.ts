export const getBroadcasterStream = async () => {
  console.log("UTILS MOCK - getBroadcasterStream()");
  return {
    data: [
      {
        id: 1,
        type: "live"
      }
    ]
  };
};

export const getBroadcaster = async () => {
  console.log("UTILS MOCK - getBroadcaster()");
  return {
    data: [
      {
        id: 1,
        display_name: "Tiffany"
      }
    ]
  };
};

export const getChatroomViewers = async () => {
  console.log("UTILS MOCK - getChatroomViewers()");
  return {};
};
