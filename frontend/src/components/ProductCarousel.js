import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { listTopProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
      <Carousel variant="dark" pause="hover">
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
                  {product.name}
                  <h5>Rs {product.price}</h5>
                </Carousel.Caption>
              </>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
