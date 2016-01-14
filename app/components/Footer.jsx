import React from 'react';
import {Link} from 'react-router';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
              <ul className='list-inline'>
              <li><Link to='/about'><strong>About</strong></Link></li> |
              <li><Link to='/contact'><strong>Contact Us</strong></Link></li>
              </ul>

              <p>Powered by <strong>Node.js</strong>, <strong>MongoDB</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
              <p>© 2016 Minh Do.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
