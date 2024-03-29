import {
  CART_ADD_ITEM,
  CART_ITEM_FAIL,
  CART_REMOVE_ITEM,
  CART_RESET,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS
} from "../actions/types";

export const cartReducer = (
  state = { cartItems: [], error: null, shippingAddress: {} },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case CART_ADD_ITEM:
      const item = payload;
      const existItem = state.cartItems.find(x => x.product === item.product);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(x =>
            x.product === existItem.product ? item : x
          )
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item]
        };
      }

    case CART_ITEM_FAIL:
      return { ...state, error: payload };

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.product !== payload)
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: payload
      };

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: payload
      };

    case CART_RESET:
      return { ...state, cartItems: [], error: null, shippingAddress: {} };
    default:
      return state;
  }
};
