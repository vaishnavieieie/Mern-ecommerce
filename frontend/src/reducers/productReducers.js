import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS
} from "../actions/types";

const initialState = {
  products: [],
  loading: true,
  error: null
};

export const productListReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_LIST_REQUEST:
      return { ...state, loading: true, products: [] };

    case PRODUCT_LIST_SUCCESS:
      return { ...state, loading: false, products: payload };

    case PRODUCT_LIST_FAIL:
      return { loading: false, error: payload };

    default:
      return state;
  }
};

const initialState2 = {
  product: { reviews: [] },
  loading: true,
  error: null
};

export const productDetailsReducer = (state = initialState2, action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true, product: [] };

    case PRODUCT_DETAILS_SUCCESS:
      return { ...state, loading: false, product: payload };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: payload };

    default:
      return state;
  }
};
