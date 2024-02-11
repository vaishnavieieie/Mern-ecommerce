import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import { listProducts } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Image } from "react-bootstrap";

const HomeScreen = props => {
  const dispatch = useDispatch();

  const { keyword } = useParams();
  const pageNumber = useParams().pageNumber || 1;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const productList = useSelector(state => state.productList);
  const { loading, products, error, page, pages } = productList;

  return (
    <>
      <Meta />
      {!keyword ? (
        <div className="my-5">
          <h1>
            Top Rated{" "}
            <i class="fa-solid fa-star" style={{ color: "#d7b7d6" }}></i>
          </h1>
          <ProductCarousel />
        </div>
      ) : (
        <Link to="/" className="btn btn-light my-2">
          <i
            className="fa-solid fa-arrow-left m-2"
            style={{ color: "#d7b7d6" }}
          ></i>
          Go Back
        </Link>
      )}
      <h1>
        Latest Products{" "}
        <i class="fa-solid fa-shirt" style={{ color: "#d7b7d6" }}></i>
      </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products Found for "{keyword}"</Message>
      ) : (
        <div className="mb-5">
          <Row>
            {products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </div>
      )}
    </>
  );
};

HomeScreen.propTypes = {};

export default HomeScreen;
