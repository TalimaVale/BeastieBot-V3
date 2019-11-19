export default class BeastieDiscordClient {
  public post(event) {
    console.log(`DISCORD MOCK - post(event), event = ${event}`);
  }

  public login = jest.fn(token => {
    console.log(
      `DISCORD MOCK - login = jest.fn(token, fn()), token = ${token}`
    );
  });
}
