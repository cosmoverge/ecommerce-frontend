import React, { useContext, useEffect, useReducer, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios, { Axios } from 'axios';
import swal from 'sweetalert';
import { getError } from '../utils';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function ContactDetailScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const {
    fullBox,
    userInfo,
    cart: { contactDetails },
  } = state;
  console.log(state.cart);
  const [phoneNumber, setPhoneNumber] = useState(
    contactDetails.phoneNumber || ''
  );
  const [address, setAddress] = useState(contactDetails.address || '');
  const [city, setCity] = useState(contactDetails.city || '');
  const [postalCode, setPostalCode] = useState(contactDetails.postalCode || '');
  const [country, setCountry] = useState(contactDetails.country || '');

  const [email, setEmail] = useState(contactDetails.email || '');
  console.log('state in contact details::', state.userInfo);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  state.cart.itemsPrice = round2(
    state.cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  state.cart.itemsPrice = round2(
    state.cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  state.cart.discountPrice = round2(
    state.cart.cartItems.reduce(
      (a, c) => a + c.quantity * c.productDiscountedPrice,
      0
    )
  );
  state.cart.shippingPrice =
    state.cart.itemsPrice > 100 ? round2(0) : round2(10);
  state.cart.taxPrice = round2(0.15 * state.cart.itemsPrice);
  state.cart.totalPrice =
    state.cart.itemsPrice + state.cart.shippingPrice - state.cart.discountPrice;
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const token = userInfo
        ? userInfo.token
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYzhkNzljZDgzYjdlOGJlZWZiMGEiLCJuYW1lIjoiZ3Vlc3R1c2VyIiwiZW1haWwiOiJndWVzdEBleGFtcGxlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NzU4NzI0NzEsImV4cCI6MjYyMjYwMDQ3MX0.byzxrrei5Q9E-y_DRSGjj8KyUDRac2vw6ZuNtpG1Nw8';
      console.log('token', token);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: state.cart.cartItems,
          // shippingAddress: state.cart.shippingAddress,
          // paymentMethod: state.cart.paymentMethod,
          contactDetails: state.cart.contactDetails,
          itemsPrice: state.cart.itemsPrice,
          shippingPrice: state.cart.shippingPrice,
          taxPrice: state.cart.taxPrice,
          totalPrice: state.cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('inside the place order::', data);
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem(`${userInfo?._id}`);

      swal({
        title: 'Success',
        text: 'Thanks for Ordering! Our customer executive will contact you shortly!',
        icon: 'success',
        button: 'close',
      });

      // swal({
      //   title: 'Success',
      //   text: ` ${data.order.orderItems.map(
      //     (ele) => ele.name
      //   )} item order has been placed`,
      //   icon: 'success',
      //   button: 'close',
      // });

{userInfo ==null ?navigate('/'):navigate(`/order/${data.order._id}`)}

      
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      // toast.error(getError(err));
      console.log('error in side place order', err);
    }
  };

  const onSubmit = async () => {
    // console.log('in onsubmit:::', data);
    ctxDispatch({
      type: 'SAVE_CONTACT_DETAILS',
      payload: {
        phoneNumber,
        email,
        address,
        postalCode,
        country,
        city,
      },
    });
    localStorage.setItem(
      'contactDetails',
      JSON.stringify({
        phoneNumber,
        email,
        address,
        postalCode,
        country,
        city,
      })
    );
    swal({
      title: 'Success',
      text: 'Thanks for Ordering ! our customer executive will contact you shortly!',
      icon: 'success',
      button: 'close',
    });
    placeOrderHandler();
    navigate('/');
    // navigate('/payment');
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log('inside the contact details :::', state.cart);

  return (
    <div className="container small-container">
      {/* <CheckoutSteps step1 step2></CheckoutSteps> */}
      <h1 className="my-3">Contact Details</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="phoneNumber">
          <Form.Label>
            Phone Number{' '}
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
          </Form.Label>
          <Form.Control
            value={phoneNumber}
            type="number"
            maxLength={10}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Group>
        {errors.phoneNumber && (
          <p style={{ color: 'red' }}>Please check the Phone Number</p>
        )}
        {/* <Form.Group className="mb-3" controlId="whatsappNumber">
          <Form.Label>whatsapp Number</Form.Label>
          <Form.Control
            value={whatsappNumber}
            type="number"
            maxLength={10}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
        </Form.Group> */}
        {/* <Form.Field style={{ display: 'grid' }}>
          <label style={{ fontSize: '17px' }}>Telegram Number</label>
          <input
            placeholder="Telegram Number"
            type="number"
            {...register('telegramNumber', {
              required: false,
              maxLength: 10,
            })}
          />
        </Form.Field> */}
        {errors.telegramNumber && (
          <p style={{ color: 'red' }}>Please check the Telegram Number</p>
        )}
        {/* <Form.Group className="mb-3" controlId="iMessageNumber">
          <Form.Label>iMessage Number</Form.Label>
          <Form.Control
            value={iMessageNumber}
            type="number"
            maxLength={10}
            onChange={(e) => setIMessageNumber(e.target.value)}
          />
        </Form.Group> */}
        {/* <Form.Group className="mb-3" controlId="telegramNumber">
          <Form.Label>Telegram Number</Form.Label>
          <Form.Control
            value={telegramNumber}
            type="number"
            maxLength={10}
            onChange={(e) => setTelegramNumber(e.target.value)}
          />
        </Form.Group> */}
        {/* <Form.Field style={{ display: 'grid', marginTop: '5px' }}>
          <label style={{ fontSize: '17px' }}>Watsapp Number</label>
          <input
            placeholder="Watsapp Number"
            type="number"
            {...register('watsappNumber', {
              required: false,
              maxLength: 10,
            })}
          />
        </Form.Field> */}
        {errors.telegramNumber && (
          <p style={{ color: 'red' }}>Please check the Watsapp Number</p>
        )}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>
            Email{' '}
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
          </Form.Label>
          <Form.Control
            value={email}
            required
            // pattern="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        {/* <Form.Field style={{ display: 'grid' }}>
          <label style={{ fontSize: '17px' }}>Email</label>
          <input
            placeholder="Email"
            type="email"
            {...register('email', {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
        </Form.Field> */}
        {errors.email && <p style={{ color: 'red' }}>Please check the Email</p>}

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>
            Address{' '}
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
          </Form.Label>
          <Form.Control
            value={address}
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>
            City{' '}
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
          </Form.Label>
          <Form.Control
            value={city}
            type="text"
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="postalCode">
          <Form.Label>
            Postal Code{' '}
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
          </Form.Label>
          <Form.Control
            value={postalCode}
            type="number"
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="country">
          <Form.Label>
            Country{' '}
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
          </Form.Label>
          <Form.Control
            value={country}
            type="text"
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </Form.Group>
        <div>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        </div>
        
        &nbsp;
      </Form>
    </div>
  );
}
