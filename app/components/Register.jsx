import React from 'react';
import { Link } from 'react-router';

class Register extends React.Component {
  handleSubmit(event) {
    	event.preventDefault();
	}

	render() {
		return (
			<div className='main-content container'>
				<div className='col-md-6 col-md-offset-3'>

					<div className='container-box'>
						<h1 className='text-center'>Register a New Account</h1>
			      <form onSubmit={this.handleSubmit.bind(this)}>
				      <div className='form-group'>
						    <label>Email address</label>
						    <input type="email" name="email" className="form-control" placeholder="Email" />
				      </div>
				      <div className='form-group'>
						    <label>Password</label>
						    <input type="password" name="password1" className="form-control" placeholder="Password" />
				      </div>
				      <div className='form-group'>
						    <label>Retype Password</label>
						    <input type="password" name="password2" className="form-control" placeholder="Password" />
				      </div>
		          <button className='btn btn-primary btn-block' onClick={this.handleSubmit.bind(this)}>Create</button>
			      </form>
					</div>
					<br/>
					<div className='container-box text-center'>
						<p>Or <Link to='/login'>login</Link> with Facebook, Google+, or Twitter</p>
		      </div>
				</div>
			</div>
		)
	}
}

export default Register;