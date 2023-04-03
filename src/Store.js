import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    contactDetails: localStorage.getItem('contactDetails')
      ? JSON.parse(localStorage.getItem('contactDetails'))
      : '',
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems:
      // localStorage.getItem('userInfo') &&
      localStorage.getItem(
        `${JSON.parse(localStorage.getItem('userInfo'))?._id}`
      )
        ? JSON.parse(
            localStorage.getItem(
              `${JSON.parse(localStorage.getItem('userInfo'))?._id}`
            )
          )
        : [],
  },
};
console.log('initial render');
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };
    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item?._id === newItem?._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item?._id === existItem?._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      let userID = JSON.parse(localStorage.getItem('userInfo'))?._id;
      localStorage.setItem(`${userID}`, JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item?._id !== action.payload?._id
      );
      let userID = JSON.parse(localStorage.getItem('userInfo'))?._id;
      localStorage.setItem(`${userID}`, JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
          contactDetails: {},
        },
      };
    case 'SAVE_CONTACT_DETAILS':
      return {
        ...state,
        cart: {
          ...state.cart,
          contactDetails: action.payload,
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'INITIAL_STATE':
      console.log(action.payload);
      // return state
      return {
        ...state,
        cart: { ...state.cart, cartItems: action.payload.items },
      };

    default:
      return state;
  }
}
const getInitialValues = (items) => {
  console.log({ ...initialState.cart, cartItems: items });
  return { ...initialState.cart, cartItems: items };
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch, getInitialValues };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
