import { Link, useHistory } from "react-router-dom";

function header() {
  return (
    <header>
        <div class="logo">
        </div>
        <nav class="header_nav">
            <ul>
                <li><Link to="/model/Model">model</Link></li>
                <li>photographer</li>
                <li>collaborate</li>
                <li>mypage</li>
                <li>sign in</li>
            </ul>
        </nav>
    </header>
  );
}

export default header;