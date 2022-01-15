export default class User {
  username: string; // users have a unique username, so the username serves as an unique identifier
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
