import React, { useState, useEffect, useContext, useReducer } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [sort, setSort] = useState('order-A-Z');

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        initialSortedData(data);
        console.log(data);
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  const initialSortedData = (data) => {
    console.log('initialSortedData', data);
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
  useEffect(() => {
    initialSortedData();
  }, [orders, sort]);
  if (orders?.length === 0) {
    return <MessageBox>No Active Orders</MessageBox>;
  }

  return (
    <div className="history">
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {' '}
                  <img
                    src={order?.orderItems?.map((a) => a.image)}
                    alt=""
                    className="orders-img"
                  />
                </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.itemsPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDispatched &&
                  !order.isOutForDelivery &&
                  !order.isDelivered
                    ? 'Dispatched'
                    : order.isOutForDelivery &&
                      order.isDispatched &&
                      !order.isDelivered
                    ? 'Out For Delivery'
                    : order.isDelivered
                    ? 'Delivered'
                    : order.isOrderAccepted
                    ? 'Order Accepted'
                    : order.isOrderRejected
                    ? 'Order Rejected'
                    : order.isCancelled
                    ? 'Order Cancelled'
                    : 'Pending'}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
