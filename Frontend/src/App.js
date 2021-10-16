import React, { Component } from "react";
import Container from "./components/Container";
import Filter from "./components/Filter";
import {Results} from "./components/Results";
import "./App.css";

export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super(props);
    this.state = {
      flightData: [],
    };
  }

  filterHandler = (data) => {
    this.setState({ flightData: data });
    console.log(this.state.flightData);
  };

  render() {
    return (
      <div className="main">
        <Container>
          <h2 className="title">Odaberite parametre pretrage</h2>
          <Filter onFilter={this.filterHandler} />
        </Container>
        <Results key={this.state.flightData} data={this.state.flightData}/>
      </div>
    );
  }
}
