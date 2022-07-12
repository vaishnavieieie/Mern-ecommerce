import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../actions/types";
import axios from "axios";

const ProductEditScreen = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector(state => state.productDetails);
  const { product, error, loading } = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate
  } = productUpdate;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/");
    }
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/");
    }
    // if (!product.name) {
    //   dispatch(listProductDetails(id));
    // } else {
    if (product === {} || product._id !== id) {
      dispatch(listProductDetails(id));
      console.log(productDetails.product);
    }
    // dispatch(listProductDetails(id));
    // console.log(productDetails.product);
    else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
    // }
  }, [id, dispatch, successUpdate, product]);

  const submitHandler = e => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to update product?")) {
      dispatch(
        updateProduct({
          _id: id,
          name,
          price,
          image,
          brand,
          category,
          countInStock,
          description
        })
      );
    }
  };
  const uploadFileHandler = async e => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go back
      </Link>
      <FormContainer>
        <h1 className="justify-content-md-center text-center">Edit Product</h1>

        {/* {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>} */}

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={e => submitHandler(e)}>
            <Form.Group controlId="name" className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price" className="my-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={e => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image" className="my-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={e => setImage(e.target.value)}
              ></Form.Control>
              {/* <Form.file
                id="image-file"
                label="Choose File"
                custom
                onChange={e => uploadFileHandler(e)}
              ></Form.file> */}
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>File input</Form.Label>
                <Form.Control
                  type="file"
                  onChange={e => uploadFileHandler(e)}
                />
              </Form.Group>
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="brand" className="my-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock" className="my-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={e => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category" className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={e => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description" className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
