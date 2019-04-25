import React from "react";
import { shallow } from "enzyme";
import SignInPage from ".";
import APIAccess from "../../lib/API";
import { Redirect } from "react-router";

describe("<SignInPage />", () => {
  it("should be able to sign up", () => {
    fetch.mockResponseOnce(JSON.stringify({}));

    const wrapper = shallow(<SignInPage />);

    wrapper
      .find("#user-name-input")
      .simulate("change", { target: { value: "User" } });

    wrapper
      .find("#password-input")
      .simulate("change", { target: { value: "pwd" } });

    wrapper.find("#register-button").simulate("click");

    const fetchBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(fetchBody).toEqual({userName: "User", password: "pwd"});
  });

  it("should be able to sign up", () => {
    fetch.mockResponseOnce(JSON.stringify({ token: "TOKEN", userId: "userId" }));

    const wrapper = shallow(<SignInPage />);

    wrapper
      .find("#user-name-input")
      .simulate("change", { target: { value: "User" } });

    wrapper
      .find("#password-input")
      .simulate("change", { target: { value: "pwd" } });

    wrapper.find("#login-button").simulate("click");

    const fetchBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(fetchBody).toEqual({userName: "User", password: "pwd"});
  });

  it("should redirect when already logged in", () => {
    APIAccess.isLoggedIn = jest.fn(() => true);

    const wrapper = shallow(<SignInPage />);
    expect(wrapper.find(Redirect).prop("to")).toEqual("/");

    APIAccess.isLoggedIn.mockRestore();
  })
});
