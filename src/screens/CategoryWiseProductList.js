import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import Rating from '../components/Rating';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import swal from 'sweetalert';

function CategoryWiseProductList() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [products, setProducts] = useState([]);
  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();

  const {
    cart: { cartItems },
  } = state;

  async function fetchProducts() {
    let PRODUCT_URL = `/api/products/search?category=${query.get('name')}`;

    if (query.get('type') === 'subCategory') {
      PRODUCT_URL = `/api/products/search?subCategory=${query.get('name')}`;
    }
    console.log(PRODUCT_URL);
    let response = await axios.get(PRODUCT_URL);
    console.log(response.data.products);
    setProducts(response.data.products);
  }
  useEffect(() => {
    fetchProducts();
  }, [query.get('name'), query.get('type')]);
  console.log(
    'products',
    products.map((ele) =>
      console.log(ele.reviews.map((product) => console.log(product.rating)))
    )
  );

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
  console.log('products', products);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const product = products.map((ele) => ele.category);
  return (
    
    <div style={{ position: 'relative', zIndex: '500' }}>
      <h1 style={{ position: 'relative', zIndex: '500' }}>{product[0]}</h1>
      {
        products?.length === 0 && <LoadingBox />
        //  <MessageBox>No Product Found</MessageBox>
      }
      <div className="products">
        {products?.map((ele) => {
          return (
            <div key={ele.slug} className="product">
              <Card style={{ width: '250px', height: '300px', margin: '2px' }}>
                <Link to={`/product/${ele.slug}`} style={{ height: '50%' }}>
                  {/* {ele?.length === 0 && <LoadingBox />} */}

                  <img
                    src={ele.image}
                    className="card-img-top"
                    alt={ele.name}
                    style={{ height: '100%', objectFit: 'contain' }}
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
                    to={`/product/${ele.slug}`}
                    style={{
                      fontSize: '15px',
                      display: 'block',
                      overflow: 'hidden',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{ele.name}</span>
                  </Link>
                  <Rating rating={ele.rating} numReviews={ele.numReviews} />
                  <Card.Text>
                    <div>
                      <span style={{ fontSize: '20px' }}>
                        {' '}
                        <b>${ele.price - ele.productDiscountedPrice} </b>
                      </span>
                      <span
                        style={{
                          textDecoration: 'line-through',
                          margin: '10px',
                        }}
                      >
                        {' '}
                        ${ele.price}
                      </span>

                      <span
                        style={{
                          margin: 'auto',
                          // background: '#dc3545',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'green',
                        }}
                      >
                        {Math.floor(
                          (ele.productDiscountedPrice / ele.price) * 100
                        )}
                        % off
                      </span>
                    </div>
                  </Card.Text>

                  {ele.countInStock === 0 ? (
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
                    <Button onClick={() => addToCartHandler(ele)}>
                      <span
                        style={{
                          height: '25px',
                          itemAlign: 'center',
                          padding: '2px',
                        }}
                        className='add_to_cart'
                      >
                        {' '}
                        Add to cart
                      </span>
                    </Button>
                  )}
                </div>
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
      {/* <div>
        <h4>Best seller</h4>
        {products.map((product) => {
          return product.map((rating) => {});
        })}
      </div> */}
    </div>
  );
}

export default CategoryWiseProductList;
