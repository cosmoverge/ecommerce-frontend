import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ContactDetailScreen from './ContactDetailScreen';
import swal from 'sweetalert';
import ContinueShopping from './ContinueShopping';

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

export default function AddToCart() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [modal, setModal] = useState(false);
  const [_modal, _setModal] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  // const [{ loading, error, product, loadingCreateReview }, dispatch] =
  //   useReducer(reducer, {
  //     product: [],
  //     loading: true,
  //     error: '',
  //   });
  const checkoutHandler = () => {
    // return (
    //   <Modal>
    //     <ModalHeader>Contact Details</ModalHeader>
    //   </Modal>
    // );
    // navigate('/shipping');
    state.userInfo ? navigate('/shipping') : _setModal(!_modal);
    // swal('To Continue select one from the below ', {
    //     buttons: {
    //       // text: 'Continue with out login',

    //       cancel: 'Continue with out login',
    //       catch: 'Log in',
    //       // default: true,
    //     },
    //   }).then((value) => {
    //     switch (value) {
    //       case 'catch':
    //         navigate('/signin');
    //         // swal('Pikachu fainted! You gained 500 XP!');
    //         break;
    //       case 'cancel':
    //         navigate('/contact-detail');
    //       // case 'catch':
    //       //   swal('Gotcha!', 'Pikachu was caught!', 'success');
    //       //   break;

    //       default:
    //         navigate('/contact-detail');
    //     }
    //   });
  };

  // let vl = cartItems.map((ele) => {
  //   return ele.quantity;
  // });
  // const { cart, userInfo } = state;

  // const addToCartHandler = async () => {
  //   const existItem = cart.cartItems.find((x) => x._id === product._id);
  //   let quantity = existItem ? existItem.quantity + 1 : 1;
  //   const { data } = await axios.get(`/api/products/${product._id}`);
  //   console.log('inside :::', data);
  //   if (data.countInStock < quantity) {
  //     window.alert('Sorry. Product is out of stock');
  //     return;
  //   }
  //   ctxDispatch({
  //     type: 'CART_ADD_ITEM',
  //     payload: { ...product, quantity },
  //   });
  //   navigate('/cart');
  // };
  const cartPrice = cartItems.map((item) => {
    if (item.packageName == "30 pills x 1mg") {
      return item.priceFor30Pills;
    } else if (item.packageName == "45 pills x 1mg") {
      return item.priceFor45Pills;
    } else if (item.packageName == "60 pills x 1mg") {
      return item.priceFor60Pills;
    } else if (item.packageName == "90 pills x 1mg") {
      return item.priceFor90Pills;
    } else if (item.packageName == "120 pills x 1mg") {
      return item.priceFor120Pills;
    } else if (item.packageName == "150 pills x 1mg") {
      return item.priceFor150Pills;
    } else if (item.packageName == "180 pills x 1mg") {
      return item.priceFor180Pills;
    } else if (item.packageName == "240 pills x 1mg") {
      return item.priceFor240Pills;
    } else if (item.packageName == "300 pills x 1mg") {
      return item.priceFor300Pills;
    } else {
      return item.price;
    }
  });
  console.log('cartItems:::', cartItems);
  // console.log('mukli hadri', vl);
  const handleChange = (item, val) => {
    // console.log('in side change::', vl, method);

    if (val === '') {
      updateCartHandler(item, 1);
    } else if (val === '10') {
      updateCartHandler(item, 10);
    } else if (val === '50') {
      updateCartHandler(item, 50);
    } else if (val === '100') {
      updateCartHandler(item, 100);
    } else if (val === '180') {
      updateCartHandler(item, 180);
    } else if (val === '150') {
      updateCartHandler(item, 150);
    } else {
      updateCartHandler(item, 1);
    }
  };
  console.log(cartItems);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const getQuantity = cartItems.map((ele)=>ele.quantity)
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <div>
        <Modal size="md" isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>
            Contact Details
          </ModalHeader>
          <ModalBody>
            <ContactDetailScreen />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal
          style={{ marginTop: '200px' }}
          size="ls"
          isOpen={_modal}
          toggle={() => _setModal(!_modal)}
        >
          <ModalHeader toggle={() => _setModal(!_modal)}>
            Would You Like To Login?{' '}
          </ModalHeader>
          <ModalBody>
            <ContinueShopping />
          </ModalBody>
        </Modal>
      </div>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} style={{ color: 'black' }}>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`} className='cart_name' >{item.name}</Link>
                    </Col>
                    &nbsp;
                
                    <div className="quantityAlign">
                      <Col md={4} className='cart_buttons'>
                        <Button
                          onClick={() => {
                            // let qnty = quantity + 1;
                            updateCartHandler(item, item.quantity - 1);
                          }}
                          variant="light"
                          disabled={quantity === 1}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>{' '}
                        <span >{item.quantity}</span>{' '}
                        <Button
                          variant="light"
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          disabled={quantity === item.countInStock}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </Col>
                      &nbsp;
                  
                      <Col md={3} className='cart_buttons'>
                       <strong> ${cartPrice *item.quantity} Per Pack </strong> 
                        {/* <div>
                          <select
                            style={{ fontSize: '13px' }}
                            defaultValue=""
                            onChange={(e) => handleChange(item, e.target.value)}
                          >
                            <option value="">quantity</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="150">150</option>
                            <option value="180">180</option>
                          </select>
                        </div> */}
                      </Col>
                      &nbsp;
                  
                      <Col md={2} className='trash_btn'>
                        <Button
                        
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </div>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartPrice *getQuantity}
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={checkoutHandler}
                      variant="primary"
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
