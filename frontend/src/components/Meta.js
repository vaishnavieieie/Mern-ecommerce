import React from "react";
import Helmet from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};
Meta.defaultProps = {
  title: "Welcome to proshop",
  description: "best products at unbelievable prices!",
  keywords: "buy products,cheap products,products"
};

export default Meta;