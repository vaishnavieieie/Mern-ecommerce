import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = () => {
  const cart = useSelector(state => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Calculate prices
  const addDecimal = num => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  const itemsPrice = addDecimal(
    Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
  );

  const shippingPrice = Number(itemsPrice > 250 ? 0 : 100);

  const taxPrice = addDecimal(Number((itemsPrice * 0.05).toFixed(2)));

  const totalPrice = addDecimal(
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
  );
  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
    if (success) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, cart]);
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice
      })
    );
  };
  return (
    <>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 step4 />
      </FormContainer>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your Cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item.product}`}
                            style={{ textDecoration: "none" }}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X Rs {item.price} = Rs{" "}
                          {item.price * item.qty}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs {itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col
                    style={
                      shippingPrice != 0
                        ? { textDecoration: "none" }
                        : { textDecoration: "line-through" }
                    }
                  >
                    Shipping
                  </Col>
                  <Col>Rs {shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs {taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs {totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
