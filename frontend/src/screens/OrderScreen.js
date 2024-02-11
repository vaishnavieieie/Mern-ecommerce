import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import axios from "axios";
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from "../actions/types";
import { deliverOrder } from "../actions/orderActions";

const OrderScreen = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userInfo = useSelector(state => state.userLogin.userInfo);

  const { id } = useParams();

  const orderDetails = useSelector(state => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const {
    error: errorPay,
    success: successPay,
    loading: loadingPay
  } = orderPay;

  const orderDeliver = useSelector(state => state.orderDeliver);
  const {
    error: errorDeliver,
    success: successDeliver,
    loading: loadingDeliver
  } = orderDeliver;

  const loadScript = () => {
    console.log("script loaded");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = async () => {
      try {
        const result = await axios.post(
          "/api/orders/payment/create",
          {
            amount: order.totalPrice * 100
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );

        const { amount, id: order_id, currency } = result.data;
        console.log("hello", result.data);
        const razorpayKey = await axios.get("/api/config/razorpay");
        console.log(razorpayKey.data);
        console.log("hello", id);
        const options = {
          key: razorpayKey.data,
          amount: amount.toString(),
          currency: "INR",
          name: "Miss. example",
          description: "example",
          order_id: order_id,
          handler: async function(response) {
            const result = await axios.post(
              `/api/orders/payment/${id}/pay`,
              {
                amount: amount,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo.token}`
                }
              }
            );
            alert("Payment done: ", response.razorpay_payment_id);
            dispatch(payOrder(result));
          },
          prefill: {
            name: "example.name",
            email: "example@gmail.com",
            contact: "1111111111"
          },
          notes: {
            address: ",kdkc,"
          },
          theme: {
            color: "#80c0f0"
          }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function(response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
        paymentObject.open();
      } catch (error) {}
    };
    script.onerror = () => {
      alert("Razorpay SDK failed to load:(");
    };
    document.body.appendChild(script);
  };

  // const displayRazorpay = async  => {
  //   const res = await loadScript(
  //     "https://checkout.razorpay.com/v1/checkout.js"
  //   );
  //   console.log(res);
  //   if (!res) {
  //     alert("You are offline...failed to load Razorpay sdk");
  //     return;
  //   }

  //   const options = {
  //     key: "rzp_test_ruAsDs06lHrWTB",
  //     currency: "INR",
  //     amount: amount * 100,
  //     name: "ShopNow",
  //     description: "Thank u :)",
  //     image: "",
  //     handler: function(response) {
  //       alert(response.razorpay_payment_id);
  //       alert("payment done ;)");
  //       console.log(response);
  //     },
  //     prefill: {
  //       name: "ShopNow"
  //     }
  //   };
  //   const paymentObject = new window.Razorpay(options);
  //   paymentObject.open();
  // };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    console.log(order.isPaid, order.user, userInfo._id);
    if (!order || order._id !== id || successPay || successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, successPay, order, successDeliver, userInfo]);

  const successPaymentHandler = paymentResult => {
    console.log(paymentResult);
    dispatch(payOrder(id, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}{" "}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>

              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your Cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={window.location.origin + "/" + item.image}
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
                  <Col>Rs {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col
                    style={
                      order.shippingPrice != 0
                        ? { textDecoration: "none" }
                        : { textDecoration: "line-through" }
                    }
                  >
                    Shipping
                  </Col>
                  <Col>Rs {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}
              {order && !order.isPaid && order.user._id === userInfo._id && (
                <ListGroup.Item>
                  {/* {loadingPay && <Loader />} */}
                  {/* {!sdkReady ? (
                    <Loader />
                  ) : (
                    <Button
                      type="button"
                      onClick={() => displayRazorpay(order.totalPrice)}
                    >
                      ORDER
                    </Button>
                  )} */}
                  <Button type="button" onClick={loadScript}>
                    ORDER
                  </Button>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button type="button" onClick={deliverHandler}>
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
