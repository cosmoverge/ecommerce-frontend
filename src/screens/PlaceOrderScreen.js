import React, { useContext, useEffect, useReducer, useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import { Helmet } from "react-helmet-async";
import swal from "sweetalert";
import ReactTable from "react-table-6";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  console.log("cart", state.cart);
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.discountPrice = round2(
    cart.cartItems.reduce(
      (a, c) => a + c.quantity * c.productDiscountedPrice,
      0
    )
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice - cart.discountPrice;
  // const placeOrderHandler = async () => {
  //   try {
  //     dispatch({ type: 'CREATE_REQUEST' });
  //     const { data } = await Axios.post(
  //       '/api/orders',
  //       {
  //         orderItems: cart.cartItems,
  //         shippingAddress: cart.shippingAddress,
  //         paymentMethod: cart.paymentMethod,
  //         contactDetails: cart.contactDetails,
  //         itemsPrice: cart.itemsPrice,
  //         shippingPrice: cart.shippingPrice,
  //         taxPrice: cart.taxPrice,
  //         totalPrice: cart.totalPrice,
  //       },
  //       {
  //         headers: {
  //           authorization: `Bearer ${userInfo.token}`,
  //         },
  //       }
  //     );
  //     console.log(data);
  //     ctxDispatch({ type: 'CART_CLEAR' });
  //     dispatch({ type: 'CREATE_SUCCESS' });
  //     localStorage.removeItem(`${userInfo._id}`);

  //     swal({
  //       title: 'Success',
  //       text: ` ${data.order.orderItems.map(
  //         (ele) => ele.name
  //       )} item order has been placed`,
  //       icon: 'success',
  //       button: 'close',
  //     });
  //     navigate(`/order/${data.order._id}`);
  //   } catch (err) {
  //     dispatch({ type: 'CREATE_FAIL' });
  //     toast.error(getError(err));
  //   }
  // };
   const cartPrice = cart.cartItems.map((item) => {
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
  const myPackageName = cart.cartItems.map((ele)=>ele.packageName)

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const token = userInfo
        ? userInfo.token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYzhkNzljZDgzYjdlOGJlZWZiMGEiLCJuYW1lIjoiZ3Vlc3R1c2VyIiwiZW1haWwiOiJndWVzdEBleGFtcGxlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NzU4NzI0NzEsImV4cCI6MjYyMjYwMDQ3MX0.byzxrrei5Q9E-y_DRSGjj8KyUDRac2vw6ZuNtpG1Nw8";
      console.log("token", token);
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          contactDetails: cart.contactDetails,
          itemsPrice:cartPrice[0],
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          // packageName:myPackageName[0]
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem(`${userInfo?._id}`);

      swal({
        title: "Success",
        text: "Thanks for Ordering! Our customer executive will contact you shortly!",
        icon: "success",
        button: "close",
      });

      // swal({
      //   title: 'Success',
      //   text: ` ${data.order.orderItems.map(
      //     (ele) => ele.name
      //   )} item order has been placed`,
      //   icon: 'success',
      //   button: 'close',
      // });

      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
            // swal(getError(err), "warning");
            swal({
              title: "Warning",
              text: getError(err),
              icon: "warning",
              button: "close",
            });
      // toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  console.log("inside the place order:::", cart.cartItems);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const getmyPackage = cart.cartItems.map((ele) => {
    if(ele.packageName == undefined){
      return Number (ele.productDiscountedPrice)
    }else{
      return Number (0)
    }
  });
  console.log("cart price in place order", getmyPackage);
const getQuantity = cart.cartItems.map((ele)=>ele.quantity) 
  return (
    <div>
      <CheckoutSteps step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          {/* <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card> */}
          {state?.userInfo ? (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {cart.paymentMethod}
                </Card.Text>
                <Link to="/payment">Edit</Link>
              </Card.Body>
            </Card>
          ) : (
            ""
          )}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={3}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                      </Col>
                      <Col md={9}>
                        <div>
                          <ReactTable
                            data={[
                              {
                                quantity: item.quantity,
                                price: `$${cartPrice}`,
                                // price: `$  ${item.priceFor30Pills ||
                                //   item.priceFor45Pills ||
                                //   item.priceFor60Pills ||
                                //   item.priceFor90Pills ||
                                //   item.priceFor120Pills ||
                                //   item.priceFor250Pills ||
                                //   item.priceFor300Pills !== 0
                                //     ? item.price
                                //     : item.priceFor30Pills ||
                                //       item.priceFor45Pills ||
                                //       item.priceFor60Pills ||
                                //       item.priceFor90Pills ||
                                //       item.priceFor120Pills ||
                                //       item.priceFor250Pills ||
                                //       item.priceFor300Pills}`,
                              },
                            ]}
                            columns={[
                              { Header: "Quantity", accessor: "quantity" },
                              { Header: "Price", accessor: "price" },
                            ]}
                            minRows={0}
                          />
                        </div>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      {/* <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>Rs.{item.price}</Col> */}
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cartPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(0)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* <Row>
                    <Col>Tax</Col>
                    <Col>Rs.{cart.taxPrice.toFixed(2)}</Col>
                  </Row> */}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Discount Price</Col>
                    <Col>${getmyPackage}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      
                        <strong>
                          $
                          {(Number(cartPrice) +
                            Number(cart.shippingPrice) -
                            Number(getmyPackage))*getQuantity}
                        </strong>
                    
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {/* {loading && <LoadingBox></LoadingBox>} */}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
