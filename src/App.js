import React, { Component } from "react";
import "./App.css";
import {
  Container,
  Col,
  Row,
  Nav,
  Navbar,
  NavDropdown,
  Jumbotron,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CSVConverter from "./CSVConverter";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gastos: [],
      gastosTotal: 0,
      gastosInput: 0,
      gastoNameInput: "",
      income: [],
      incomeInput: 0,
      incomeTotal: 0,
      incomeNameInput: "",
      saving: 10,
      showincomeModal: false,
      showAhorrosModal: false,
      errors: false,
      disabled: false,
      currency: "GBP",
      language: "en-GB",
      date: new Date().toLocaleString("default", { month: "long" }),
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onSubmitGastos = this.onSubmitGastos.bind(this);
    this.onSubmitIncome = this.onSubmitIncome.bind(this);
    this.onChangeGastosInput = this.onChangeGastosInput.bind(this);
    this.onChangeIncomeInput = this.onChangeIncomeInput.bind(this);
    this.onChangeSaving = this.onChangeSaving.bind(this);
  }

  sumTotal(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      total += parseInt(arr[i].value);
    }
    return total;
  }

  onCloseIncome = (e) => {
    this.setState({
      showincomeModal: false,
      incomeInput: 0,
      incomeNameInput: "",
    });
  };

  onCloseGastos = (e) => {
    this.setState({
      showGastosModal: false,
      gastosInput: 0,
      gastoNameInput: "",
    });
  };

  incomeModal = (e) => {
    this.setState({ showincomeModal: true });
  };

  gastosModal = (e) => {
    this.setState({ showGastosModal: true });
  };

  // Validate that the input for the values are either decimal or an integer number
  onChangeGastosInput = (e) => {
    const regex = /^\d*\.?\d*$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      this.setState({ gastosInput: e.target.value });
    } else {
      this.setState({ gastosInput: 0 });
    }
  };
  // Validate that the input for the values are either decimal or an integer number
  onChangeIncomeInput = (e) => {
    const regex = /^\d*\.?\d*$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      this.setState({ incomeInput: e.target.value });
    } else {
      this.setState({ incomeInput: 0 });
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: false,
    });
  };
  onChangeSaving = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onChangeCurrency = (e) => {
    if (e.target.value === "GBP") {
      this.setState({
        [e.target.name]: e.target.value,
        language: "en-GB",
      });
    } else if (e.target.value === "EUR") {
      this.setState({
        [e.target.name]: e.target.value,
        language: "de-DE",
      });
    } else {
      this.setState({
        currency: "USD",
        language: "en-US",
      });
    }
  };
  onReset = (e) => {
    localStorage.clear();
    window.location.reload(false);
  };

  onSubmitGastos = (e) => {
    const { gastoNameInput, gastosInput, gastos } = this.state;
    const newGasto = {
      name: gastoNameInput,
      value: gastosInput,
    };
    gastos.push(newGasto);
    const total = this.sumTotal(gastos);
    this.setState({
      gastosInput: 0,
      gastoNameInput: "",
      showGastosModal: false,
      gastosTotal: total,
    });
    e.preventDefault();
  };

  onSubmitIncome = (e) => {
    const { income, incomeInput, incomeNameInput } = this.state;
    const newIncome = {
      name: incomeNameInput,
      value: incomeInput,
    };
    income.push(newIncome);
    const total = this.sumTotal(income);
    this.setState({
      incomeInput: 0,
      incomeNameInput: "",
      showincomeModal: false,
      incomeTotal: total,
    });

    e.preventDefault();
  };

  componentDidMount() {
    localStorage.getItem("Expenses")
      ? this.setState({
          gastos: JSON.parse(localStorage.getItem("Expenses")),
          gastosTotal: this.sumTotal(
            JSON.parse(localStorage.getItem("Expenses"))
          ),
        })
      : localStorage.setItem("Expenses", JSON.stringify(this.state.gastos));
    localStorage.getItem("Income")
      ? this.setState({
          income: JSON.parse(localStorage.getItem("Income")),
          incomeTotal: this.sumTotal(
            JSON.parse(localStorage.getItem("Income"))
          ),
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
        (this.state.saving * this.state.incomeTotal) / 100
    );
    const ahorrosTotalCurrency = new Intl.NumberFormat(this.state.language, {
      style: "currency",
      currency: this.state.currency,
    }).format((this.state.saving * this.state.incomeTotal) / 100);

    const ahorroYear = new Intl.NumberFormat(this.state.language, {
      style: "currency",
      currency: this.state.currency,
    }).format(((this.state.saving * this.state.incomeTotal) / 100) * 12);

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
              <Col>
                Monthly Balance: <p>{totalCurrency}</p>
              </Col>
              <Col>
                Monthly saving: <p>{ahorrosTotalCurrency}</p>
              </Col>
              <Col>
                Annual saving: <p>{ahorroYear}</p>
              </Col>
            </Row>
          </Container>
        </Jumbotron>

        {/* Container for breakdowns of income and expenses */}
        <Container>
          <Tabs defaultActiveKey="main">
            <Tab eventKey="main" title="Main" className="mt-4">
              <Row>
                <Col sm="12" md="12" lg="6" className="mb-4">
                  <Row>
                    <Col>
                      <h4 className="font-weight-light capitalize">Income</h4>
                    </Col>
                    <Col className="text-right">
                      <Button variant="purpleCustom" onClick={this.incomeModal}>
                        Add
                      </Button>
                    </Col>
                  </Row>
                  <hr />
                  {this.state.income.map((income, i) => (
                    <Row>
                      <Col>{income.name}</Col>
                      <Col className="text-right">
                        <p id={i}>
                          {new Intl.NumberFormat(this.state.language, {
                            style: "currency",
                            currency: this.state.currency,
                          }).format(income.value)}
                        </p>
                      </Col>
                    </Row>
                  ))}
                </Col>
                <Col sm="12" md="12" lg="6" className="mb-4">
                  <Row>
                    <Col>
                      <h4 className="font-weight-light capitalize">Expenses</h4>
                    </Col>
                    <Col className="text-right">
                      <Button variant="purpleCustom" onClick={this.gastosModal}>
                        Add
                      </Button>
                    </Col>
                  </Row>
                  <hr />
                  {this.state.gastos.map((gasto, i) => (
                    <Row>
                      <Col>{gasto.name}</Col>
                      <Col className="text-right">
                        <p id={i}>
                          {new Intl.NumberFormat(this.state.language, {
                            style: "currency",
                            currency: this.state.currency,
                          }).format(gasto.value)}
                        </p>
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>
            </Tab>

            {/* Export Options */}
            <Tab eventKey="export" title="Export" className="mt-4 mb-4">
              <h4 className="font-weight-light">Export options</h4>
              <hr />
              <p className="helper">
                Please note that this option will remain disabled if there is no
                data.
              </p>
              <CSVConverter
                income={this.state.income}
                expenses={this.state.gastos}
                date={this.state.date}
                disabled={
                  this.state.gastos.length === 0 ||
                  this.state.income.length === 0
                    ? "disabled"
                    : ""
                }
                currency={this.state.currency}
                language={this.state.language}
              />
            </Tab>

            {/*Settings of the site*/}
            <Tab eventKey="settings" title="Settings" className="mt-4 mb-4">
              <h4 className="font-weight-light">Site Settings</h4>
              <hr />
              <Form>
                <Form.Label>Currency</Form.Label>
                <Form.Group>
                  <Form.Control
                    as="select"
                    size="sm"
                    name="currency"
                    onChange={this.onChangeCurrency}
                  >
                    <option value="GBP">£ - British pound sterling</option>
                    <option value="EUR">€ - Euro</option>
                    <option value="USD">$ - US Dollar</option>
                  </Form.Control>
                </Form.Group>
                <Form.Label>Saving %</Form.Label>
                <Form.Group>
                  <Form.Control
                    as="select"
                    size="sm"
                    name="saving"
                    onChange={this.onChangeSaving}
                  >
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </Form.Control>
                </Form.Group>
              </Form>
              <h4 className="font-weight-light">Data</h4>
              <hr />
              <p className="helper">
                Please note that by performing this action, all the data that
                was entered will be erased.
              </p>
              <Button
                variant="purpleCustom"
                type="submit"
                onClick={this.onReset}
              >
                Clear all data
              </Button>
            </Tab>

            {/* Information tab */}
            <Tab eventKey="info" title="Contact" className="mt-4 text-center">
              <h4 className="font-weight-light">Contact Information</h4>
              <hr />
              <p>
                If you would like to connect or if you are experiencing issues,
                please feel free to contact me.
              </p>
              <p>
                <a
                  href="https://github.com/SaintCod3"
                  rel="noopener"
                  target="_blank"
                >
                  GitHub
                </a>{" "}
                |{" "}
                <a
                  href="https://www.linkedin.com/in/antoniodamianmartinatencia/"
                  rel="noopener"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </p>
            </Tab>
          </Tabs>
        </Container>

        {/* Modals for income and expenses */}

        <Modal
          show={this.state.showincomeModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.onCloseIncome}
        >
          <Modal.Header>
            <Modal.Title>Income</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.onSubmitIncome}>
              <Form.Label>Name: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="incomeNameInput"
                  onChange={this.onChange}
                />
              </Form.Group>
              <Form.Label>Amount: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={this.state.incomeInput}
                  name="incomeInput"
                  onChange={this.onChangeIncomeInput}
                />
                <Form.Text className="text-muted">
                  Use the following format 1000.00
                </Form.Text>
              </Form.Group>
              <Form.Group className="text-center">
                <Button variant="purpleCustom" type="submit">
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modal for expenses */}

        <Modal
          show={this.state.showGastosModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.onCloseGastos}
        >
          <Modal.Header>
            <Modal.Title>Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.onSubmitGastos}>
              <Form.Label>Name: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="gastoNameInput"
                  onChange={this.onChange}
                />
              </Form.Group>
              <Form.Label>Amount: </Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="gastosInput"
                  value={this.state.gastosInput}
                  onChange={this.onChangeGastosInput}
                />
                <Form.Text className="text-muted">
                  Use the following format 1000.00
                </Form.Text>
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
