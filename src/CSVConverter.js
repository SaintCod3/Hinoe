import React, { Component } from "react";
import { Nav } from "react-bootstrap";

class CSVConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  exportCSV() {
    let resultCSV = [];
    let values = [["Income", "Amount", "Expense", "Amount"]]; // Name for each column
    let toString = "";

    if (this.props.expenses.length === 0 || this.props.income.length === 0) {
      // Change values to No values to prevent creating an empty CSV file
      values = "No values";
    } else {
      for (let i = 0; i < this.props.income.length; i++) {
        values.push([
          this.props.income[i].name.replace(",", " "),
          this.props.income[i].value,
        ]);
      }
      for (let i = 0; i < this.props.expenses.length; i++) {
        // This will check if there isn't any more income in the row and add a blank value to maintain the format, alternatively, it will add the income and expenses in the same row
        if (this.props.income.length < this.props.expenses.length) {
          values.push(["", ""]);
          values[i + 1].push([
            this.props.expenses[i].name.replace(",", " "),
            this.props.expenses[i].value,
          ]);
        } else {
          values[i + 1].push([
            this.props.expenses[i].name.replace(",", " "),
            this.props.expenses[i].value,
          ]);
        }
      }

      for (let i = 0; i < values.length; i++) {
        resultCSV.push(values[i]);
      }
      toString = resultCSV.join("\r\n");
    }

    let blob = new Blob(
      [
        new Uint8Array([
          0xef,
          0xbb,
          0xbf,
        ]) /* UTF-8 BOM to add the currency format */,
        toString,
      ],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    let url = URL.createObjectURL(blob);
    return url;
  }
  render() {
    return (
      <a
        href={this.props.disabled === "disabled" ? "" : this.exportCSV()}
        download={"Report from " + this.props.date + ".csv"}
        className={this.props.disabled}
      >
        Export to CSV
      </a>
    );
  }
}

export default CSVConverter;
