import { Component } from "react";
import Container from "./Container";
import "./Results.css";

export class Results extends Component {
  constructor(props) {
    super(props);
    this.state = { results: props.data, dataRows: [] };
  }

  refreshList(data) {
    let rows = [];
    data.forEach((e) => {
      let cell = [];
      for (let i = 0; i < Object.keys(e).length - 1; i++) {
        const prop = Object.keys(e)[i];
        cell.push(
          <td className="cell" key={prop}>
            {e[prop]}
          </td>
        );
      }
      rows.push(<tr className="row" key={data.indexOf(e)}>{cell}</tr>);
    });
    this.setState({ dataRows: rows }, function () {
      // console.log(this.state.dataRows);
    });
  }

  componentDidMount() {
    this.refreshList(this.props.data);
  }
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {   
      this.refreshList(this.props.data);
    } 
}

  render() {
    if (this.state.dataRows.length === 0) {
      return null;
    } else {
      return (
        <Container>
          <h2 className="title">Rezultati</h2>
          <div className="table-container">
            <table id="table">
              <thead>
                <tr>
                  <th>Polazište</th>
                  <th>Datum</th>
                  <th>Odredište</th>
                  <th>Presjedanja</th>
                  <th>Slobodna mjesta</th>
                  <th>Valuta</th>
                  <th>Ukupna cijena</th>
                </tr>
              </thead>
              <tbody key={this.state.dataRows}>{this.state.dataRows}</tbody>
            </table>
          </div>
        </Container>
      );
    }
  }
}