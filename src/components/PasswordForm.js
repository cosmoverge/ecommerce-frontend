import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import swal from "sweetalert";

export default function PasswordForm() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [email, setEmail] = useState('');
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  const { dispatch: ctxDispatch } = useContext(Store);
  // const { userInfo } = state;

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      // swal("Passwords do not match", "warning");
      // toast.error('Passwords do not match');
      swal({
        title: "Warning",
        text: 'Passwords do not match',
        icon: "warning",
        button: "close",
      });
      return;
    }
    try {
      const { data } = await axios.post('/api/users/change-password', {
        otp,
        password,
        email,
      });
      console.log('data', data);
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      if (data?.message === 'Invalid otp') {
        swal({
          title: "Warning",
          text: data?.message,
          icon: "warning",
          button: "close",
        });
        // toast.error(data?.message);
        return;
      }
      if (data?.statusText === 'Success') {
        toast.success(data?.message);
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate(redirect || '/');
      }
      if (data?.message === 'Token Expire') {
        swal({
          title: "Warning",
          text: 'OTP Expired',
          icon: "warning",
          button: "close",
        });
        // toast.error('OTP Expired');
        setIsOtpExpired(true);

        return;
      }
    } catch (err) {
      swal({
        title: "Warning",
        text: getError(err),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(err));
    }
  };

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(redirect);
  //   }
  // }, [navigate, redirect, userInfo]);

  async function resendOTP() {
    setOtp('');
    let options = {
      method: 'POST',
      url: `/api/users/email-send`,
      data: {
        email: email,
      },
    };
    let response = await axios(options);
    if (response?.data?.statusText === 'Success') {
      toast.success(response?.data?.message);
    } else {
      swal({
        title: "Warning",
        text: response?.data?.message,
        icon: "warning",
        button: "close",
      });
      // toast.error(response?.data?.message);
    }
  }

  return (
    <Container className="small-container">
      <Form onSubmit={submitHandler}>
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

        <Form.Group className="mb-3" controlId="otp">
          <Form.Label>OTP</Form.Label>
          <Form.Control
            type="otp"
            maxLength="4"
            required
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cpassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="cpassword"
            required
            onChange={(e) => {
              setCpassword(e.target.value);
            }}
          />
        </Form.Group> */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Form.Group className="mb-3" controlId="cpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3 d-flex" style={{ gap: '5px' }}>
          <Button type="submit">Change Password</Button>
          {isOtpExpired && (
            <div>
              <Button type="button" onClick={resendOTP}>
                Resend Otp
              </Button>
            </div>
          )}
        </div>
      </Form>
    </Container>
  );
}
