export default class BeastieTwitchService {
  public post = (event, name) => {
    console.log(
      `TWITCH MOCK - post(event, name), event = ${event}, name = ${name}`
    );
  };

  public toggleStreamIntervals = live => {
    console.log(`TWITCH MOCK - toggleStreamIntervals(live), live = ${live}`);
  };

  public connect() {
    console.log(`TWITCH MOCK - connect()`);
  }
}
