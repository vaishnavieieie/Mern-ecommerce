import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listProducts,
  deleteProduct,
  createProduct
} from "../actions/productActions";
import { PRODUCT_DELETE_RESET, PRODUCT_CREATE_RESET } from "../actions/types";
import Paginate from "../components/Paginate";

const ProductListScreen = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const pageNumber = useParams().pageNumber || 1;

  const productList = useSelector(state => state.productList);
  const { products, loading, error, page, pages } = productList;

  const productDelete = useSelector(state => state.productDelete);
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete
  } = productDelete;

  const productCreate = useSelector(state => state.productCreate);
  const {
    product: createdProduct,
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate
  } = productCreate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo && !userInfo.isAdmin) {
      navigate("/");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
  }, [
    dispatch,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber
  ]);

  const deleteHandler = id => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };
  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className="text-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <td>ID</td>
                <td>NAME</td>
                <td>PRICE</td>
                <td>CATEGORY</td>
                <td>BRAND</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>Rs {product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    {
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit" />
                        </Button>
                      </LinkContainer>
                    }
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
