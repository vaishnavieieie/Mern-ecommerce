import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_ITEM_FAIL,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS
} from "./types";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        _id: data._id,
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty
      }
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (err) {
    dispatch({
      type: CART_ITEM_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
    });
  }
};

export const removeFromCart = id => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: CART_REMOVE_ITEM,
      payload: id
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (err) {
    dispatch({
      type: CART_ITEM_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
    });
  }
};

export const saveShippingAddress = data => async dispatch => {
  try {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS,
      payload: data
    });

    localStorage.setItem("shippingAddress", JSON.stringify(data));
  } catch (err) {
    // dispatch({
    //   type: CART_ITEM_FAIL,
    //   payload:
    //     err.response && err.response.data.message
    //       ? err.response.data.message
    //       : err.message
    // });
  }
};

export const savePaymentMethod = data => async dispatch => {
  try {
    dispatch({
      type: CART_SAVE_PAYMENT_METHOD,
      payload: data
    });

    localStorage.setItem("paymentMethod", JSON.stringify(data));
  } catch (err) {
    // dispatch({
    //   type: CART_ITEM_FAIL,
    //   payload:
    //     err.response && err.response.data.message
    //       ? err.response.data.message
    //       : err.message
    // });
  }
};
