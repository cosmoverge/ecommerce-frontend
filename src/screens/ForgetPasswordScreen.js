import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import PasswordForm from '../components/PasswordForm';
import swal from 'sweetalert';

export default function ForgetPasswordScreen() {
  const emailRef = useRef();
  const [otp, setOtp] = useState(true);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      let options = {
        method: 'POST',
        url: `/api/users/email-send`,
        data: {
          email: emailRef.current.value,
        },
      };
      let response = await axios(options);
      console.log('response', response);
      if (response?.data?.statusText === 'Success') {
        swal(response?.data?.message, "success");

        // toast.success(response?.data?.message);
        setOtp(false);
      } else {
                swal(response?.data?.message, "warning");

        // toast.error(response?.data?.message);
      }
    } catch (err) {
      swal(getError(err), "warning");

      // toast.error(getError(err));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container">
      <Container className="small-container">
        <h1 className="my-5">Reset Password</h1>
        {otp ? (
          <Form>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required ref={emailRef} />
            </Form.Group>
            <div className="mb-3">
              <Button type="submit" onClick={sendOtp}>
                Send OTP
              </Button>
            </div>
          </Form>
        ) : (
          <PasswordForm />
        )}
      </Container>
    </div>
  );
}
// import axios from 'axios';
// import React, { useContext, useReducer, useState } from 'react';
// import { toast } from 'react-toastify';
// import { Store } from '../Store';
// import { getError } from '../utils';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { useLocation, useNavigate } from 'react-router-dom';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'UPDATE_REQUEST':
//       return { ...state, loadingUpdate: true };
//     case 'UPDATE_SUCCESS':
//       return { ...state, loadingUpdate: false };
//     case 'UPDATE_FAIL':
//       return { ...state, loadingUpdate: false };

//     default:
//       return state;
//   }
// };
// export default function ForgetPasswordScreen() {
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { userInfo } = state;
//   const [email, setEmail] = useState(userInfo?.email);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const navigate = useNavigate();
//   const [, dispatch] = useReducer(reducer, {
//     loadingUpdate: false,
//   });
//   const { search } = useLocation();

//   const redirectInUrl = new URLSearchParams(search).get('redirect');
//   const redirect = redirectInUrl ? redirectInUrl : '/';

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
//     try {
//       const { data } = await axios.put(
//         '/api/users/reset-password',
//         {
//           email,
//           password,
//         },
//         {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         }
//       );
//       dispatch({
//         type: 'UPDATE_SUCCESS',
//       });
//       ctxDispatch({ type: 'USER_SIGNIN', payload: data });
//       localStorage.setItem('userInfo', JSON.stringify(data));
//       toast.success('User updated successfully');
//       navigate(redirect || '/');
//     } catch (err) {
//       dispatch({
//         type: 'FETCH_FAIL',
//       });
//       toast.error(getError(err));
//     }
//   };
//   return (
//     <div className="container small-container">
//       <h1 className="my-3">User Profile</h1>
//       <form onSubmit={submitHandler}>
//         <Form.Group className="mb-3" controlId="name">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3" controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3" controlId="confirmPassword">
//           <Form.Label>Confirm Password</Form.Label>
//           <Form.Control
//             type="password"
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//         </Form.Group>
//         <div className="mb-3">
//           <Button type="submit">Update</Button>
//         </div>
//       </form>
//     </div>
//   );
// }
