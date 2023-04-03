import React, { useContext, useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from '../../Store';
import { Link, useNavigate } from 'react-router-dom';
import Rating from '../Rating';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import CartScreen from '../../screens/CartScreen';

export default function BestSeller(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [show, setShow] = useState(10);
  const [modal, setModal] = useState(false);

  const {
    userInfo,
    cart: { cartItems },
  } = state;
  console.log('props', props.product);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === props.product._id);
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
    setModal(!modal);
    // if (state.userInfo) {
    // toast.success(`${item.name} Added to the cart`);
    // }
    // else {
    //   navigate('/signin');
    // }
  };
  const _slice = props.product.slice(0, show);
  console.log('slice in best', _slice);
  const loadMore = () => {
    setShow(show + show);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
console.log('in the pocket', _slice.length)
  return (
    <>
      <div style={{ width: '99%' }} className="page-heading">
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)}>
            <ModalHeader toggle={() => setModal(!modal)}>
              Added Cart
            </ModalHeader>
            <ModalBody>
              <CartScreen />
            </ModalBody>
          </Modal>
        </div>
        {/* {_slice.length ===0 ?null:<div><h2 className='title_mblview'>Best Sellers</h2>
        <div className="viweAll">
          <Link
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              // marginBottom: '2%',
              fontSize: '18px',
            }}
            to="/allBestSeller"
            // onClick={() => loadMore()}
          >
            View all
          </Link>
        </div></div> } */}
        
      </div>
      {/* <h2 className="page-heading">Best Sellers</h2> */}

      <Row className="justify-content-evenly">
        {_slice.map((product) =>
          product.rating >= 2.4 ? (
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
              <Card
                style={{
                  width: '250px',
                  height: '300px',
                  margin: '2px',
                }}
              >
                <Link to={`/product/${product.slug}`} style={{ height: '50%' }}>
                  <img
                    className="card-img-top"
                    src={product.image}
                    alt={product.name}
                    style={{
                      height: '100%',
                      objectFit: 'contain',
                      paddingTop: '5px',
                    }}
                  />
                </Link>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '5px',
                    overflow: 'overlay',
                  }}
                >
                  <Link
                    to={`/product/${product.slug}`}
                    style={{
                      fontSize: '15px',
                      display: 'block',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      color: 'green',
                    }}
                  >
                    <span>{product.name}</span>
                  </Link>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                  <Card.Text>
                    <div>
                      <span style={{ fontSize: '20px' }}>
                        <b>
                          ${product.price - product.productDiscountedPrice}
                        </b>
                      </span>
                      <span
                        style={{
                          textDecoration: 'line-through',
                          margin: '10px',
                        }}
                      >
                        {' '}
                        ${product.price}
                      </span>{' '}
                      &nbsp; &nbsp;
                      <span
                        style={{
                          margin: 'auto',
                          // background: '#dc3545',
                          color: 'green',
                          fontSize: '15px',
                          fontWeight: 600,
                        }}
                      >
                        {Math.floor(
                          (product.productDiscountedPrice / product.price) * 100
                        )}
                        % OFF
                      </span>
                    </div>
                  </Card.Text>
                  {product.countInStock === 0 ? (
                    state?.userInfo?.isAdmin ? null : (
                      <Button variant="light" disabled>
                        <span
                          style={{
                            height: '25px',
                            itemAlign: 'center',
                            padding: '2px',
                          }}
                        >
                          {' '}
                          Out of stock
                        </span>
                      </Button>
                    )
                  ) : state?.userInfo?.isAdmin ? null : (
                    <Button onClick={() => addToCartHandler(product)}>
                      <span
                        style={{
                          height: '25px',
                          itemAlign: 'center',
                          padding: '2px',
                        }}
                        className='add_to_cart'
                      >
                        Add to cart
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          ) : null
        )}
      </Row>
    </>
  );
}
