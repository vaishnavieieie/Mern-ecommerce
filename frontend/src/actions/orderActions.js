import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS
} from "../actions/types";
import axios from "axios";

export const createOrder = order => async (dispatch, getState) => {
  // console.log(order);
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    };
    const { data } = await axios.post(`/api/orders`, order, config);
    console.log();

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
    });
  }
};

export const getOrderDetails = id => async (dispatch, getState) => {
  // console.log(order);
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };
    const { data } = await axios.get(`/api/orders/${id}`, config);
    console.log();

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
    });
  }
};

export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  // console.log(order);
  try {
    dispatch({
      type: ORDER_PAY_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    };
    const { data } = await axios.put(
      `/api/orders/${orderId}/pay`,
      paymentResult,
      config
    );

    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
    });
  }
};