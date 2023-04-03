import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
// import data from '../../data';
import Rating from '../Rating';
import { Store } from '../../Store';
// import MessageBox from '../MessageBox';
// import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingBox from '../LoadingBox';
// import { Store } from '../Store';
import swal from 'sweetalert';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return { ...state, sliders: action.payload, loading: false };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

export default function SlidingProducts() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;
  const [sliders, setSlider] = useState([]);

  const { state: navValues } = useLocation();
  const { sliderType, sliderValue, name } = navValues;
  console.log(name);
  // const { sliderID } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      console.log(sliderValue);
      let result = await axios.get(
        `/api/products/search?category=${sliderValue}`
      );

      if (sliderType === 'subCategory') {
        result = await axios.get(
          `/api/products/search?subCategory=${sliderValue}`
        );
      }
      console.log(result.data.products);
      setSlider(result.data.products);
    };
    fetchData();
  }, [sliderType, sliderValue]);

  //   console.log(state);

  //   const discountPrice = sliders.map((slide) => {
  //     return slide.subCategory.map(
  //       (ele) => ele.price - ele.productDiscountedPrice
  //     );
  //   });
  // props.product.price - props.product.productDiscountedPrice;
  //   const percentage = Math.floor(
  //     (props.product.productDiscountedPrice / props.product.price) * 100
  //   );

  //   const percentage = Math.floor(
  //     sliders.map((slide) => {
  //       return slide.subCategory.map(
  //         (ele) => (ele.productDiscountedPrice / ele.price) * 100
  //       );
  //     })
  // (props.product.productDiscountedPrice / props.product.price) * 100
  //   );
  //   console.log(
  //     'object',
  //     sliders.map((slide) => {
  //       return slide.subCategory.map((ele) => ele);
  //     })
  //   );

  // console.log(
  //   'object',
  //   _slider.map((ele) => ele[0]._id)
  // );

  //   const _slider1 = _slider[0].map((ele) => ele);
  //   console.log('object', _slider1);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    swal(`${item.name} Added to the cart`, "success");

    // toast.success(`${item.name} Added to the cart`);
  };

  if (sliders.length === 0) {
    return (
      <>
        {sliderType === 'category' ? (
          <h4> Category : {name}</h4>
        ) : sliderType === 'subCategory' ? (
          <h4> Sub Category : {name}</h4>
        ) : (
          <h4> Product : {name}</h4>
        )}
        {/* <MessageBox variant="danger">
        <h4>No Products </h4>
       </MessageBox> */}
        <LoadingBox />
      </>
    );
  }

  return (
    <div>
      {sliderType === 'category' ? (
        <h4> Category : {name}</h4>
      ) : sliderType === 'subCategory' ? (
        <h4> Sub Category : {name}</h4>
      ) : (
        <h4> Product : {name}</h4>
      )}
      <div className="products">
        {sliders?.map((ele) => {
          return (
            <div className="product" key={ele._id}>
              <Card style={{ background: '#f8f9fa', width: '300px' }}>
                {console.log(ele)}

                <div style={{ width: '100%' }}>
                  <Swiper
                    sidesPerView={3}
                    spaceBetween={40}
                    slidesPerGroup={1}
                    loop={true}
                    navigation={true}
                  >
                    {[ele.image, ...ele.images]?.map((x, i) => (
                      <Col key={i}>
                        <SwiperSlide>
                          <img
                            className="list-img-size"
                            onClick={() => navigate(`/product/${ele?.slug}`)}
                            src={x}
                            alt={ele.name}
                          />
                          {/* <Card.Img variant="top" src={x} alt="product"     onClick={() => setSelectedImage(x)} /> */}
                        </SwiperSlide>
                      </Col>
                    ))}
                  </Swiper>
                </div>

                {/* <Link to={`/product/${ele.slug}`}>
                  <img
                    src={ele.images[0] ? ele.images[0] : ele.image}
                    className="card-img-top"
                    alt={ele.name}
                    style={{ height: '261px' }}
                  />
                </Link> */}
                <Card.Body>
                  {console.log(ele)}
                  <Link to={`/product/${ele.slug}`}>
                    <Card.Title>{ele.name}</Card.Title>
                  </Link>
                  <Rating rating={ele.rating} numReviews={ele.numReviews} />
                  <Card.Text>
                    <div style={{ display: 'flex' }}>
                      <div style={{ fontSize: '30px' }}>
                        {' '}
                        ${ele.price - ele.productDiscountedPrice}{' '}
                      </div>
                      <div
                        style={{
                          textDecoration: 'line-through',
                          margin: '10px',
                        }}
                      >
                        {' '}
                        ${ele.price}
                      </div>

                      <div
                        style={{
                          margin: 'auto',
                          background: '#dc3545',
                          color: 'white',
                        }}
                      >
                        (
                        {Math.floor(
                          (ele.productDiscountedPrice / ele.price) * 100
                        )}
                        % off)
                      </div>
                    </div>
                  </Card.Text>
                  {ele.countInStock === 0 ? (
                    state?.userInfo?.isAdmin ? null : (
                      <Button variant="light" disabled>
                        Out of stock
                      </Button>
                    )
                  ) : state?.userInfo?.isAdmin ? null : (
                    <Button onClick={() => addToCartHandler(ele)}  >
                      Add to cart
                    </Button>
                  )}
                </Card.Body>
              </Card>
              {/* <Link to={`/sliders/${ele.slug}`}>
                <img src={ele.image} alt={ele.name} />
              </Link>
              <div className="product-info">
                <Link to={`/sliders/${ele.slug}`}>
                  <p>{ele.name} </p>
                </Link>
                <p>
                  <strong>Rs.{ele.price}</strong>
                </p>
                <button>Add to cart</button>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
