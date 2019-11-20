export const getStream = async () => {
  console.log("UTILS MOCK - getStream()");
  return {
    data: [
      {
        id: 1,
        type: "live"
      }
    ]
  };
};

export const getUser = async () => {
  console.log("UTILS MOCK - getUser()");
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
