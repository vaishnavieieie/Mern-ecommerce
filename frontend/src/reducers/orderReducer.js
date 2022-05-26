import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET
} from "../actions/types";

export const orderCreateReducer = (
  state = { error: null, order: null, success: false, loading: true },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_CREATE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ORDER_CREATE_SUCCESS:
      console.log(payload);
      return {
        ...state,
        loading: false,
        success: true,
        order: payload
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: payload,
        order: null
      };

    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = {
    error: null,
    order: [],
    loading: true,
    shippingAddress: {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { ...state, loading: false, order: payload };
    case ORDER_DETAILS_FAIL:
      return { ...state, error: payload };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_PAY_REQUEST:
      return { ...state, loading: true };
    case ORDER_PAY_SUCCESS:
      return { ...state, loading: false, success: true };
    case ORDER_PAY_FAIL:
      return { ...state, error: payload, loading: false };
    case ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};
