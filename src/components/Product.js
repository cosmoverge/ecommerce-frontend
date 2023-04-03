import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import AddToCart from '../screens/CartScreen';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function Product(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  // const _slice = props.product.slice(0, show);
  // console.log('slice', _slice);
  const [modal, setModal] = useState(false);

  const {
    userInfo,
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();

  const addToCartHandler = async (e, item) => {
    e.preventDefault();
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
    // navigate('cart');
    // toast.success(`${item.name} Added to the cart`);
    // }
    // else {
    //   navigate('/signin');
    // }
  };
  const discountPrice =
    props.product.price - props.product.productDiscountedPrice;
    const pricePerPill =(discountPrice/30).toFixed(2)
  const percentage = Math.floor(
    (props.product.productDiscountedPrice / props.product.price) * 100
  );

  let returnCategoryComponent = function () {
    let doc = document.getElementsByClassName('caregoryList');
    if (window.location.pathname === ('/signin' || '/signup')) {
      doc.classList?.add('hide');
    } else {
      doc.classList?.remove('hide');
    }
  };

  setTimeout(() => {
    returnCategoryComponent();
  }, 500);

  console.log(userInfo);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClickScroll = () => {
    // const element = document.getElementById('section-1');
    // if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      window.scrollTo(0, 300);
          // }
  };  


console.log('is side product',props.product)

  return (
    <>
      <div>
        <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>Added Cart</ModalHeader>
          <ModalBody>
            <AddToCart />
          </ModalBody>
        </Modal>
      </div>
      {props.product.countInStock ===0 ?null:<Card
        style={{
          width: '250px',
          height: '400px',
          margin: '2px',
        }}
        onClick = {handleClickScroll}
      >
       {/* <span
                style={{
                  // margin: 'auto',
                  // background: '#dc3545',
                  color: 'green',
                  fontSize: '15px',
                  fontWeight: 600,

                }}
              >
                {percentage}% OFF
              </span> */}
        <Link to={`/product/${props.product.slug}`} style={{ height: '50%' }}>
          <img
            src={props.product.image}
            className="card-img-top"
            alt={props.product.name}
            style={{
              height: '100%',
              objectFit: 'contain',
              paddingTop: '5px',
            }}
          />
        </Link>
        <div
          style={{ textAlign: 'center', padding: '5px', overflow: 'overlay' }}
        >
          <Link
            to={`/product/${props.product.slug}`}
            style={{
              fontSize: '15px',
              display: 'block',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'green',
            }}
          >
            <span>{props.product.name}</span>
          </Link>
          <Rating
            rating={props.product.rating}
            numReviews={props.product.numReviews}
          />
&nbsp;
          <Card.Text>
            <div>
            <b style={{paddingBottom:'10px'}} >Only ${pricePerPill} per pill</b><br/>
            
              <span style={{ fontSize: '20px' ,paddingBottom:'7px'}}>
                <b>${discountPrice}</b>
              </span>
              &nbsp;&nbsp;
              <span
                style={{
                  textDecoration: 'line-through',
                  margin: '10px',
                  paddingBottom:'7px'
                }}
              >
                {' '}
                ${props.product.price}
              </span>{' '}
              &nbsp; &nbsp;
              
              <span
                style={{
                  margin: 'auto',
                  // background: '#dc3545',
                  color: 'green',
                  fontSize: '15px',
                  fontWeight: 600,
                  paddingBottom:'7px'

                }}
              >
                {percentage}% OFF
              </span>
            </div>
          </Card.Text>
          {props.product.countInStock === 0 ? (
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
            <Button onClick={(e) => addToCartHandler(e, props.product)}>
              <span
                style={{
                  height: '25px',
                  itemAlign: 'center',
                  padding: '2px',
                }}
                className='add_to_cart'
              >
                Buy Now
              </span>
            </Button>
          )}
        </div>
      </Card>}
      
    </>
  );
}
