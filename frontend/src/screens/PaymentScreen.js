import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;
  if (!shippingAddress) {
    navigate("/shipping");
  }

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const [paymentMethod, setPaymentMethod] = useState("RazorPay");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  });

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <h1 className="text-center">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Payment Method</Form.Label>

          <Col>
            <Form.Check
              type="radio"
              label="RazorPay or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-5">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
