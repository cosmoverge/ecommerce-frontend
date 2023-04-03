import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreens';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import AddToCart from './screens/ContinueShopping';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import Footer from './components/Footer';
import SlidingProducts from './components/SliderScreens/SlidingProducts';
import SlideProductScreen from './components/SliderScreens/SlideProductScreen';
import SliderCartScreen from './components/SliderScreens/SliderCartScreen';
import SlideListScreen from './components/SliderScreens/SlideListScreen';
import SliderEditScreen from './components/SliderScreens/SliderEditScreen';
import EditShippingAdress from './screens/EditShippingAdress';
import CreateSlide from './components/SliderScreens/CreateSlide';
import CategoryWiseProductList from './screens/CategoryWiseProductList';
import { NavLink } from 'react-router-dom';
import SubMenuComp from './components/Sidebar/SubMenu';
import CreateProduct from './screens/CreateProduct';
import CreateCateogry from './screens/CreateCateogry';
import ContactDetailScreen from './screens/ContactDetailScreen';
import BlackFridaySale from './components/Black-friday-sale/BlackFridaySale';
import ViewAllProducts from './screens/ViewAllProducts';
import { getError } from './utils';
import SignUpInfo from './screens/SignUpInfo';
import ViewBestSellerScreen from './screens/ViewBestSellerScreen';
import ViewDealOfTheDayProducts from './screens/ViewDealOfTheDayProducts';
import Pills from './screens/Pills';
import swal from "sweetalert";

