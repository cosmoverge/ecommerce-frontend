import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Slider from '../components/SliderScreens/Slider';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import DealsOfTheday from '../components/DealsOfTheday';
import BlackFridaySale from '../components/Black-friday-sale/BlackFridaySale';
import BestSeller from '../components/BestSelleer/BestSeller';
import { Link } from 'react-router-dom';
// import { LeftArrow, RightArrow } from '../components/arrows';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { FreeMode } from 'swiper';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

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

export default function HomeScreens() {
  const { getInitialValues, state, dispatch: ctxDispatch } = useContext(Store);
  const [show, setShow] = useState(6);

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    let items =
      // localStorage.getItem('userInfo') &&
      localStorage.getItem(
        `${JSON.parse(localStorage.getItem('userInfo'))?._id}`
      )
        ? JSON.parse(
            localStorage.getItem(
              `${JSON.parse(localStorage.getItem('userInfo'))?._id}`
            )
          )
        : [];

    ctxDispatch({
      type: 'INITIAL_STATE',
      payload: { items },
    });
  }, [ctxDispatch]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const product = products.map((ele) => ele.price);

  const _slice = products.slice(0, show);
  console.log('slice', _slice);

  // const loadMore = () => {
  //   <Product />;
  // };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log('pro', product);
  return (
    <div>
      <Helmet>
        <title>RX MEDICINE ONLINE</title>
      </Helmet>
      <div style={{ marginBotton: '20px', width: '100%' }}>
        <Slider />
      </div>
      {/* <div style={{ marginBotton: '20px' }}>
        <BlackFridaySale />
      </div> */}

      {/* <div>
        <BestSeller product={products} />
      </div> */}
      <div>
        {' '}
        <DealsOfTheday products={products} />
      </div>
      <>
        <div className="products">
          {
            <Row className="justify-content-evenly">
              <div style={{ width: '95%' }} className="page-heading">
                <h2 className='title_mblview' >Products</h2>
                <div className="viweAll">
                  <Link
                    style={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      // marginBottom: '2%',
                      fontSize: '18px',
                    }}
                    to="/allProducts"
                    // onClick={() => loadMore()}
                  >
                    View all
                  </Link>
                </div>
              </div>

              {/* <Link
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  marginBottom: '2%',
                  fontSize: '18px',
                }}
                to="/allProducts"
                onClick={() => loadMore()}
              >
                View all
              </Link> */}
              {_slice?.map((product) => {
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
          }
          {/* <div
            style={{
              width: '100%',
              border: '1px solid',
              margin: '10px',
            }}
          >
            {' '}
            Best Sellers{' '}
          </div> */}
        </div>
      </>
    </div>
  );
}
