import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import swal from "sweetalert";

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      swal({
        title: "Warning",
        text: getError(err),
        icon: "warning",
        button: "close",
      });
      // swal(getError(err), "warning");
      // toast.error(getError(err));
    }
  };
  console.log(userInfo);
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="small-container" style={{ marginLeft: '15%' }}>
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <h1 className="signin-heading">Sign In</h1>
      <Form
        className="signin-form"
        onSubmit={submitHandler}
        // style={{ width: '350px', marginLeft: '20%' }}
      >
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <div className="signin_text">
          <Button className='signInbutton' type="submit">Sign In</Button>
        </div>
        &nbsp;
        <div className="signin_text">
          <Link
            to={`/reset-password?redirect=${redirect}`}
            style={{ color: 'black ' }}
          >
            Forgot Password
          </Link>
        </div>
        &nbsp;
        <div className="signin_text">
          New customer?{' '}
          <Link
            to={`/signup?redirect=${redirect}`}
            style={{ color: ' #75b510 !important' }}
          >
            Create your account
          </Link>
        </div>
        &nbsp;
      </Form>
    </Container>
  );
}
