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
import { listProductDetails } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../actions/cartActions";

const ProductScreen = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  let { id } = useParams();

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch]);

  const addToCarthandler = () => {
    // navigate(`/cart/${id}?qty=${qty}`);
    dispatch(addToCart(id, qty));
  };

  const productDetails = useSelector(state => state.productDetails);
  const { product, error, loading } = productDetails;

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
        <Row>
          <Col md={6}>
            <Carousel variant="dark">
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
            </Carousel>
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
                  Description: Rs {product.description}
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
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
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
      )}
    </>
  );
};

ProductScreen.propTypes = {};

export default ProductScreen;
