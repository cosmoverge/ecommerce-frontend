import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Form } from 'react-bootstrap';
import ReactTable from 'react-table-6';
import swal from 'sweetalert';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [data, setData] = useState([]);

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const candleOrderHandler = async () => {
    let response = await axios.get(`/api/orders/cancel/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    console.log(response);
    fetchOrder();
  };

  const [
    {
      loading,
      error,
      order,

      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });
  console.log('order', order);
  async function fetchOrder() {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/orders/${orderId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      console.log('in side fetch', data);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log('in side the detail page::', order);
  useEffect(() => {
    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order._id || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, userInfo, orderId, navigate, successDeliver]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      swal('Order is delivered', "success");

      // toast.success('Order is delivered');
    } catch (err) {
      // swal(getError(err), "warning");
      swal({
        title: "Warning",
        text: getError(err),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  console.log('object', order);
  const fetchData = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      // setData(initialSortedData(data));
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
        payload: getError(err),
      });
    }
  };
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
          // handleSort('order-A-Z');
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
          // handleSort('order-A-Z');
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const orderQuantity = order?.orderItems?.map((ele)=>ele.quantity)
  console.log(' in the new console', order);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1  className='order_id' >Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            {order?.user == '63e3c8d79cd83b7e8beefb0a' ? (
              // <Card.Body>
              //   <Card.Title>Shipping</Card.Title>

              //   <Card.Text>
              //     <strong>Name:</strong> {order.shippingAddress?.fullName}{' '}
              //     <br />
              //     <strong>Address: </strong> {order.shippingAddress?.address},
              //     {order.shippingAddress?.city},{' '}
              //     {order.shippingAddress?.postalCode},
              //     {order.shippingAddress?.country}
              //     &nbsp;
              //     {order.shippingAddress?.location &&
              //       order.shippingAddress?.location?.lat && (
              //         <a
              //           target="_new"
              //           href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
              //         >
              //           Show On Map
              //         </a>
              //       )}
              //     <br />
              //     {!order.isDispatched &&
              //       !order.isCancelled &&
              //       !userInfo?.isAdmin && (
              //         <Link to={`/adress-edit/${order._id}`}>Edit</Link>
              //       )}
              //   </Card.Text>
              //   {/* {order.isDelivered ? (
              //   <MessageBox variant="success">
              //     Delivered at {order.deliveredAt}
              //   </MessageBox>
              // ) : (
              //   <MessageBox variant="danger">Not Delivered</MessageBox>
              // )} */}
              // </Card.Body> (
              <Card.Body>
                <Card.Title>Contact Details</Card.Title>

                <Card.Text>
                  <strong>Phone Number : </strong>{' '}
                  {order.contactDetails?.phoneNumber} <br />
                  {/* <strong>Whatsapp Number </strong>{' '}
                  {order.contactDetails?.whatsappNumber},<br />
                  <strong>Telegram Number </strong>{' '}
                  {order.contactDetails?.telegramNumber},<br />
                  <strong>iMessage Number </strong>{' '} */}
                  {/* {order.contactDetails?.iMessageNumber}, */}
                  <strong>Email </strong>
                  {order.contactDetails?.email},
                  <br />
                  <strong>Address: </strong> {order.contactDetails?.address},
                  {order.contactDetails?.city},{' '}
                  {order.contactDetails?.postalCode},
                  {order.contactDetails?.country}
                  <br />
                  {/* {!order.isDispatched && !order.isCancelled && (
                    <Link to={`/adress-edit/${order._id}`}>Edit</Link>
                  )} */}
                </Card.Text>
                {/* {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )} */}
              </Card.Body>
            ) : (
              <Card.Body>
                <Card.Title>Shipping</Card.Title>

                <Card.Text>
                  <strong>Name:</strong> {order.shippingAddress?.fullName}{' '}
                  <br />
                  <strong>Address: </strong> {order.shippingAddress?.address},
                  {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.postalCode},
                  {order.shippingAddress?.country}
                  &nbsp;
                  {order.shippingAddress?.location &&
                    order.shippingAddress?.location?.lat && (
                      <a
                        target="_new"
                        href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                      >
                        Show On Map
                      </a>
                    )}
                  <br />
                  {!order.isDispatched &&
                    !order.isCancelled &&
                    !userInfo?.isAdmin && (
                      <Link to={`/adress-edit/${order._id}`}>Edit</Link>
                    )}
                </Card.Text>
                {/* {order.isDelivered ? (
            <MessageBox variant="success">
              Delivered at {order.deliveredAt}
            </MessageBox>
          ) : (
            <MessageBox variant="danger">Not Delivered</MessageBox>
          )} */}
              </Card.Body>
            )}
            {/* <Card.Body>
              <Card.Title>Shipping</Card.Title>

              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress?.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress?.address},
                {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode},
                {order.shippingAddress?.country}
                &nbsp;
                {order.shippingAddress?.location &&
                  order.shippingAddress?.location?.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </a>
                  )}
                <br />
                {!order.isDispatched && !order.isCancelled && (
                  <Link to={`/adress-edit/${order._id}`}>Edit</Link>
                )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body> */}
          </Card>
          {order?.user == '63e3c8d79cd83b7e8beefb0a' ? null : (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {order.paymentMethod}
                </Card.Text>
                {/* {order.isPaid || order.paymentMethod === 'Cash On Delivery' ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )} */}
              </Card.Body>
            </Card>
          )}

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order?.orderItems?.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={3}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                      </Col>
                      <Col md={9}>
                        <div>
                          <ReactTable
                            data={[
                              {
                                quantity: item.quantity,
                                price: `$${order.itemsPrice }`,
                              },
                            ]}
                            columns={[
                              { Header: 'Quantity', accessor: 'quantity' },
                              { Header: 'Price', accessor: 'price' },
                            ]}
                            minRows={0}
                          />
                        </div>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {/* <ListGroup.Item>
                  <Row>
                    <Col>Package</Col>
                    <Col>${order.itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item> */}
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order?.shippingPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* <Row>
                    <Col>Tax</Col>
                    <Col>Rs.{order?.taxPrice?.toFixed(2)}</Col>
                  </Row> */}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order?.itemsPrice *orderQuantity}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {userInfo.isAdmin &&
                  (order?.isPaid ||
                    order?.paymentMethod === 'Cash On Delivery') &&
                  !order?.isDelivered && (
                    <ListGroup.Item>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      <div className="d-grid">
                        <Button
                          type="button"
                          disabled={!order?.isOutForDelivery}
                          onClick={deliverOrderHandler}
                        >
                          Deliver Order
                        </Button>
                        {!order.isCancelled ? (
                          <div style={{ margin: '5px' }}>
                            {order?.isOrderAccepted ||
                            order?.isOrderRejected ? null : (
                              <Button
                                style={{
                                  height: 'fit-content',
                                  width: '150px',
                                  // borderRadius: '5px',
                                }}
                                type="button"
                                variant="light"
                                onClick={() => handleOrder('ACCEPTED', order)}
                              >
                                Accept
                              </Button>
                            )}
                            &nbsp;
                            {order?.isOrderAccepted ? (
                              <p
                                style={{
                                  backgroundColor: '#85ca18',
                                  color: 'white',
                                  height: '30px',
                                  borderRadius: '6px',
                                  width: 'auto',
                                  paddingLeft: '20px',
                                }}
                              >
                                Order Accepted
                              </p>
                            ) : null || order.isOrderRejected ? (
                              <p
                                style={{
                                  backgroundColor: '#842029',
                                  color: 'white',
                                  height: '30px',
                                  borderRadius: '6px',
                                  width: 'auto',
                                  paddingLeft: '20px',
                                }}
                              >
                                Order Rejected
                              </p>
                            ) : (
                              <Button
                                style={{
                                  height: 'fit-content',
                                  width: '150px',
                                }}
                                type="button"
                                variant="light"
                                onClick={() => handleOrder('REJECTED', order)}
                              >
                                Reject
                              </Button>
                            )}
                            {order.isOrderAccepted ? (
                              <div className="delivery-status-btn-container">
                                <div className="delivery-status-btn"></div>

                                <div className="delivery-status-btn"></div>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <p
                            style={{
                              backgroundColor: '#842029',
                              color: 'white',
                              height: '30px',
                              borderRadius: '6px',
                              width: 'auto',
                              marginTop: '10px',
                              paddingLeft: '20px',
                            }}
                          >
                            Oder Cancelled
                          </p>
                        )}
                      </div>
                    </ListGroup.Item>
                  )}
                {!userInfo.isAdmin && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button
                        type="button"
                        disabled={order.isDispatched || order.isCancelled}
                        onClick={candleOrderHandler}
                      >
                        {order.isCancelled ? 'Order Cancelled' : 'Cancel Order'}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {order.isOrderAccepted && userInfo.isAdmin ? (
                  <div className="delivery-status-btn-container">
                    <div className="delivery-status-btn">
                      <label style={{ color: 'green' }}>Dispatched</label>
                      <Form.Check
                        name="dispatch"
                        defaultChecked={order.isDispatched ? true : false}
                        disabled={order.isDispatched ? true : false}
                        onClick={(e) => handleDeliveryStatus(e, order)}
                      />
                    </div>
                    <div className="delivery-status-btn">
                      <label style={{ color: 'green' }}>Out For Delivery</label>
                      <Form.Check
                        name="outForDelivery"
                        defaultChecked={order.isOutForDelivery ? true : false}
                        disabled={
                          order.isOutForDelivery || !order.isDispatched
                            ? true
                            : false
                        }
                        onClick={(e) => handleDeliveryStatus(e, order)}
                      />
                    </div>
                    <div className="delivery-status-btn">
                      <label style={{ color: 'green' }}>Delivered</label>
                      <Form.Check
                        name="delivered"
                        defaultChecked={order.isDelivered ? true : false}
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
                ) : null}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
