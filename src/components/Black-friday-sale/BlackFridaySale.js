import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Button, Card } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';

import { Store } from '../../Store';
import './BlackFridaySale.css';
import Rating from '../Rating';
import Product from '../Product';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function BlackFridaySale() {
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');
  const [todayDay, setTodayDay] = useState('');

  const { getInitialValues, state, dispatch: ctxDispatch } = useContext(Store);
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  let interval = useRef();

  const startTimer = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const countDowndate = new Date('Apr 7 2023 00:00:00').getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      let presentDay = weekdays[new Date().getDay()];
      const distance = countDowndate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      console.log('present day', presentDay);

      if (distance < 0) {
        // stop timer
        clearInterval(interval.current);
        setTodayDay(presentDay);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
        setTodayDay(presentDay);
      }
    }, 1000);
  };
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products/blackfridaysale');
        console.log('inside the fetch', result);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  // const addToCartHandler = async (item) => {
  //   const existItem = cartItems.find((x) => x._id === blackFridayProduct._id);
  //   const quantity = existItem ? existItem.quantity + 1 : 1;
  //   const { data } = await axios.get(`/api/products/${item._id}`);
  //   if (data.countInStock < quantity) {
  //     window.alert('Sorry. Product is out of stock');
  //     return;
  //   }
  //   ctxDispatch({
  //     type: 'CART_ADD_ITEM',
  //     payload: { ...item, quantity },
  //   });
  //   // setModal(!modal);
  //   // if (state.userInfo) {
  //   // toast.success(`${item.name} Added to the cart`);
  //   // }
  //   // else {
  //   //   navigate('/signin');
  //   // }
  // };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // console.log('inside the black friday sale::', blackFridayProducts);
  return (
    <div>
      {/* <h1>Black friday sale</h1> */}
      {todayDay == 'Fri' ? (
        <>
          <div style={{ width: '95%' }} className="page-heading">
            <h2 className='title_mblview' >Black Friday Sale</h2>
          </div>
          <div className="viweAll">
            {/* <Link
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              // marginBottom: '2%',
              fontSize: '18px',
            }}
            to=""
            // onClick={() => loadMore()}
          >
            View all
          </Link> */}
          </div>
          <Row className="justify-content-evenly">
            {products.map((product) => {
              return (
                <Col
                  key={product.slug}
                  sm={6}
                  md={4}
                  lg={4}
                  className="md-3"
                  style={{
                    paddingBottom: '10px',
                    // maxWidth: '600px',
                    display: 'flex',
                    scroll: 'none',
                    justifyContent: 'center',
                    // scrollX: 'none',
                  }}
                >
                  <Product product={product} />
                </Col>
              );
            })}
            {/* <Link to="" onClick={() => loadMore()}>
                show more
              </Link> */}
          </Row>
        </>
      ) : (
        <section className="timer-container">
          <section className="timer">
            <div>
              <span className="mdi mdi-calendar-clock timer-icon"></span>
              <h2>BLACK FRIDAY SALE</h2>
              <p> </p>
            </div>
            <div>
              <section>
                <p>{timerDays}</p>
                <p>
                  {' '}
                  <small>Days</small>
                </p>
              </section>
              <span>:</span>
              <section>
                <p>{timerHours}</p>
                <p>
                  {' '}
                  <small>Hours</small>
                </p>
              </section>
              <span>:</span>
              <section>
                <p>{timerMinutes}</p>
                <p>
                  {' '}
                  <small>Minutes</small>
                </p>
              </section>
              <span>:</span>
              <section>
                <p>{timerSeconds}</p>
                <p>
                  {' '}
                  <small>Seconds</small>
                </p>
              </section>
            </div>
          </section>
        </section>
      )}
    </div>
  );
}
