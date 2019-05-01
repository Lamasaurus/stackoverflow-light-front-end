import { EventEmitter } from "events";
import buildUrl from "build-url";

import { TokenExpiredError } from "jsonwebtoken";

class APIAccess extends EventEmitter{
  private token: string = "";
  public userName: string = "";
  private userId: string = "";

  // The base address of the api
  public baseAPIAddress = `${window.location.origin}/api`;

  // Fetches data from the API and casts it to T
  public getData<T>(url: string, body: any = {}): Promise<T> {
    // Construct a url with the params from the body
    url = buildUrl(url, {
      queryParams: body
    });

    const fetchConfig = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.token
      }
    };
    const fullAddress = this.baseAPIAddress + url;

    return fetch(fullAddress, fetchConfig).then<T>(response => response.json());
  }

  public postData<T>(url: string, body: any = {}): Promise<Response> {
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token
      }
    };
    const fullAddress = this.baseAPIAddress + url;

    return fetch(fullAddress, fetchConfig);
  }

  public loggIn(userName: string, password: string): Promise<string> {
    return this.postData("/user/authenticate", { userName, password })
      .then<ITokenResponse>(response => response.json())
      .then(response => {
        this.token = response.token;
        this.userName = userName;
        this.userId = response.userId;

        this.emit("loggedin", userName);

        return this.userId;
      });
  }

  public loggOut() {
    this.token = "";
    this.userName = "";
    this.userId = "";

    this.emit("loggedout");
  }

  public getUser(): IUser {
    if (!this.userName) throw new Error("User not logged in!");

    return { userId: this.userId, userName: this.userName };
  }

  public isLoggedIn(): boolean {
    return this.token !== "";
  }
}

interface ITokenResponse {
  token: string;
  userId: string;
}

export interface IUser {
  userId: string;
  userName: string;
}



export default new APIAccess();
