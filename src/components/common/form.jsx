import { Component } from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import Input from "./input";
import Counter from "./counter";
import InputDate from "./inputDate";

class Form extends Component {
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    error.details.map((e) => (errors[e.path[0]] = e.message));
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const field = { [name]: value }; // Computed properties in ES6
    const subschema = { [name]: this.schema[name] };
    const { error } = Joi.validate(field, subschema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    // Bracket notation instead of dot notation for
    // dynamiclly accessing object property names
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleDateChange = ({ currentTarget: datePicker }) => {
    const departureDate = datePicker.value;

    this.setState({ departureDate });
  };

  handleCounterIncrement = (e) => {
    e.preventDefault();

    const counterName = e.currentTarget.name;
    const counter = { ...this.state.counter };

    if (counter[counterName] === 4) return;

    counter[counterName] += 1;
    this.setState({ counter });
  };

  handleCounterDecrement = (e) => {
    e.preventDefault();

    const counterName = e.currentTarget.name;
    const counter = { ...this.state.counter };

    if (counter[counterName] === 0) return;

    counter[counterName] -= 1;
    this.setState({ counter });
  };

  handleSearch = (e) => {
    e.preventDefault();

    this.doSearch();
  };

  renderSubmitButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        type={type}
        onChange={this.handleChange}
        value={data[name]}
        error={errors[name]}
      />
    );
  };

  renderInputDate = (name) => {
    const { departureDate } = this.state;

    return (
      <InputDate
        value={departureDate}
        name={name}
        onChange={this.handleDateChange}
      />
    );
  };

  renderPassengerCounter = (name, label) => {
    const { counter } = this.state;

    return (
      <Counter
        label={label}
        value={counter[name]}
        name={name}
        onDecrement={this.handleCounterDecrement}
        onIncrement={this.handleCounterIncrement}
      />
    );
  };

  renderSearchButton = (label) => {
    return (
      <div className="text-center my-2">
        <Link to={`/flights/${this.state.departureDate}`}>
          <button className="btn btn-primary">{label}</button>
        </Link>
      </div>
    );
  };
}

export default Form;
