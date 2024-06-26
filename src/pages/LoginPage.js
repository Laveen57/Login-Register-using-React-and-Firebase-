import { Link, Navigate } from 'react-router-dom';
import { LoginApi } from '../services/Api';
import { isAuthenticated } from '../services/Auth';
import { StoreUserData } from '../services/storage';
import './LoginPage.css';
import { useState } from 'react';
import NavBar from '../components/NavBar';

export default function LoginPage(){
    const initialStateErrors = {
        email:{required:false},
        password:{required:false},
        custom_error:null,
      };

    const [errors, setErrors] = useState(initialStateErrors);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event)=>{
        event.preventDefault();
        let errors = initialStateErrors;
        let hasError = false;
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
          //sending Login api request
          LoginApi(inputs).then((response)=>{
            StoreUserData(response.data.idToken);
          }).catch((err)=>{
            if(err.code === "ERR_BAD_REQUEST"){
                setErrors({...errors,custom_error:"Invalid user credentials"})
            }
          }).finally(()=>{
            setLoading(false);
          })
        }
    
        setErrors({...errors});
    }
    
    const [inputs,setInputs] = useState({
        email:"",
        password:""
    });

    const handleInput = (event)=>{
        setInputs({...inputs,[event.target.name]:event.target.value});
    }

    

    if(isAuthenticated()){
        return <Navigate to="/dashboard"/>
    }

    return(
        <div>
        <NavBar/>
        <section className="login-block">
            <div className="container">
                <div className="row ">
                    <div className="col login-sec">
                        <h2 className="text-center">Login Now</h2>
                        <form className="login-form" action="" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                            <input onChange={handleInput} type="email"  className="form-control" name="email"  id="email" placeholder="email"  />
                            { errors.email.required ?(
                                <span className="text-danger">
                                   Email is required.
                                </span> ) : (null)
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                            <input onChange={handleInput} className="form-control" type="password"  name="password" placeholder="password" id="password" />
                            { errors.password.required ?(
                                 <span className="text-danger">
                                    Password is required.
                                 </span> ) : (null)
                            }
                        </div>
                        <div className="form-group">
                        { loading?(
                             <div className="text-center">
                                 <div className="spinner-border text-primary " role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>): (null)
                        }
                            <span className="text-danger" >
                            {errors.custom_error!==null ?(<p>{errors.custom_error}</p>):(null)}
                            </span>
                            <input  type="submit" className="btn btn-login float-right" disabled={loading} value="Login"/>
                        </div>
                        <div className="clearfix"></div>
                        <div className="form-group">
                        Create new account ? Please <Link  to="/register">Register</Link>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </div>
    )
}