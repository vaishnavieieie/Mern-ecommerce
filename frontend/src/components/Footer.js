import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

const Footer = props => {
  return (
    <footer style={{ backgroundColor: "#D7B7D6" }}>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; ShopNow</Col>
        </Row>
      </Container>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
