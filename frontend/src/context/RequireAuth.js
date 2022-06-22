import axios from "axios";
import { createContext , useState ,useEffect  } from "react";


const RequireAuthContext = createContext();

export const RequireAuthProvider =({children}) => {
    
    const [auth, setAuth] = useState(false);
    const [authCheck, setAuthCheck] = useState(false);
    const [authCheckFinsh, setAuthCheckFinsh] = useState(false);
    useEffect(()=>{
        console.log('context');
        let check = async ()=>{
            let token = localStorage.getItem('token');
            let headers ={
                'X-Requested-With': 'XMLHttpRequest',
              'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+token
              }
            await axios.get(`${process.env.REACT_APP_BASE_URL}/user/checkauth`,{headers})
                .then(function ({data}) {
                        setAuth(true);
                        setAuthCheckFinsh(true);
                   })
                .catch(function (error) {
                    setAuthCheckFinsh(true);
                    console.log(error)
                });
        }
        check();
    },[authCheck]);
    
    
    return <RequireAuthContext.Provider
    value={{ auth,authCheck ,setAuthCheck,authCheckFinsh}}
    >{children}
    </RequireAuthContext.Provider> ;
}


export default RequireAuthContext ;