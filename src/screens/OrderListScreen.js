import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
// import { Form, FormControl, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
// import OrderSort from '../components/OrderSort';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        // filter_orders: [...action.payload],
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};
export default function OrderListScreen() {
  const [data, setData] = useState([]);

  const initialSortedData = (data) => {
    return data?.sort(function (a, b) {
      let date1 = new Date(a.createdAt).getTime();
      let date2 = new Date(b.createdAt).getTime();
      if (date1 > date2) {
        return -1;
      }
      if (date1 < date2) {
        return 1;
      }

      return 0;
    });
  };

  // const { search } = useLocation();
  // const sp = new URLSearchParams(search); // /search?category=Shirts
  // const category = sp.get('category') || 'all';
  // const query = sp.get('query') || 'all';
  // const price = sp.get('price') || 'all';
  // const order = sp.get('order') || 'newest';
  // const page = sp.get('page') || 1;
  // const { search } = useLocation();
  // const sp = new URLSearchParams(search); // /search?category=Shirts
  // const users = sp.get('users') || 'all';
  // const products = sp.get('products') || 'all';
  const [sort, setSort] = useState('order-A-Z');
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const fetchData = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      setData(initialSortedData(data));
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
        payload: getError(err),
      });
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  // const deleteHandler = async (order) => {
  //   if (window.confirm('Are you sure to delete?')) {
  //     try {
  //       dispatch({ type: 'DELETE_REQUEST' });
  //       await axios.delete(`/api/orders/${order._id}`, {
  //         headers: { Authorization: `Bearer ${userInfo.token}` },
  //       });
  //       toast.success('order deleted successfully');
  //       dispatch({ type: 'DELETE_SUCCESS' });
  //     } catch (err) {
  //       toast.error(getError(error));
  //       dispatch({
  //         type: 'DELETE_FAIL',
  //       });
  //     }
  //   }
  // };

  const handleSort = (method) => {
    setSort(method);
    if (method === 'highest') {
      const sorted = orders?.sort(function (a, b) {
        if (a.totalPrice > b.totalPrice) return -1;
        if (b.totalPrice > a.totalPrice) return 1;
        return 0;
      });
      setData(sorted);
    } else if (method === 'lowest') {
      const sorted = orders?.sort(function (a, b) {
        if (b.totalPrice > a.totalPrice) return -1;
        if (a.totalPrice > b.totalPrice) return 1;
        return 0;
      });

      setData(sorted);
    } else if (method === 'user-A-Z') {
      const sorted = orders?.sort(function (a, b) {
        const nameA = a?.user?.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.user?.name.toUpperCase();
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }

        return 0;
      });

      setData(sorted);
    } else if (method === 'user-Z-A') {
      const sorted = orders?.sort(function (a, b) {
        const nameA = a?.user?.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.user?.name.toUpperCase();
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }

        return 0;
      });

      setData(sorted);
    } else if (method === 'order-A-Z') {
      const sorted = orders?.sort(function (a, b) {
        let date1 = new Date(a.createdAt).getTime();
        let date2 = new Date(b.createdAt).getTime();
        if (date1 > date2) {
          return -1;
        }
        if (date1 < date2) {
          return 1;
        }

        return 0;
      });
      console.log(method);
      console.log(data);

      setData(sorted);
    }
  };

  useEffect(() => {
    // sortArray(sort);
  }, [orders, sort, data]);

  const [orderStatus, setOrderStatus] = useState();

  async function handleDeliveryStatus(e, order) {
    const { value, name } = e.target;

    let orderId = order?._id;

    try {
      let response = await axios.patch(
        `/api/orders/updateStatus/${orderId}`,
        { status: name },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (response.data.message === 'Order Status Updated') {
        setTimeout(() => {
          fetchData();
          handleSort('order-A-Z');
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleOrder(type, order) {
    let orderId = order?._id;

    try {
      let response = await axios.get(
        `/api/orders/handleOrder/${orderId}/${type}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (response.data.message === 'Order Status Updated') {
        setTimeout(() => {
          fetchData();
          //  sortArray(sort)
          handleSort('order-A-Z');
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleReadStatus = async (order, index) => {
    let orderId = order?._id;
    let currentData = data[index];
    let updatedData = { ...currentData, isRead: true };
    data[index] = updatedData;
    setData(data);
    try {
      let response = await axios.get(`/api/orders/markAsRead/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (response.data.message === 'Order Status Updated') {
        setTimeout(() => {
          fetchData();
          //  sortArray(sort)
          handleSort('order-A-Z');
          navigate(`/order/${order._id}`);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // console.log('data', data);
  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      <div>
        <form action="#">
          <label htmlFor="sort"></label>
          <select
            onChange={(e) => handleSort(e.target.value)}
            // onClick={sorting}
            defaultValue="order-A-Z"
          >
            <option value="lowest">Price: low to high</option>
            {/* <option value="#" disabled></option> */}
            <option value="highest"> Price: high to low</option>
            <option value="user-A-Z"> User:A to Z</option>
            <option value="user-Z-A"> User: Z to A</option>
            <option value="order-A-Z"> Recent Orders</option>
          </select>
        </form>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
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
            {data?.map((order, i) => (
              <tr
                key={order._id}
                className={order.isRead ? 'read-container' : ''}
                style={order.isRead ? { backgroundColor: 'aqua' } : {}}
              >
                {/* onClick={order.isRead && order.isDelivered ? ()=>navigate((`/order/${order._id}`)) : ()=>{}} */}
                <td>
                  <img
                    src={order?.orderItems?.map((a) => a.image)}
                    alt=""
                    className="orders-img"
                  />
                </td>

                <td>{order.user ? order.user.name : 'UNREGISTERED USER'}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>{order.itemsPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                <td>
                  {order?.isDelivered
                    ? order?.deliveredAt?.toString().split('T')[0]
                    : 'No Yet Delivered'}
                </td>
                <td>
                  <div className="action-container">
                    <div>
                      <Button
                        style={{ height: 'fit-content' }}
                        type="button"
                        variant="light"
                        onClick={() => {
                          handleReadStatus(order, i);
                        }}
                      >
                        Details
                      </Button>
                      {/* <div className="delivery-status-read-btn">
                        <label>Read</label>
                        <Form.Check
                          name="read"
                          defaultChecked={order.isRead ? true : false}
                          onClick={() => handleReadStatus(order, i)}
                        />
                      </div> */}
                    </div>
                    &nbsp;
                    {/* <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button> */}
                    {!order.isCancelled ? (
                      <div>
                        {order.isOrderAccepted ||
                        order.isOrderRejected ? null : (
                          <Button
                            style={{ height: 'fit-content' }}
                            type="button"
                            variant="light"
                            onClick={() => handleOrder('ACCEPTED', order)}
                          >
                            Accept
                          </Button>
                        )}
                        &nbsp;
                        {order.isOrderAccepted ? (
                          'Order Accepted'
                        ) : null || order.isOrderRejected ? (
                          'Order Rejected '
                        ) : (
                          <Button
                            style={{ height: 'fit-content' }}
                            type="button"
                            variant="light"
                            onClick={() => handleOrder('REJECTED', order)}
                          >
                            Reject
                          </Button>
                        )}
                        {/* {order.isOrderAccepted ? (
                          <div className="delivery-status-btn-container">
                            <div className="delivery-status-btn">
                              <label>Dispatched</label>
                              <Form.Check
                                name="dispatch"
                                defaultChecked={
                                  order.isDispatched ? true : false
                                }
                                disabled={order.isDispatched ? true : false}
                                onClick={(e) => handleDeliveryStatus(e, order)}
                              />
                            </div>
                            <div className="delivery-status-btn">
                              <label>Out For Delivery</label>
                              <Form.Check
                                name="outForDelivery"
                                defaultChecked={
                                  order.isOutForDelivery ? true : false
                                }
                                disabled={
                                  order.isOutForDelivery || !order.isDispatched
                                    ? true
                                    : false
                                }
                                onClick={(e) => handleDeliveryStatus(e, order)}
                              />
                            </div>
                            <div className="delivery-status-btn">
                              <label>Delivered</label>
                              <Form.Check
                                name="delivered"
                                defaultChecked={
                                  order.isDelivered ? true : false
                                }
                                disabled={
                                  order.isDelivered ||
                                  !order.isDispatched ||
                                  !order.isOutForDelivery
                                    ? true
                                    : false
                                }
                                onClick={(e) => handleDeliveryStatus(e, order)}
                              />
                            </div>
                          </div>
                        ) : null} */}
                      </div>
                    ) : (
                      'Oder Cancelled'
                    )}
                  </div>
                </td>
                {/* </div> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
