import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
// import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const weeklySales = summary?.dailyOrders
    .slice(-7)
    .reduce((finalArr, item) => {
      // {day:item._id,count:item.orders}
      let order = [];
      let day = item._id;
      order.push(day);
      let itemCount = `${item.orders} Items, Rs: ${item.sales}`;
      order.push(itemCount);
      finalArr.push(order);
      return finalArr;
    }, []);

  let barChartData = [];
  if (weeklySales?.length > 0) {
    barChartData = [['Day', ''], ...weeklySales];
  }
  const barChartOptions = {
    legend: { position: 'none' },

    chart: {
      title: 'Last 7 Days Sales',

      // subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
  };

  let totalAcceptedCount = 0;
  let totalDispatchedCount = 0;
  let totalRejectedCount = 0;
  let totalCancelledCount = 0;
  let totalDeliveredCount = 0;
  let totalOutForDeliveryCount = 0;

  const currentOrderStatus = summary?.orderStatus
    .slice(-7)
    .reduce((finalArr, item, i) => {
      let adminAcceptedCount = item?.isOrderAccepted.reduce((ttl, item) => {
        if (item === true) {
          ttl = ttl + 1;
        }
        return ttl;
      }, 0);
      let isCancelled = item?.isCancelled.reduce((ttl, item) => {
        if (item === true) {
          ttl = ttl + 1;
        }
        return ttl;
      }, 0);
      let isOrderRejected = item?.isOrderRejected.reduce((ttl, item) => {
        if (item === true) {
          ttl = ttl + 1;
        }
        return ttl;
      }, 0);
      let isDispatched = item?.isDispatched.reduce((ttl, item) => {
        if (item === true) {
          ttl = ttl + 1;
        }
        return ttl;
      }, 0);

      let isOutForDelivery = item?.isOutForDelivery.reduce((ttl, item) => {
        if (item === true) {
          ttl = ttl + 1;
        }
        return ttl;
      }, 0);

      let isDelivered = item?.isDelivered.reduce((ttl, item) => {
        if (item === true) {
          ttl = ttl + 1;
        }
        return ttl;
      }, 0);

      if (isDispatched > 0 && isOutForDelivery === 0) {
        isDispatched = isDispatched - isOutForDelivery;
      } else if (isOutForDelivery > 0 && isDispatched > 0) {
        isDispatched = isDispatched - isOutForDelivery;
        if (isDelivered > 0) {
          isOutForDelivery = isOutForDelivery - isDelivered;
        }
      }

      //  else if (isDelivered > 0 && isOutForDelivery === isDelivered ) {
      //               console.log("first if")
      //               isDispatched=0
      //               isOutForDelivery = 0
      //               adminAcceptedCount=0

      //             }

      // console.log("dispatched",isDispatched,i)
      // console.log("out For dlivery",isOutForDelivery,i)
      // console.log("deliveried",isDelivered,i)

      totalAcceptedCount = adminAcceptedCount + totalAcceptedCount;
      totalDispatchedCount = totalDispatchedCount + isDispatched;
      totalRejectedCount = totalRejectedCount + isOrderRejected;
      totalCancelledCount = totalCancelledCount + isCancelled;
      totalDeliveredCount = totalDeliveredCount + isDelivered;
      totalOutForDeliveryCount = totalOutForDeliveryCount + isOutForDelivery;

      return finalArr;
    }, {});

  const pieChartData = [
    ['Status', 'Count'],
    ['Accepted ', totalAcceptedCount],
    ['Dispatched ', totalDispatchedCount],
    ['Out For Delivery ', totalOutForDeliveryCount],
    ['Delivered ', totalDeliveredCount],
    ['Rejected ', totalRejectedCount],
    ['Canceled ', totalCancelledCount],
  ];

  const pieChartOptions = {
    title: 'Last 7 Days Orders Status',
  };

  console.log(summary);

  const weeklyOrderLineChart = summary?.dailyOrders?.map((x) => [
    x._id,
    x.sales,
  ]);
  console.log(weeklyOrderLineChart);

  let data = [];

  if (weeklyOrderLineChart?.length > 0) {
    data = [['x', 'Sales'], ...weeklyOrderLineChart];
  }

  const options = {
    legend: { position: 'none' },
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Sales',
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#F1F5F9' }}>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Total Amount</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* <div className='row justify-content-end align-items-end'>
                <div className='col-md-2 col-sm-12'>
                <label>Start Date</label>
                <input className='form-control' type='date'/>
                  
                  </div>
                <div className='col-md-2 col-sm-12'>
                <label>End Date</label>
                <input className='form-control' type='date'/>
                  
                  </div>
                <div className='col-md-1 col-sm-12'>
                  <button className='btn btn-primary'>Submit</button>
                  </div>
          </div> */}
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="my-3">
                <h2>Sales</h2>
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Sale</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="AreaChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ['Date', 'Sales'],
                      ...summary.dailyOrders?.map((x) => [x._id, x.sales]),
                    ]}
                  ></Chart>
                )}
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="my-3">
                <h2>Categories</h2>
                {summary.productCategories.length === 0 ? (
                  <MessageBox>No Category</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="PieChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ['Category', 'Products'],
                      ...summary.productCategories?.map((x) => [
                        x._id,
                        x.count,
                      ]),
                    ]}
                  ></Chart>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={barChartData}
                options={barChartOptions}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <Chart
                chartType="PieChart"
                data={pieChartData}
                options={pieChartOptions}
                width={'100%'}
                height={'400px'}
              />
            </div>
          </div>
          {/* <div className='row'>
                <div className='col-md-6 col-sm-12'>
                    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
                </div>
              </div> */}
        </>
      )}
    </div>
  );
}