function App() {
  const {
    state,
    dispatch: ctxDispatch,
    // getInitialValues
  } = useContext(Store);
  const { cart, userInfo, fullBox } = state;
// const [show, setShow] = useState(false)
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('cartItems');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  console.log('in side to get flexbox',state);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/getAllCats');
        setCategories(data);
      } catch (err) {
        swal(getError(err), "error");
        // toast.error(getError(err));
      }
    };

    fetchCategories();
  }, [state]);

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const hidecontent= ()=>{
  //   console.log('inside the function');
  //   return <div style={{visibility:'hidden'}}></div>
  // }

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        } // style={{ minWidth: '626px' }}
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar
            variant="dark"
            style={{
              backgroundColor: '#2c2626',
              display: 'block',
              padding: '20px',
            }}
            expand="lg"
          >
            <Container>
              {/* <div className="move-heading"> */}
              <LinkContainer to="/">
              <img
              className='headerImage'
                src="//cdn.shopify.com/s/files/1/0432/0609/t/3/assets/logo.png?v=3239645435533822301397117626"
                alt="Nutrition supplements"
              ></img>
              </LinkContainer>
              
              <LinkContainer to="/">
                <Navbar.Brand>
                  <div className="headerText">
                    <span className="headericon">RX</span>
                    <span className="subheadericon">
                      MEDICINE ONLINE
                      {/* <br height="0px" /> */}
                      
                    </span>
                  </div>
                </Navbar.Brand>
              </LinkContainer>
              {/* </div> */}

              {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav"> */}
              <div
                className="searchBox"
                style={
                  {
                    // alignItem: 'center',
                    // paddingLeft: '9.4rem',
                    // width: '600px',
                  }
                }
              >
                <SearchBox />
              </div>
              <Nav
                className="me-auto  w-100  justify-content-end"
                style={{ display: 'inline-grid' }}
              >
                {userInfo ? (
                  <span
                    style={{
                      color: 'wheat',
                      display: 'flex',
                      flexDirection: ' row-reverse',
                      height: ' 30px',
                      width: 'auto',
                    }}
                  >
                    <a
                      href="#signout"
                      style={{
                        // marginRight: '160px',
                        marginTop: '5px',
                        textDecoration: 'none',
                        color: '#fff',
                        // fontSize: '15px',
                        width: 'auto',
                        marginRight: '100px',
                      }}
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </a>
                  </span>
                ) : (
                  <span
                    style={{
                      color: 'wheat',
                      display: 'flex',
                      flexDirection: ' row-reverse',
                      height: ' 30px',
                      width: 'auto',
                    }}
                  >
                    {' '}
                    <a
                      href="/signin"
                      style={{
                        // marginRight: '160px',
                        marginTop: '5px',
                        textDecoration: 'none',
                        color: '#fff',
                        // fontSize: '15px',
                        width: 'auto',
                        marginRight: '100px',
                      }}
                    >
                      SignIn
                    </a>
                  </span>
                )}

                {userInfo?.isAdmin ? null : (
                  <div
                    style={{
                      borderRadius: '0.7rem',
                      background: '#75b510',
                      width: '7.5rem',
                      height: '3.75rem',
                      padding: '1rem',
                      marginRight: '3.75rem',
                      marginTop: '0.7rem',
                    }}
                  >
                    <a
                      href="/cart"
                      className="nav-a"
                      style={{ color: 'white' }}
                    >
                      <i
                        className="fas fa-shopping-cart"
                        style={{ color: 'white' }}
                      ></i>
                      <span style={{ color: 'white', fontSize: '17px' }}>
                        {' '}
                        Cart
                      </span>{' '}
                      {
                        cart.cartItems.length > 0 && (
                          // (userInfo ? (

                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )
                        // ) : null)
                      }
                    </a>
                    {/* // )} */}
                  </div>
                )}
              </Nav>
              {/* </Navbar.Collapse> */}
            </Container>
          </Navbar>
        </header>
        <div className="category-div">
          <div
            className="draging"
            style={{
              // width: '100% !important',
              width: '70%',

              // maxWidth: '1000px',
              // position: 'relative',
              // zIndex: 99,
              // borderTop: ' 1px solid #534b4b',
              background: 'linear-gradient(to bottom,#3f3737 0%,#2e2727 100%)',
              // margin: 'auto',
              // borderRadius: '6px',
              display: 'flex',
              flexDirection: 'row-reverse',
              // marginTop: '30px',
              // border: '1px solid red',
            }}
          >
            <div
              className="headerhover"
              style={{
                height: '45px',
                
                width: '100%',
                display: 'contents',
                flexDirection: 'row-reverse',
                paddingRight: '100px',
              }}
            >
              {userInfo && userInfo?.isAdmin ? (
                <Navbar
                  // variant="dark"
                  style={{
                    // backgroundColor: '#2c2626',
                    display: 'flex',
                    // overflowX: 'auto',
                    // padding: '20px',
                  }}
                  expand="lg"
                >
                  <Navbar.Toggle aria-controls="basic-navbar-nav"  className='displayingThebar' />
                  <Navbar.Collapse id="basic-navbar-nav"  className='nav_button'>
                    <a className="header-a" href="/">
                      Home
                    </a>
                    <a className="header-a" href="/admin/dashboard">
                      Dashboard
                    </a>
                    <a className="header-a" href="/admin/products">
                      Products
                    </a>
                    <a className="header-a" href="/admin/sliders">
                      Sliders
                    </a>
                    <a className="header-a" href="/admin/orders">
                      Orders
                    </a>
                    <a className="header-a" href="/admin/users">
                      Users
                    </a>
                    <a className="header-a" href="/profile">
                      Admin Profile
                    </a>
                  </Navbar.Collapse>
                </Navbar>
              ) : (
                <Navbar expand="lg" >
                  <Navbar.Toggle aria-controls="basic-navbar-nav"  className='displayingThebar'/>
                  <Navbar.Collapse id="basic-navbar-nav" className='nav_button' >
                    <a className="header-a" href="/">
                      Home
                    </a>
                    <a className="header-a" href="/orderhistory">
                      Order History
                    </a>
                    <a className="header-a" href="/profile">
                      User Profile
                    </a>
                    <a className="header-a" href="">
                      Contact Us
                    </a>
                    <a className="header-a" href="">
                      About Us
                    </a>
                    
                  </Navbar.Collapse>
                </Navbar>
              )}
            </div>
          </div>
        </div>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            <div className="side-bar-nav">
              {categories.map((category, i) => (
                 <SubMenuComp key={category.slug} category={category} />
              ))}
            </div>
          </Nav>
        </div>
        <main
          style={{
            display: 'flex',
            margin: '0 10%',
            // backgroundColor: '#85ca18;',
          }}
        >
          {/* {window.location.pathname === '/signin' ? null : ( */}

          <div
            class="caregoryList"
            style={{
              display:
                window.location.pathname === ('/signin' || '/signup')
                  ? 'none'
                  : '',
            }}
          >
            <Navbar expand="lg">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                // style={{ marginLeft: '-12px' }}
              >
                <ListGroup>
                  <div
                    style={{
                      color: 'white',
                      background:
                        'linear-gradient(rgb(63, 55, 55) 0%, rgb(46, 39, 39) 100%)',
                      textAlign: 'center',
                      height: '38px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRight: '1px solid black',
                      fontSize: '1.3rem',
                      // fontFamily: 'serif',
                      fontWeight: 400,
                      // color: 'red',
                      // height:
                    }}
                  >
                    Categories
                  </div>
                  {categories?.map((category, i) => (
                    <NavLink
                      to={`/products/categories?type=category&name=${category.slug}`}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                        fontSize: '18px',
                      }}
                    >
                      <ListGroup.Item
                        key={category.slug}
                       
                        style={{ color: 'white' }}
                      >
                        {category.name}
                      </ListGroup.Item>
                    </NavLink>
                  ))}
                  <div
                    class="widget widget_banner"
                    style={{ paddingTop: '30px' }}
                  >
                    <img
                      src="//cdn.shopify.com/s/files/1/0432/0609/t/3/assets/custom_banner_img.jpg?v=109058294885636396901397135061"
                      alt=""
                      style={{ width: '100%' }}
                    />
                  </div>
                </ListGroup>
              </Navbar.Collapse>
            </Navbar>
            
          </div>
          <div
            class="navbarright"
            style={{
              display:
                window.location.pathname === ('/signin' || '/signup')
                  ? 'none'
                  : '',
            }}
          >
            {userInfo && userInfo?.isAdmin ?<Navbar className='buttonset_for_mbl' expand="lg">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className='not_showing_home'
              >
                
                <ListGroup className='nav_text' >
                     <a className="header-a" href="/">
                      Home
                    </a>
                    <hr/>
                    <a className="header-a" href="/admin/dashboard">
                      Dashboard
                    </a>
                    <hr/>
                    <a className="header-a" href="/admin/products">
                      Products
                    </a>
                    <hr/>
                    <a className="header-a" href="/admin/sliders">
                      Sliders
                    </a>
                    <hr/>
                    <a className="header-a" href="/admin/orders">
                      Orders
                    </a>
                    <hr/>
                    <a className="header-a" href="/admin/users">
                      Users
                    </a>
                    <hr/>
                    <a className="header-a" href="/profile">
                      Admin Profile
                    </a>
                 </ListGroup>
                 
              </Navbar.Collapse>
            </Navbar>:<Navbar 
             className='buttonset_for_mbl'
             expand="md">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className='not_showing_home' 
                // style={{ marginLeft: '-12px' }}
              >
                
                <ListGroup className='nav_text' >
                    <a className="header-a" href="/">
                      Home
                    </a>
                    <hr/>
                    <a className="header-a" href="/orderhistory">
                      Order History
                    </a>
                    <hr/>
                    <a className="header-a" href="/profile">
                      User Profile
                    </a>
                    <hr/>
                    <a className="header-a" href="">
                      Contact Us
                    </a>
                    <hr/>
                    <a className="header-a" href="">
                      About Us
                    </a>
                  
                </ListGroup>
                 
             
              </Navbar.Collapse>
            </Navbar>}
            
            {/* <div class="widget widget_banner" style={{ paddingTop: '30px' }}>
              <img
                src="//cdn.shopify.com/s/files/1/0432/0609/t/3/assets/custom_banner_img.jpg?v=109058294885636396901397135061"
                alt=""
                // style={{ paddingLeft: '182px' }}
              />
            </div> */}
            {/* <div
              className="bestseller"
              // style={{
              //   width: '100%',
              //   height: '300px',
              //   marginTop: '10px',
              //   border: '1px solid black',
              // }}
            >
              <BestSeller />
            </div> */}
          </div>
          {/* )} */}
          <Container
            className="mt-3"
            style={
              {
                // marginRight: '77px',
                // width: '80%',
              }
            }
          >
            <Routes>
              <Route
                path="/products/categories"
                element={<CategoryWiseProductList />}
              />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/signup-info" element={<SignUpInfo />} />
              <Route path="/bulkorder" element={<Pills />} />
              <Route
                path="/reset-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>{' '}
              <Route
                path="/adress-edit/:id"
                element={<EditShippingAdress />}
              ></Route>
              <Route path="/search" element={<SearchScreen />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/contact-detail"
                element={<ContactDetailScreen />}
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/add-to-cart" element={<AddToCart />}></Route>
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/allProducts" element={<ViewAllProducts />}></Route>
              <Route
                path="/allBestSeller"
                element={<ViewBestSellerScreen />}
              ></Route>
              <Route
                path="/allDealoftheday"
                element={<ViewDealOfTheDayProducts />}
              ></Route>
              
              {/* slide Route */}
              <Route
                path="/slider/:sliderID"
                element={
                  // <ProtectedRoute>
                  <SlidingProducts />
                  // </ProtectedRoute>
                }
              />
              <Route path="/carts" element={<SliderCartScreen />} />
              <Route path="/sliders/:slug" element={<SlideProductScreen />} />
              <Route
                path="/admin/sliders"
                element={
                  <AdminRoute>
                    <SlideListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sliders/createSlide"
                element={
                  <AdminRoute>
                    <CreateSlide />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sliders/:id"
                element={
                  <AdminRoute>
                    <SliderEditScreen />
                  </AdminRoute>
                }
              ></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/createCategory"
                element={
                  <AdminRoute>
                    <CreateCateogry />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/createProduct"
                element={
                  <AdminRoute>
                    <CreateProduct />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
            <div>
              <BlackFridaySale />
            </div>
          </Container>
          {/* <div ref={scrollTopRef} /> */}
          {/* <div
            style={{
              width: '100%',
              border: '1px solid',
            }}
          >
            {' '}
            Best Sellers{' '}
          </div> */}
          {/* <div>
            <BlackFridaySale />
          </div> */}
        </main>
        {/* <div
          style={{
            width: '100%',
            // border: '1px solid',
            alignItems: 'center',
            marginLeft: '200px',
          }}
        >
          <img
            src="https://www.seekpng.com/png/detail/62-621294_tom-ford-ft5401-020-clear-best-seller-banner.png"
            alt=""
          />
          
        </div> */}
        {/* <div style={{ marginBotton: '20px' }}> */}

        {/* </div> */}
        <footer>
          <div className="text-center " style={{ paddingTop: ' 10px' }}>
            <Footer />
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;
