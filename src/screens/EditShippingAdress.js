import React, { useContext, useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import swal from 'sweetalert';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}

export default function ShippingAddressScreen() {
  const { id } = useParams();
  console.log(id);
  const [
    {
      // loading,
      // error,
      order,

      // loadingDeliver,
      // successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    // fullBox,
    userInfo,
    // cart: { shippingAddress },
  } = state;
  // const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  // const [address, setAddress] = useState(shippingAddress.address || '');
  // const [city, setCity] = useState(shippingAddress.city || '');
  // const [postalCode, setPostalCode] = useState(
  //   shippingAddress.postalCode || ''
  // );

  const [shippingAddress] = useState({});
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    async function getShippingAddress() {
      let address = await axios.get(
        `/api/orders/order/${id}`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log('address', address.data.shippingAddress.location);
      setShippingAdress1({ ...address.data.shippingAddress });
    }
    getShippingAddress();
  }, [id, userInfo.token]);

  console.log(shippingAddress);

  const [shippingAdress1, setShippingAdress1] = useState({
    fullName: shippingAddress.fullBox,
    address: shippingAddress.address,
    city: shippingAddress.city,
    postalCode: shippingAddress.postalCode,
    country: shippingAddress.country,
    location: {
      lat: shippingAddress?.location?.lat,
      lng: shippingAddress?.location?.lng,
    },
  });

  function handleShippingAdress(e) {
    let { value, name } = e.target;
    setShippingAdress1({ ...shippingAdress1, [name]: value });
  }
  console.log('new', shippingAdress1);
  console.log(shippingAddress);

  //   useEffect(() => {
  //     if (!userInfo) {
  //       navigate('/signin?redirect=/shipping');
  //     }
  //   }, [userInfo, navigate]);
  // const [country, setCountry] = useState(shippingAddress.country || '');
  //   const submitHandler = (e) => {
  //     e.preventDefault();
  //     ctxDispatch({
  //       type: 'SAVE_SHIPPING_ADDRESS',
  //       payload: {
  //         fullName,
  //         address,
  //         city,
  //         postalCode,
  //         country,
  //         location: shippingAddress.location,
  //       },
  //     });
  //     localStorage.setItem(
  //       'shippingAddress',
  //       JSON.stringify({
  //         fullName,
  //         address,
  //         city,
  //         postalCode,
  //         country,
  //         location: shippingAddress.location,
  //       })
  //     );
  //     // navigate('/order');
  //   };
  //   useEffect(() => {
  //     ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  //   }, [ctxDispatch, fullBox]);

  //   console.log(state);

  async function deliverOrderHandler(e) {
    e.preventDefault();
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${id}/address`,
        shippingAdress1,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data);
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      swal('Order is delivered', "success");

      // toast.success('Order is delivered');
      navigate(`/order/${id}`);
    } catch (err) {
      swal({
        title: "Warning",
        text: getError(err),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }
  console.log(order);
  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={deliverOrderHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="fullName"
              value={shippingAdress1.fullName}
              onChange={handleShippingAdress}
              //   onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={shippingAdress1.address}
              onChange={handleShippingAdress}
              //   onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              value={shippingAdress1.city}
              onChange={handleShippingAdress}
              //   onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              name="postalCode"
              value={shippingAdress1.postalCode}
              onChange={handleShippingAdress}
              //   onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              name="country"
              value={shippingAdress1.country}
              onChange={handleShippingAdress}
              //   onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            {/* <Button
              id="chooseOnMap"
              type="button"
              variant="light"
              onClick={() => navigate('/map')}
            >
              Choose Location On Map
            </Button> */}
            {console.log('location is', shippingAdress1.location)}

            {shippingAdress1.location && shippingAdress1.location.lat ? (
              <div>
                LAT: {shippingAdress1.location.lat}
                LNG:{shippingAdress1.location.lng}
              </div>
            ) : (
              <div>{/* No location */}</div>
            )}
          </div>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Update
            </Button>
          </div>
          &nbsp;
        </Form>
      </div>
    </div>
  );
}
