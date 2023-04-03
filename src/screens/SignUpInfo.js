import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Store } from '../Store';
import swal from 'sweetalert';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
export default function SignUpInfo() {
  const [whatsapp, setWhatsapp] = useState('');
  const [imessage, setImessage] = useState('');
  const [telegram, setTelegram] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const location = useLocation();
  //   const location = useLocation();
  console.log('in side info', location?.state);
  //   const redirectInUrl = new URLSearchParams(search).get('redirect');
  //   const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post('/api/users/signup', {
        ...location.state,
        imessage,
        whatsapp,
        telegram,
      });
      console.log('inside signup', data);

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      // console.log('inside signup', data);
    } catch (err) {
      swal({
        title: "Warning",
        text: getError(err),
        icon: "warning",
        button: "close",
      });    }
  };
  const skipHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post('/api/users/signup', {
        ...location.state,
        imessage,
        whatsapp,
        telegram,
      });
      console.log('inside signup', data);

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      // console.log('inside signup', data);
    } catch (err) {
      swal(getError(err), "warning");
    }
  };
  return (
    <div>
      <Form
      //   onSubmit={submitHandler}
      >
        <Form.Group className="mb-3" controlId="whatsapp">
          <Form.Label>Whatsapp Number<span>(optional)</span></Form.Label>
          <Form.Control
            type="number"
            maxLength="10"
            // required
            onChange={(e) => {
              setWhatsapp(e.target.value);
              //   setName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="imessage">
          <Form.Label>iMessage Number<span>(optional)</span></Form.Label>
          <Form.Control
            type="number"
            maxLength="10"
            required
            onChange={(e) => {
              setImessage(e.target.value);
              //   setEmail(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="telegram">
          <Form.Label>Telegram Number<span>(optional)</span> </Form.Label>
          <Form.Control
            type="number"
            maxLength="10"
            // required
            onChange={(e) => {
              setTelegram(e.target.value);
              //   setEmail(e.target.value);
            }}
          />
        </Form.Group>
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
      </Form>
      <div style={{ display: 'flex' }}>
        <div>
          <button
            style={{
              borderRadius: '6px',
              width: '100px',
              height: '30px',
              border: 'none',
            }}
            onClick={submitHandler}
          >
            submit
          </button>
        </div>
        <div className='skip_in_signup'>
          <button
            style={{
              borderRadius: '6px',
              width: '100px',
              height: '30px',
              border: 'none',
            }}
            onClick={skipHandler}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
