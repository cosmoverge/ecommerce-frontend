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

export default function Pills() {
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
  console.log('cartItems:::', cartItems);
  // console.log('mukli hadri', vl);
  const handleChange = (item, val) => {
    // console.log('in side change::', vl, method);

    if (val === '') {
      updateCartHandler(item, 1);
    } else if (val === '60') {
      updateCartHandler(item, 60);
    } else if (val === '90') {
      updateCartHandler(item, 90);
    } else if (val === '180') {
      updateCartHandler(item, 180);
    } else if (val === '270') {
      updateCartHandler(item, 270);
    } else {
      updateCartHandler(item, 1);
    }
  };
  console.log(cartItems);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
                        style={{height:'100px'}}
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    {/* <div className="quantityAlign">
                      <Col md={4}>
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
                        <span>{item.quantity}</span>{' '}
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
                      <Col md={3}>
                        ${item.price}
                        
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </div> */}
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
                  
                  <div>
                    <b>Package Name  </b> :{cartItems[0]?.packageName}
                    
                  </div>
                  <div> <b>price :</b> 
                    {cartItems[0]?.packagePrice}</div>
                    
                <div>
                        <b>price per pill:</b>{cartItems[0]?.packageperpill}
                </div>
                   
                  
                  
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
