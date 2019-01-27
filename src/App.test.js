import React from "react";
import App from "./App";
import { mount, shallow } from "enzyme";

describe("<App>", () => {
  it("App file existence check ", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });

  it("Book empty count header check", () => {
    const wrapper = shallow(<App />);
    const text = wrapper.find("h2").at(0).text();
    expect(text).toEqual("0 Books");
  });

  it("DisplayBooks state check", () => {
    const form = shallow(<App />);
    expect(form.state("displayBooks")).toEqual([]);
  });

  it("Book search input box check", () => {
    const form = mount(<App />);
    const input = form.find("input").at(0);
    input.value = "start wars";
    expect(input.value).toEqual("start wars");
  });

  it("Books default search input state check", () => {
    const form = shallow(<App />);
    expect(form.state("searchInput")).toEqual("");
  });

  it("BooksList default state check", () => {
    const form = shallow(<App />);
    expect(form.state("booksList")).toEqual([]);
  });

});
