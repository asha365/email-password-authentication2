import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase.init';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);

  

  const handleEmailBlur = (event) =>{
    setEmail(event.target.value);
  }
  
  const handlePasswordBlur = (event) =>{
    setPassword(event.target.value);
  }

  const handleRegisteredChange = (event) =>{
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = (event) =>{
    
    if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then((result) =>{
        const user = result.user;
        console.log(user);
      })
      .catch((error) =>{
        console.error(error);
        setError(error.message);
      })
    }
    else{
      const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      
      return;
    }

    if(!/(?=.[!@#$%^&*()_+}{":;'?/>.<,])/.test(password)){
      setError('please password should contain at least one special character');
      return;
    }
    setValidated(true);
    setError('');

    createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      const user = result.user;
      console.log(user);
      setEmail(user);
      setPassword(user);
      setEmail('');
      setPassword('');
      EmailVerification();

    })
    .catch((error) =>{
      console.error(error);
      setError(error.message);
    })
    }
    event.preventDefault();
  }

  const EmailVerification = () =>{
    sendEmailVerification(auth.currentUser)
      .then(() =>{
        console.log('email verification sent');
      })
  }

//forget password
const handlePasswordReset = () =>{
  sendPasswordResetEmail(auth, email)
  .then(() =>{
    console.log('email sent');
  })
  
}


  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h1 className='text-info'>Please {registered ? 'Login' : 'Register'}!!</h1>

      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required/>
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
        <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required/>
        
        <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Check me out" />
      </Form.Group>
      <p className='text-danger'>{error}</p>
      <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
      <br/>
      <Button variant="primary" type="submit">
        {registered ? 'Login' : 'Register'}
      </Button>
    </Form>
      </div>
    </div>
  );
}

export default App;
