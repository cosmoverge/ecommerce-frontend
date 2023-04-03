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
import swal from 'sweetalert';

export default function SignupScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [imessage, setImessage] = useState('');
  const [telegram, setTelegram] = useState('');

  // const mypin = Math.floor(100000 + Math.random() * 900000);
  // const [pin, setPin] = useState(`${mypin}`);
  // console.log('pin1', pin);
  // localStorage.setItem('Vpin', pin);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      swal('Passwords do not match', "warning");

      // toast.error('Passwords do not match');
      return;
    }
    try {
      // const { data } = await Axios.post('/api/users/signup', {
      //   name,
      //   email,
      //   phoneNo,
      //   password,
      //   // imessage,
      //   // whatsapp,
      //   // telegram,
      // });
      // console.log('inside signup', data);

      // ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      // localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/signup-info', {
        state: {
          name: name,
          email: email,
          phoneNo: phoneNo,
          password: password,
        },
      });
      // console.log('inside signup', data);
    } catch (err) {
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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // const handleAlert = () => {
  //   alert(`Your OTP is ${mypin}`);
  //   // setPin(mypin)
  //   // document.getElementById('om').style.display = 'none';
  //   // document.getElementById('otp').style.display = 'block';
  // };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <span className="required" style={{ color: 'red' }}>
            *
          </span>
          <Form.Control
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <span className="required" style={{ color: 'red' }}>
            *
          </span>
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
          <span className="required" style={{ color: 'red' }}>
            *
          </span>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <span className="required" style={{ color: 'red' }}>
              *
            </span>
            <Form.Control
              type="password"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="mb-3" controlId="phoneNo">
          <Form.Label>Phone Number</Form.Label>
          <span className="required" style={{ color: 'red' }}>
            *
          </span>
          <Form.Control
            type="number"
            maxLength="10"
            required
            onChange={(e) => {
              setPhoneNo(e.target.value);
            }}
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="whatsapp">
          <Form.Label>Whatsapp Number</Form.Label>
          <Form.Control
            type="number"
            required
            onChange={(e) => {
              setWhatsapp(e.target.value);
              //   setName(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="imessage">
          <Form.Label>iMessage Number</Form.Label>
          <Form.Control
            type="number"
            required
            onChange={(e) => {
              setImessage(e.target.value);
              //   setEmail(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="telegram">
          <Form.Label>Telegram Number</Form.Label>
          <Form.Control
            type="number"
            required
            onChange={(e) => {
              setTelegram(e.target.value);
              //   setEmail(e.target.value);
            }}
          />
        </Form.Group> */}

        {/* <Form.Group className="mb-3" controlId="Otp">
          <Form.Label>Verify Otp</Form.Label>
          <Form.Control
            type="number"
            required
            onChange={(e) => {
              setPin(e.target.value);
            }}
          />
          <Button onClick={handleAlert}>Verify</Button>
        </Form.Group> */}
        <div className="mb-3">
          <Button type="submit">Next</Button>
        </div>
        <div className="mb-3">
          Already have an account
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  );
}
