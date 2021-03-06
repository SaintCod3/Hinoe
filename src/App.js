import React, { Component } from "react";
import "./App.css";
import {
  Container,
  Col,
  Row,
  Navbar,
  Jumbotron,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gastos: [],
      gastosTotal: 0,
      gastosInput: 0,
      income: [],
      incomeInput: 0,
      incomeTotal: 0,
      showincomeModal: false,
      showAhorrosModal: false,
      error: false,
      currency: "GBP",
      language: "en-UK",
      date: new Date().toLocaleString("default", { month: "long" }),
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitGastos = this.onSubmitGastos.bind(this);
    this.onSubmitIncome = this.onSubmitIncome.bind(this);
  }

  sumTotal(arr) {
    const reducer = (sum, val) => sum + Math.round(val);
    return arr.reduce(reducer, 0);
  }
  onCloseIncome = (e) => {
    this.setState({ showincomeModal: false });
  };

  onCloseGastos = (e) => {
    this.setState({ showGastosModal: false });
  };

  incomeModal = (e) => {
    this.setState({ showincomeModal: true });
  };

  gastosModal = (e) => {
    this.setState({ showGastosModal: true });
  };

  onChange = (e) => {
    e.target.value == NaN
      ? this.setState({ error: true })
      : this.setState({ [e.target.name]: e.target.value });
  };

  onSubmitGastos = (e) => {
    const { gastos, gastosInput, error } = this.state;
    gastos.push(gastosInput);
    const total = this.sumTotal(gastos);
    this.setState({
      showGastosModal: false,
      gastosTotal: total,
    });
    e.preventDefault();
  };

  onSubmitIncome = (e) => {
    const { income, incomeInput, error } = this.state;
    income.push(incomeInput);
    const total = this.sumTotal(income);
    this.setState({
      showincomeModal: false,
      incomeTotal: total,
    });
    e.preventDefault();
  };

  componentDidMount() {
    localStorage.getItem("Expenses").length > 0
      ? this.setState({
          gastos: JSON.parse(localStorage.getItem("Expenses")),
        })
      : localStorage.setItem("Expenses", JSON.stringify(this.state.gastos));
    localStorage.getItem("Income").length > 0
      ? this.setState({
          income: JSON.parse(localStorage.getItem("Income")),
        })
      : localStorage.setItem("Income", JSON.stringify(this.state.income));
  }

  componentDidUpdate() {
    localStorage.setItem("Expenses", JSON.stringify(this.state.gastos));
    localStorage.setItem("Income", JSON.stringify(this.state.income));
  }

  render() {
    const totalCurrency = new Intl.NumberFormat(this.state.language, {
      style: "currency",
      currency: this.state.currency,
    }).format(
      this.state.incomeTotal -
        this.state.gastosTotal -
        (10 * this.state.incomeTotal) / 100
    );
    const ahorrosTotalCurrency = new Intl.NumberFormat(this.state.language, {
      style: "currency",
      currency: this.state.currency,
    }).format((10 * this.state.incomeTotal) / 100);
    return (
      <>
        <style type="text/css">
          {`
        .btn-purpleCustom {
          background-color: transparent;
          padding: .375rem .75rem;
          border: 1px solid #7c2be6;
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          color: #7c2be6;
          border-radius: .25rem;
        }
        .btn-purpleCustom:hover {
          padding: .375rem .75rem;
          border: 1px solid transparent;
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          border-radius: .25rem;
          background-color: #7c2be6;
          color: white;
        }
        `}
        </style>
        <Navbar bg="light" className="customBar">
          <Navbar.Brand>
            <img
              src="/logo.png"
              height="30"
              className="d-inline-block align-top"
              alt="Hinoe logo"
            />
          </Navbar.Brand>
        </Navbar>
        <Jumbotron className="customJum">
          <Container>
            <h1 className="text-center capitalize font-weight-light">
              {this.state.date}
            </h1>
            <Row className="mt-4 text-center">
              <Col>Balance: {totalCurrency}</Col>
              <Col>Saving: {ahorrosTotalCurrency}</Col>
            </Row>
          </Container>
        </Jumbotron>

        {/* Container for breakdowns of income and expenses */}
        <Container fluid="md">
          <Row>
            <Col sm="12" md="12" lg="6">
              <Row>
                <Col>
                  <h4 className="font-weight-light">Income</h4>
                </Col>
                <Col className="text-right">
                  <Button variant="purpleCustom" onClick={this.incomeModal}>
                    Add
                  </Button>
                </Col>
              </Row>
              <hr />
              {this.state.income.map((income, i) => (
                <p id={i}>
                  {new Intl.NumberFormat(this.state.language, {
                    style: "currency",
                    currency: this.state.currency,
                  }).format(income)}
                </p>
              ))}
            </Col>
            <Col sm="12" md="12" lg="6">
              <Row>
                <Col>
                  <h4 className="font-weight-light">Expenses</h4>
                </Col>
                <Col className="text-right">
                  <Button variant="purpleCustom" onClick={this.gastosModal}>
                    Add
                  </Button>
                </Col>
              </Row>
              <hr />
              {this.state.gastos.map((gasto, i) => (
                <p id={i}>
                  {new Intl.NumberFormat(this.state.language, {
                    style: "currency",
                    currency: this.state.currency,
                  }).format(gasto)}
                </p>
              ))}
            </Col>
          </Row>
        </Container>

        {/* Modals for income and expenses */}

        <Modal
          show={this.state.showincomeModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.onCloseIncome}
        >
          <Modal.Body>
            <Form onSubmit={this.onSubmitIncome}>
              <Form.Label>Add your income: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="incomeInput"
                  onChange={this.onChange}
                />
              </Form.Group>
              <Form.Group className="text-center">
                <Button variant="purpleCustom" type="submit">
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showGastosModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.onCloseGastos}
        >
          <Modal.Body>
            <Form onSubmit={this.onSubmitGastos}>
              <Form.Label>Add your expenses: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="gastosInput"
                  onChange={this.onChange}
                />
              </Form.Group>
              <Form.Group className="text-center">
                <Button variant="purpleCustom" type="submit">
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default App;
