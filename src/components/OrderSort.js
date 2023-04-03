import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
// import MessageBox from './MessageBox';
// import SearchBox from './SearchBox';
// import { LoadScriptNext } from '@react-google-maps/api';
import LoadingBox from './LoadingBox';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
        countOrders: action.payload.countOrders,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function OrderSort() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/orders/search?page=${page}&query=${query}&category=${category}&price=${price}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query]);
  console.log('orders user:::', order);
  const getFilterUrl = (filter) => {
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const sortOrder = filter.order || order;
    return `/orders?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`;
  };
  console.log('inside the new order file', orders);
  return (
    <div>
      <Row>
        {/* <SearchBox /> */}
        <Col md={6}>
          {/* <div>
            {countOrders === 0 ? 'No' : countOrders} Results
            {query !== 'all' && ' : ' + query}
            {category !== 'all' && ' : ' + category}
            {price !== 'all' && ' : Price ' + price}
            {query !== 'all' || category !== 'all' || price !== 'all' ? (
              <Button variant="light" onClick={() => navigate('/search')}>
                <i className="fas fa-times-circle"></i>
              </Button>
            ) : null}
          </div> */}
        </Col>
        <Col className="text-end">
          Sort by{' '}
          <select
            value={order}
            onChange={(e) => {
              navigate(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
          </select>
        </Col>
      </Row>
      {
        orders?.length === 0 && <LoadingBox />
        //  <MessageBox>No Product Found</MessageBox>
      }
      <Row>
        {orders?.map((order) => (
          <Col sm={6} lg={4} className="mb-3" key={order._id}>
            <table className="table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>USER</th>
                  <th>ORDERED DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>DELIVERED DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img
                        src={order?.orderItems?.map((a) => a.image)}
                        alt=""
                        className="orders-img"
                      />
                    </td>
                    <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                    </td>
                    <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                    <td>
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : 'No Yet Delivered'}
                    </td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                      >
                        Details
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        // onClick={() => deleteHandler(order)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        ))}
      </Row>
    </div>
  );
}
