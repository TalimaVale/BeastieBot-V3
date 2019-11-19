export default class BeastieTwitterClient {
  public post = async (event, streamId = 0) => {
    console.log(
      `TWITTER MOCK - post(event, streamId), event = ${event}, streamId = ${streamId}`
    );
  };
}
