import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Form,
  Button,
  Card,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Product from "../components/Product";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);

  const { cartItems, error } = cart;

  const removeFromCartHandler = id => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = id => {
    console.log("Checkout");
    navigate("/login?redirect=/shipping");
  };
  return (
    <>
      {" "}
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={8}>
          <h1>Shopping cart</h1>
          {cartItems.length === 0 ? (
            <Message>Your cart is empty:(</Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroupItem key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/product/${item.product}`}
                        style={{ textDecoration: "none" }}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>Rs {item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        style={{ width: "100px" }}
                        as="select"
                        value={item.qty}
                        onChange={e =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                        className="product-page-section"
                      >
                        {[...Array(item.countInStock).keys()].map(x => (
                          <>
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          </>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <button
                        className="ms-3 btn btn-outline-primary"
                        type="button"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush" className="text-center">
              <ListGroupItem>
                <h4 style={{ color: "#5a5a5a" }}>
                  SUBTOTAL ({cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
                  ) ITEMS
                </h4>
                Rs{" "}
                {cartItems.reduce(
                  (acc, curr) => acc + curr.price * curr.qty,
                  0
                )}
              </ListGroupItem>
              <ListGroupItem>
                <button
                  style={{ width: "100%" }}
                  className="btn btn-primary"
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
