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
      ingresos: [],
      ingresosInput: 0,
      ingresosTotal: 0,
      showIngresosModal: false,
      showAhorrosModal: false,
      error: false,
      currency: "GBP",
      language: "en-UK",
      date: new Date().toLocaleString("default", { month: "long" }),
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitGastos = this.onSubmitGastos.bind(this);
    this.onSubmitIngresos = this.onSubmitIngresos.bind(this);
  }

  sumTotal(arr) {
    const reducer = (sum, val) => sum + Math.round(val);
    return arr.reduce(reducer, 0);
  }
  onCloseIngresos = (e) => {
    this.setState({ showIngresosModal: false });
  };

  onCloseGastos = (e) => {
    this.setState({ showGastosModal: false });
  };

  ingresosModal = (e) => {
    this.setState({ showIngresosModal: true });
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

  onSubmitIngresos = (e) => {
    const { ingresos, ingresosInput, error } = this.state;
    ingresos.push(ingresosInput);
    const total = this.sumTotal(ingresos);
    this.setState({
      showIngresosModal: false,
      ingresosTotal: total,
    });
    e.preventDefault();
  };

  render() {
    const totalCurrency = new Intl.NumberFormat(this.state.language, {
      style: "currency",
      currency: this.state.currency,
    }).format(
      this.state.ingresosTotal -
        this.state.gastosTotal -
        (10 * this.state.ingresosTotal) / 100
    );
    const ahorrosTotalCurrency = new Intl.NumberFormat(this.state.language, {
      style: "currency",
      currency: this.state.currency,
    }).format((10 * this.state.ingresosTotal) / 100);
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
                  <Button variant="purpleCustom" onClick={this.ingresosModal}>
                    Add
                  </Button>
                </Col>
              </Row>
              <hr />
              {this.state.ingresos.map((ingreso) => (
                <p id={ingreso}>
                  {new Intl.NumberFormat(this.state.language, {
                    style: "currency",
                    currency: this.state.currency,
                  }).format(ingreso)}
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
              {this.state.gastos.map((gasto) => (
                <p id={gasto}>
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
          show={this.state.showIngresosModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.onCloseIngresos}
        >
          <Modal.Body>
            <Form onSubmit={this.onSubmitIngresos}>
              <Form.Label>Add your income: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="ingresosInput"
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
