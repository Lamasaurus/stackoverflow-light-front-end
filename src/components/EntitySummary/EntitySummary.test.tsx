import React from "react";
import { shallow } from "enzyme";

import APIAccess from "../../lib/API";

import EntitySummary from "./";

describe("<EntitySummary />", () => {
  it("should should show the vote total", () => {
    const wrapper = shallow(
      <EntitySummary voteTotal={3} changeVote={(value: number) => {}} />
    );

    expect(wrapper.find(".vote-total").text()).toEqual("3");
    expect(wrapper.find(".answer-total").length).toBe(0);
    expect(wrapper.find(".voting-section").length).toBe(0);
  });

  it("should show the answers if they are precent", () => {
    const wrapper = shallow(
      <EntitySummary
        voteTotal={3}
        answerTotal={2}
        changeVote={(value: number) => {}}
      />
    );

    expect(wrapper.find(".answer-total").text()).toEqual("2");
  });
});

describe("<EntitySummary /> logged in", () => {
  let isLoggedIn: () => boolean;

  beforeEach(() => {
    isLoggedIn = APIAccess.isLoggedIn;
    APIAccess.isLoggedIn = () => true;
  });

  afterEach(() => {
    APIAccess.isLoggedIn = isLoggedIn;
  });

  it("should display voting section", () => {
    const wrapper = shallow(
      <EntitySummary voteTotal={3} changeVote={(value: number) => {}} />
    );

    expect(wrapper.find(".voting-section").length).toBe(1);
  });

  it("should set upvote active when user voted on it", () => {
    const wrapper = shallow(
      <EntitySummary
        voteTotal={3}
        userVote={1}
        changeVote={(value: number) => {}}
      />
    );

    expect(wrapper.find(".up-vote.is-active").length).toBe(1);
  });

  it("should set downvote active when user voted on it", () => {
    const wrapper = shallow(
      <EntitySummary
        voteTotal={3}
        userVote={-1}
        changeVote={(value: number) => {}}
      />
    );

    expect(wrapper.find(".down-vote.is-active").length).toBe(1);
  });

  it("should make the column smaller when logged in with answers", () => {
    const wrapper = shallow(
      <EntitySummary
        voteTotal={3}
        changeVote={(value: number) => {}}
      />
    );

    expect(wrapper.find(".entity-summary.column.is-2").length).toBe(1);
  });

  it("should make the column bigger when logged in with answers", () => {
    const wrapper = shallow(
      <EntitySummary
        voteTotal={3}
        changeVote={(value: number) => {}}
        answerTotal={1}
      />
    );

    expect(wrapper.find(".entity-summary.column.is-3").length).toBe(1);
  });

  it("should invoke changeVote when vote gets made", () => {
    const wrapper = shallow(
      <EntitySummary
        voteTotal={3}
        changeVote={(value: number) => {
          expect(value == 1 || value == -1).toBe(true);
        }}
      />
    );

    wrapper.find(".up-vote").simulate("click");
    wrapper.find(".down-vote").simulate("click");
  });
});
