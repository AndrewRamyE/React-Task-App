import { useState ,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../css/authPage.css'

function AuthPage() {
    let navigate = useNavigate();
    const [signinRadio , setSigninRadio] =useState(false);
    const [loginRadio , setLoginRadio] =useState(true);
    const [signinName , setSigninName] =useState('');
    const [signinEmail , setSigninEmail] =useState('');
    const [signinPassword , setSigninPassword] =useState('');
    const [signinPasswordconf , setSigninPasswordconf] =useState('');
    const [loginEmail , setLoginEmail] =useState('');
    const [loginPassword , setLoginPassword] =useState('');
    const [errors , setErrors] =useState({});

    let token = localStorage.getItem('token');
    let headers =token?{
        'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/json',
        'Authorization': 'Bearer '+token 
      }:{
        'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/json',
      };
    
    useEffect(()=>{
        console.log(token);
        let check = async ()=>{
            await axios.get(`${process.env.REACT_APP_BASE_URL}/user/checkauth`,{headers})
                .then(function ({data}) {
                    console.log(data);
                    navigate('/task');
                }).catch(e=>console.log(e));
        }
        check();
    },[navigate]);
      const signin = async (e)=>{
        e.preventDefault();
        if(signinPassword !== signinPasswordconf) {
            return setErrors({'signinPasswordconf':'Password and confirm password must be the same'}) ;
        }
        let data = {
          'name':signinName,
          'email':signinEmail,
          'password':signinPassword
        }
        await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signin`,data,{headers})
        .then(function ({data}) {
            if (data.status === 200) {
                data = JSON.parse(data.data);
                localStorage.setItem('token',data.token);
                navigate('/task');
            }else {
                // setErrors({'login':'Credentials not matches'}) ;
            }
           })
        .catch(function (error) {
            // setErrors({'login':'Credentials not matches'}) ;
        });
      }
    const login = async (e)=>{
        e.preventDefault();
        let data = {
            'email':loginEmail,
          'password':loginPassword
        }
          await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`,data,{headers})
          .then(function ({data}) {
            if (data.status === 200) {
                data = JSON.parse(data.data);
                localStorage.setItem('token',data.token);
                navigate('/task');
            }else {
                setErrors({'login':'Credentials not matches'}) ;
            }
           })
          .catch(function (error) {
            setErrors({'login':'Credentials not matches'}) ;
          });
      }
    return (
    <>
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked value={loginRadio} onChange={e=>setLoginRadio(true)} /><label htmlFor="tab-1" className="tab">Sign In</label>
                        <input id="tab-2" type="radio" name="tab" className="sign-up" value={signinRadio} onChange={e=>setSigninRadio(true)} /><label htmlFor="tab-2" className="tab">Sign Up</label>
                            <div className="login-form">
                                <form className="sign-in-htm" onSubmit={login}>
                                    <div className="group">
                                        <label htmlFor="user" className="label">Email</label>
                                        <input id="user" type="text" className="input" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="pass" className="label">Password</label>
                                        <input id="pass" type="password" className="input" data-type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}/>
                                    </div>
                                    <div className="group">
                                        <input type="submit" className="button" value="Sign In" />
                                        {errors.login && <p className="red">{errors.login}</p>}
                                    </div>
                                    <div className="hr"></div>
                                </form>
                                <form className="sign-up-htm" onSubmit={signin}>
                                    <div className="group">
                                        <label htmlFor="user2" className="label">Username</label>
                                        <input id="user2" type="text" className="input" value={signinName} onChange={e=>setSigninName(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="password" className="label">Password</label>
                                        <input id="password" type="password" className="input" data-type="password" value={signinPassword} onChange={e=>setSigninPassword(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="passwordconf" className="label">Repeat Password</label>
                                        <input id="passwordconf" type="password" className="input" data-type="password" value={signinPasswordconf} onChange={e=>setSigninPasswordconf(e.target.value)} />
                                        {errors.signinPasswordconf && <p className="red">{errors.signinPasswordconf}</p>}
                                    </div>
                                    <div className="group">
                                        <label htmlFor="email" className="label">Email Address</label>
                                        <input id="email" type="text" className="input" value={signinEmail} onChange={e=>setSigninEmail(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <input type="submit" className="button" value="Sign Up" />
                                    </div>
                                </form>
                            </div>
                        </div>
                </div>
            </>

            )
}

            export default AuthPage