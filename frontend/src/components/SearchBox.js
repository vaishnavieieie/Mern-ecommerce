import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Image } from "react-bootstrap";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const submitHandler = e => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate("/");
    }
  };
  return (
    <Form onSubmit={submitHandler} inline className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search Products"
        className="mr-sm-2 ml-sm-5 rounded"
      ></Form.Control>
      <Button type="submit" variant="" className="p-2 ">
        <i
          class="fa-solid fa-magnifying-glass"
          // style={{ color: "#B197FC" }}
          size="xl"
        ></i>
        {/* search */}
        {/* <Image src="../images/search.png" fluid width={30} height={30} /> */}
      </Button>
    </Form>
  );
};

export default SearchBox;
