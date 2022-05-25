import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET
} from "../actions/types";

const initialState = {
  loading: true,
  userInfo: null,
  error: null
};

export const userLoginReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };

    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, userInfo: payload };

    case USER_LOGIN_FAIL:
      return { loading: false, error: payload };

    case USER_LOGOUT:
      return { ...state, loading: false, userInfo: null, error: null };

    default:
      return state;
  }
};

export const userRegisterReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true };

    case USER_REGISTER_SUCCESS:
      return { ...state, loading: false, userInfo: payload };

    case USER_REGISTER_FAIL:
      return { loading: false, error: payload };

    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };

    case USER_DETAILS_SUCCESS:
      return { ...state, loading: false, user: payload };

    case USER_DETAILS_FAIL:
      return { loading: false, error: payload };

    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = { user: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true };

    case USER_UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, success: true, userInfo: payload };

    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: payload };

    case USER_UPDATE_PROFILE_RESET:
      return state;
    default:
      return state;
  }
};
