import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Carousel,
  ListGroupItem,
  Form
} from "react-bootstrap";
import Rating from "../components/Rating";
import {
  listProductDetails,
  createProductReview
} from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../actions/cartActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../actions/types";
import Meta from "../components/Meta";

const ProductScreen = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  let { id } = useParams();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector(state => state.productDetails);
  const { product, error, loading } = productDetails;

  const productCreateReview = useSelector(state => state.productCreateReview);
  const {
    message: messageReview,
    success: successReview,
    error: errorReview,
    loading: loadingReview
  } = productCreateReview;

  useEffect(() => {
    if (successReview) {
      // alert("Review Added");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successReview]);

  const addToCarthandler = () => {
    // navigate(`/cart/${id}?qty=${qty}`);
    dispatch(addToCart(id, qty));
  };

  const submitHandler = e => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  console.log(window.location.origin);
  const location = window.location.origin;

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* <img src={window.location.origin + "/" + product.image} /> */}
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              {/* <Carousel variant="dark">
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={product.image}
                    alt="First slide"
                  />
                  <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={product.image}
                    alt="Second slide"
                  />

                  <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={product.image}
                    alt="Third slide"
                  />

                  <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
              </Carousel> */}
              <Image
                src={window.location.origin + "/" + product.image}
                alt={product.name}
                fluid
              />
              {/* <Image src={product.image} alt={product.name} fluid /> */}
            </Col>
            <Col md={3}>
              <Card className="card-productscreen">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                      color="pink"
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>Price: Rs {product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>Rs {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                            className="product-page-section"
                          >
                            {[...Array(product.countInStock).keys()].map(x => (
                              <>
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              </>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}

                  <ListGroup.Item className="text-center">
                    <Button
                      onClick={addToCarthandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add to cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <Card>
                {" "}
                <ListGroup variant="flush">
                  {product.reviews.map(review => (
                    <ListGroupItem key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating color="pink" value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroupItem>
                  ))}
                  <ListGroupItem>
                    <h2>Write a review</h2>
                    {/* {messageReview && (
                      <Message variant="success">{messageReview}</Message>
                    )} */}
                    {errorReview && (
                      <Message variant="danger">{errorReview}</Message>
                    )}
                    {userInfo ? (
                      <Form onSubmit={e => submitHandler(e)}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                          >
                            <option value="">Select..</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="3"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="dark">
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message variant="danger">
                        Please <Link to="/login">Login</Link> to write a review
                      </Message>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

ProductScreen.propTypes = {};

export default ProductScreen;
