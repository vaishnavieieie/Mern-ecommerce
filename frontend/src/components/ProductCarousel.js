import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { listTopProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Container, Row, Col } from "react-bootstrap";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const productTopRated = useSelector(state => state.productTopRated);
  const { loading, error, products } = productTopRated;
  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div classname="productCarousel">
      <Container fluid>
        <Row>
          {products.map(product => (
            <>
              <Col lg={4} md={6} sm={12} xs={12}>
                <Link
                  to={`/product/${product._id}`}
                  className="justify-content-md-center"
                  style={{ textDecoration: "none" }}
                >
                  <>
                    <Image
                      style={{ height: "500px", width: "400px" }}
                      src={product.image}
                      alt="First slide"
                      fluid
                    />
                    <h5 style={{ textDecoration: "none" }}>
                      {product.name}
                      <Badge
                        pill
                        bg="#D7B7D6"
                        text="light"
                        className="m-2"
                        style={{ backgroundColor: "#D7B7D6" }}
                      >
                        Rs {product.price}
                      </Badge>
                    </h5>
                  </>
                </Link>
              </Col>
            </>
          ))}
        </Row>
      </Container>
      {/* <Carousel variant="dark" pause="hover">
        {products.map(product => (
          <Carousel.Item key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="justify-content-md-center"
            >
              <>
                <Image
                  style={{ height: "500px", width: "400px" }}
                  src={product.image}
                  alt="First slide"
                  fluid
                />
                <Carousel.Caption>
                  <Badge pill bg="light" text="dark" className="m-2">
                    Rs {product.price}
                  </Badge>
                </Carousel.Caption>
              </>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel> */}
    </div>
  );
};

export default ProductCarousel;
