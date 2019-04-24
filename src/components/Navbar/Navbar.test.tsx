import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import Navbar from "../Navbar";
import APIAccess from "../../lib/API";

describe("<Navbar />", () => {
  const wrapper = shallow(<Navbar />);

  it("should display sign in and log in buttons", () => {
    expect(wrapper.find("#login-buttons").length).toBe(1);
    expect(wrapper.find("#logout-buttons").length).toBe(0);
  });

  it("should show the menu when clicking the hamburger", async () => {
    const hamburger = wrapper.find(".navbar-burger");
    hamburger.simulate("click");

    wrapper.update();

    expect(wrapper.find(".navbar-burger").prop("className")).toContain("is-active");
    expect(
      wrapper.find(".navbar-menu").prop("className")
    ).toContain("is-active");
  });

  it("should should show the name of the user when logged in", () => {
    APIAccess.emit("loggedin", "User Name");
    wrapper.update();

    expect(wrapper.contains("User Name")).toBe(true);
    expect(wrapper.find("#login-buttons").length).toBe(0);
    expect(wrapper.find("#logout-buttons").length).toBe(1);
  });

  it("should should hide the name of the user when logged out", () => {
    const loggout = APIAccess.loggOut;
    APIAccess.loggOut = () => {
      APIAccess.emit("loggedout");
    };
    
    const wrapper = shallow(<Navbar />);
    
    APIAccess.emit("loggedin", "User Name");

    const logoutButton = wrapper.find(".logout-button");
    logoutButton.simulate("click");

    wrapper.update();

    expect(wrapper.contains("User Name")).toBe(false);
    expect(wrapper.find("#login-buttons").length).toBe(1);
    expect(wrapper.find("#logout-buttons").length).toBe(0);

    APIAccess.loggOut = loggout;
  });
});
