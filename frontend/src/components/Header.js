import React from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";

const Header = props => {
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const navigate = useNavigate();
  const { userInfo } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <header>
      <Navbar bg="light" data-bs-theme="light" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            {/* <Navbar.Brand>
              <h2 style={{ color: "white" }}>ShopNow</h2>
            </Navbar.Brand> */}
            <Navbar.Brand href="#home">
              <img
                src="../images/logo_shopnow.png"
                width="350"
                height="50"
                className=""
                alt="React Bootstrap logo"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <>
              <Routes>
                <Route
                  render={({ history }) => <SearchBox history={history} />}
                />
              </Routes>
            </> */}
            <SearchBox />
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  {" "}
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link href="/login">
                    {" "}
                    <i className="fas fa-user"></i> Sign-In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin access" id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

Header.propTypes = {};

export default Header;
