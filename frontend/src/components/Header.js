import {Link} from 'react-router-dom'
import axios from "axios";

function Header() {
    let token = localStorage.getItem('token');
    let headers ={
        'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/json',
        'Authorization': 'Bearer '+token
      }
    const logout = async ()=>{
        await axios.post(`/api/user/logout`,{headers})
            .then(function () {
                localStorage.removeItem('token');
            })
            .catch(function (error) {
                console.log(error);
                }); 
    }
  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container">

    <button
      className="navbar-toggler"
      type="button"
      data-mdb-toggle="collapse"
      data-mdb-target="#navbarButtonsExample"
      aria-controls="navbarButtonsExample"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i className="fas fa-bars"></i>
    </button>

    <div className="collapse navbar-collapse" >
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/">Home</Link>
        </li>
      </ul>

      <div className="d-flex align-items-center">
        <button onClick={logout} type="button" className="btn btn-link px-3 me-2">
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>
  )
}

export default Header