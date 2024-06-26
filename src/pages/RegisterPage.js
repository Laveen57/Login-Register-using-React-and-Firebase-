import { useState } from 'react';
import './RegisterPage.css';
import { RegisterApi } from '../services/Api';
import { StoreUserData } from '../services/storage';
import { isAuthenticated } from '../services/Auth';
import { Link, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function RegisterPage() {
  const initialStateErrors = {
    email:{required:false},
    name:{required:false},
    password:{required:false},
    custom_error:null,
  };

  const [errors, setErrors] = useState(initialStateErrors);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (event)=>{
    event.preventDefault();
    let errors = initialStateErrors;
    let hasError = false;
    if(inputs.name === ""){
      errors.name.required = true;
      hasError = true;
    }
    if(inputs.email === ""){
      errors.email.required = true;
      hasError = true;
    }
    if(inputs.password === ""){
      errors.password.required = true;
      hasError = true;
    }

    if(!hasError){
      setLoading(true)
      //sending register api request
      RegisterApi(inputs).then((response)=>{
        StoreUserData(response.data.idToken);
      }).catch((err)=>{
        if(err.response.data.error.message === "EMAIL_EXISTS"){
          setErrors({...errors,custom_error:"This email is already registered"})
        }
        else if(String(err.response.data.error.message).includes("WEAK_PASSWORD")){
          setErrors({...errors,custom_error:"Password should be at least 6 characters"})
        }
      }).finally(()=>{
        setLoading(false);
      })
    }

    setErrors({...errors});
  }


  const [inputs,setInputs] = useState({
    email:"",
    name:"",
    password:""
  })

  const handleInput = (event)=>{
    setInputs({...inputs,[event.target.name]:event.target.value});
  }

  if(isAuthenticated()){
    //redirecting to dashboard npm install react-router-dom
    return <Navigate to="/dashboard"/>
  }


  return(
    <div>
    <NavBar/>
    <section className="register-block">
      <div className="container">
        <div className="row ">
          <div className="col register-sec">
            <h2 className="text-center">Register Now</h2>
            <form
             onSubmit={handleSubmit}
             className="register-form" 
             action="">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" className="text-uppercase">
                  Name
                </label>

                <input 
                 onChange={handleInput}
                 type="text" 
                 className="form-control" 
                 name="name" 
                 id="name"
                 placeholder="name" />
                { errors.name.required ?(
                    <span className="text-danger">
                        Name is required.
                    </span> ) : (null)
                }
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" className="text-uppercase">
                  Email
                </label>

                <input 
                 onChange={handleInput}
                 type="text" 
                 className="form-control" 
                 name="email" 
                 id="email"
                 placeholder="email" />
                { errors.email.required ?(
                    <span className="text-danger">
                        Email is required.
                    </span> ) : (null)
                }
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1" className="text-uppercase">
                  Password
                </label>
                <input
                  onChange={handleInput}
                  className="form-control"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"/>
                { errors.password.required ?(
                    <span className="text-danger">
                        Password is required.
                    </span> ) : (null)
                }
              </div>
              <div className="form-group">
                    <span className="text-danger">
                    {errors.custom_error!==null ?(<p>{errors.custom_error}</p>):(null)}
                    </span>
                { loading?(
                    <div className="text-center">
                         <div className="spinner-border text-primary " role="status">
                           <span className="sr-only">Loading...</span>
                         </div>
                    </div>): (null)
                }

                <input
                  type="submit"
                  className="btn btn-login float-right"
                  value="Register"
                  disabled={loading}
                />
              </div>
              <div className="clearfix"></div>
              <div className="form-group">
                Already have account ? Please{" "}
                <Link  to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
