import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import ReactTable from 'react-table-6';
import swal from 'sweetalert';

SwiperCore.use([Navigation]);

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    default:
      return state;
  }
};

export default function ProductScreen() {
  let reviewsRef = useRef();
  const { state: productID } = useLocation();
  const [selectedImage, setSelectedImage] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  console.log('product', product);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      // console.log('aaaa', slug, typeof slug);
      try {
        // let result = await axios.get(`/api/products/slug/${slug}`);

        let FETCH_URL = `/api/products/slug/${slug}`;

        if (slug === 'sliderProduct') {
          FETCH_URL = `/api/products/${productID}`;
        }

        let result = await axios.get(FETCH_URL);

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [productID, slug]);

  // const updateCartHandler = async (product, quantity) => {
  //   const { data } = await axios.get(`/api/products/${product._id}`);
  //   if (data.countInStock < quantity) {
  //     window.alert('Sorry. Product is out of stock');
  //     return;
  //   }
  //   console.log('in side details', data);
  //   ctxDispatch({
  //     type: 'CART_ADD_ITEM',
  //     payload: { ...product, quantity },
  //   });
  // };

 

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
 const percentage = ((product.productDiscountedPrice / product.price) * 100).toFixed(0)

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    let quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log('inside :::', data);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      // swal('Please enter comment and rating', "success");
      swal({
        title: "Warning",
        text: 'Please enter comment and rating',
        icon: "warning",
        button: "close",
      });
      // toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      swal('Review submitted successfully', "success");

      // toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      // swal(getError(error), "warning");
      swal({
        title: "Warning",
        text: getError(error),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const handleShow = async (cell) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    let quantity = existItem ? existItem.quantity + 1 : 1;
    let packageName = cell?.row?._original.package
    let packagePrice =  cell?.row?._original.price
    let packageperpill = cell?.row?._original.perpill
    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log('inside :::', data);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;  
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity,packageName,packagePrice,packageperpill},
    });
    navigate('/bulkorder');
    console.log(cell?.row?._original);
}
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  console.log('product inside product screen', product);
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row xs={1} md={3} className="g-2">
        {/* {[product.image, ...product.images].map((x) => (
                 
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))} */}
      </Row>
      <Row className="products-row">
        <h1 className='productName' >{product.name} </h1>
        <Col md={12} style={{ display: 'flex' }}>
          {console.log('selected Image', selectedImage)}
          <div className='productImg'>
            <Swiper
              sidesPerView={3}
              spaceBetween={40}
              slidesPerGroup={1}
              loop={true}
              navigation={true}
            >
              {/* {console.log([product.image, ...product.images])} */}
              {(product?.image || product?.image?.images?.length > 0) &&
                [product?.image, ...product?.images]?.map((x, i) => (
                  <Col key={i}>
                    <SwiperSlide>
                      <img
                        className="list-img-size"
                        onClick={() => setSelectedImage(x)}
                        src={x}
                        alt={product.name}
                      />
                      {/* <Card.Img variant="top" src={x} alt="product"     onClick={() => setSelectedImage(x)} /> */}
                    </SwiperSlide>
                  </Col>
                ))}
            </Swiper>
          </div>
          <div class="col-sm-6" style={{ padding: '40px' }}>
            <div
              itemprop="name"
              class="product_name"
              style={{ color: ' #75b510', fontSize: '20px' }}
            >
              {product.slug}
              {/* 100% Whey Gold Standard Optimum Nutrition (16 pack) */}
            </div>

            <div class="options clearfix">
              <div id="product_price">
                <p class="price product-price">
                  <p
                    class="money"
                    data-currency-usd="$ 199.00"
                    data-currency="USD"
                  >
                    Actual Price : ${product.price}
                  </p>
                  <p
                    class="money compare-at-price"
                    data-currency-usd="$ 220.00"
                    data-currency="USD"
                  >
                    Discount Price : ${product.productDiscountedPrice}
                  </p>
                  <p
                    class="money compare-at-price"
                    data-currency-usd="$ 220.00"
                    data-currency="USD"
                  >
                    Total Price : ${product.price-product.productDiscountedPrice}
                  </p>
                  <p
                    class="money compare-at-price"
                    data-currency-usd="$ 220.00"
                    data-currency="USD"
                  >
                    Discount Percentage : { percentage  }%
                  </p>
                </p>{' '}
              </div>

              <div class="variants-wrapper clearfix visuallyhidden">
                <div class="selector-wrapper">
                  {/* <select
                      class="single-option-selector"
                      data-option="option1"
                      id="product-select-option-0"
                    >
                      <option value="Default Title">Default Title</option>
                    </select> */}
                </div>
              </div>
              <hr />
              <div id="purchase">
                {/* <ListGroup> */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      {!userInfo?.isAdmin && (
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                )}
                {/* </ListGroup> */}
                {/* <button class="btn btn-cart" type="submit" id="add-to-cart">
                    Add to cart
                  </button> */}
              </div>
            </div>
            &nbsp;
                  &nbsp;

            <div class="product_details">
              <span> type : </span>
              <span class="product_type" style={{ color: ' #75b510' }}>
                {product.category}
              </span>
            </div>
            <hr />
            <div id="product_description" class="rte" itemprop="description">
              <h4>Description : </h4>
              <div>{product.description}</div>
            </div>
            <hr />
            {product.additionalInfo?<div id="product_description" class="rte" itemprop="description">
              <h4>Aditional Info : </h4>
              <div>{product.additionalInfo}</div>
            </div>:''}
            
          </div>
          
        </Col>
        {userInfo?.isAdmin?<ReactTable
                            data={[
                              {
                                package: '30 pills x 1mg',
                                price: `$${product.priceFor30Pills}`,
                                perpill:`$${(product.priceFor30Pills/30).toFixed(2)}`,
                                // action:<button>Add To Cart</button>
                              },
                              
                              {
                                package: '60 pills x 1mg',
                                price: `$${product.priceFor60Pills}`,
                                perpill:`$${(product.priceFor60Pills/60).toFixed(2)}`,
                                savings:`$${product.price*60-product.priceFor60Pills}`,                                // action:<button>Add To Cart</button>
                              },
                              {
                                package: '90 pills x 1mg',
                                price: `$${product.priceFor90Pills}`,
                                perpill:`$${(product.priceFor90Pills/90).toFixed(2)}`,
                                savings:`$${product.price*90-product.priceFor90Pills}`,
                                // action:<button>Add To Cart</button>

                              },
                              {
                                package: '120 pills x 1mg',
                                price: `$${product.priceFor120Pills}`,
                                perpill:`$${(product.priceFor120Pills/120).toFixed(2)}`,
                                savings:`$${product.price*120-product.priceFor120Pills}`,                                // action:<button>Add To Cart</button>

                              },
                              {
                                package: '180 pills x 1mg',
                                price: `$${product.priceFor180Pills}`,
                                perpill:`$${(product.priceFor150Pills/180).toFixed(2)}`,
                                savings:`$${product.price*180-product.priceFor180Pills}`,        // action:<button>Add To Cart</button>
                              },
                              {
                                package: '270 pills x 1mg',
                                price: `$${product.priceFor240Pills}`,
                                perpill:`$${(product.priceFor270Pills/270).toFixed(2)}`,
                                savings:`$${product.price*270-product.priceFor270Pills}`,                                // action:<button>Add To Cart</button>
                              },
                              
                            ]}
                            columns={[
                              { Header: 'Package', accessor: 'package' },
                              { Header: 'Price', accessor: 'price' },
                              { Header: 'Per pill', accessor: 'perpill' },
                              { Header: 'Savings', accessor: 'savings' },
                              // { Header: 'Action', accessor: 'action' },
                              // { Header: "Action",
                              // accessor: 'action',
                              // Cell: ({ row }) => (
                              //   <button onClick={()=>handleShow({row})}>
                              //     Add to cart
                              //   </button>
                              // )}
                            ]}
                            minRows={0}
                          />:<ReactTable
                          data={[
                            {
                              package: '30 pills x 1mg',
                              price: `$${product.priceFor30Pills}`,
                              perpill:`$${(product.priceFor30Pills/30).toFixed(2)}`,
                              // action:<button>Add To Cart</button>
                            },
                            {
                              package: '45 pills x 1mg',
                              price: `$${product.priceFor45Pills}`,
                              perpill:`$${(product.priceFor45Pills/45).toFixed(2)}`,
                              savings:`$${product.price*45-product.priceFor90Pills}`,                              // action:<button>Add To Cart</button>
                            },
                            {
                              package: '60 pills x 1mg',
                              price: `$${product.priceFor60Pills}`,
                              perpill:`$${(product.priceFor60Pills/60).toFixed(2)}`,
                              savings:`$${product.price*60-product.priceFor90Pills}`,                              // action:<button>Add To Cart</button>
                            },
                            {
                              package: '90 pills x 1mg',
                              price: `$${product.priceFor90Pills}`,
                              perpill:`$${(product.priceFor90Pills/90).toFixed(2)}`,
                              savings:`$${product.price*90-product.priceFor90Pills}`,                              // action:<button>Add To Cart</button>

                            },
                            {
                              package: '120 pills x 1mg',
                              price: `$${product.priceFor120Pills}`,
                              perpill:`$${(product.priceFor120Pills/120).toFixed(2)}`,
                              savings:`$${product.price*120-product.priceFor90Pills}`,                   // action:<button>Add To Cart</button>

                            },
                            {
                              package: '150 pills x 1mg',
                              price: `$${product.priceFor150Pills}`,
                              perpill:`$${(product.priceFor150Pills/150).toFixed(2)}`,
                              savings:`$${product.price*150-product.priceFor90Pills}`,                              // action:<button>Add To Cart</button>
                            },
                            {
                              package: '240 pills x 1mg',
                              price: `$${product.priceFor240Pills}`,
                              perpill:`$${(product.priceFor240Pills/240).toFixed(2)}`,
                              savings:`$${product.price*240-product.priceFor90Pills}`,                              // action:<button>Add To Cart</button>
                            },
                            {
                              package: '300 pills x 1mg',
                              price: `$${product.priceFor300Pills}`,
                              perpill:`$${(product.priceFor300Pills/300).toFixed(2)}`,
                              savings:`$${product.price*300-product.priceFor90Pills}`,                              // action: <button>Add To Cart</button>
                            },
                          ]}
                          columns={[
                            { Header: 'Package', accessor: 'package' },
                            { Header: 'Price', accessor: 'price' },
                            { Header: 'Per pill', accessor: 'perpill' },
                            { Header: 'Savings', accessor: 'savings' },
                            // { Header: 'Action', accessor: 'action' },
                            { Header: "Action",
                            accessor: 'action',
                            Cell: ({ row }) => (
                              <button className='add_cart_in_table' onClick={()=>handleShow({row})}>
                                Add to cart
                              </button>
                            )}
                          ]}
                          minRows={0}
                        />}
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef} className ='reviews' >Reviews</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>No Reviews at the moment </MessageBox>
          )}
        </div>
        <ListGroup>
          {product?.reviews?.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {!userInfo?.isAdmin ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                className='form_select'
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                className='form_control'
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
              &nbsp;
                  &nbsp;
              <div className="rating_submit">
                <Button disabled={loadingCreateReview} type="submit" className='submit-button'>
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : userInfo.isAdmin ? null : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}
