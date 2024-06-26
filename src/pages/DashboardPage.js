import { useEffect, useState } from "react"
import { UserDetailsApi } from "../services/Api"
import NavBar from "../components/NavBar";
import { logout, isAuthenticated } from "../services/Auth";
import { Navigate, useNavigate } from "react-router-dom";

export default function DashboardPage(){
    const navigate = useNavigate();

    const [user,setUser] = useState({
        name:"",
        email:"",
        localId:""
    });

    useEffect(()=>{
        if(isAuthenticated()){
            UserDetailsApi()
            .then((response)=>{
                setUser({
                    name: response.data.users[0].displayName,
                    email: response.data.users[0].email,
                    localId: response.data.users[0].localId,
                })
            })
        }  
    },[])

    const logoutUser = ()=>{
        logout();
        navigate('/login');
    }


    if(!isAuthenticated()){
        return <Navigate to="/login"/>
    }


    return(
        <div>
        <NavBar logoutUser={logoutUser}/>
        <main role="main" className="container mt-5">
            <div className="container">
              <div className="text-center mt-5">
                <h3>Dashboard page</h3>
                { (user.name && user.email && user.localId) ?(
                    <div>
                    <p className="text-bold " >Hi {user.name}</p>
                    <p className="text-bold">Your Firebase ID is {user.localId}</p>
                    <p className="text-bold">Your email is {user.email}</p>
                    </div>
                ) : (
                    <div className="text-center">
                         <div className="spinner-border text-primary " role="status">
                           <span className="sr-only">Loading...</span>
                         </div>
                    </div>
                )
                
                }
              </div>
            </div>
        </main>
        </div>
    )
}