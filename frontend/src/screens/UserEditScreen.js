import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { register } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../actions/types";

const UserEditScreen = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdate = useSelector(state => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== id) {
        dispatch(getUserDetails(id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [id, dispatch, user, successUpdate]);

  const submitHandler = e => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to update user?")) {
      dispatch(updateUser({ _id: id, name, email, isAdmin }));
    }
  };

  return (
    <>
      <Link to="admin/userlist" className="btn btn-light my-3">
        Go back
      </Link>
      <FormContainer>
        <h1 className="justify-content-md-center text-center">Edit User</h1>

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
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="abc@sample.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="admin" className="my-3">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
              ></Form.Check>
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

export default UserEditScreen;
