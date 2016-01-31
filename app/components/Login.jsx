import React from 'react';
import { Link } from 'react-router';

class Login extends React.Component {
  handleSubmit(event) {
    	event.preventDefault();
	}

	facebookLogin(){

	}

	twitterLogin(){

	}

	googleLogin(){

	}

	render() {
		return (
			<div className='main-content container'>
				<div className='col-md-6 col-md-offset-3'>

					<div className='container-box'>
						<h1 className='text-center'>Login</h1>
			      <form onSubmit={this.handleSubmit.bind(this)}>
				      <div className='form-group'>
						    <label>Email address</label>
						    <input type="email" name="email" className="form-control" placeholder="Email" />
				      </div>
				      <div className='form-group'>
						    <label>Password</label>
						    <input type="password" name="password1" className="form-control" placeholder="Password" />
				      </div>
		          <button className='btn btn-primary btn-block' onClick={this.handleSubmit.bind(this)}>Login</button>
			      </form>
					</div>
					<br/>
					<div className='container-box text-center'>
						<h3>Or login with your social media account</h3>
		          <button className='btn btn-blue btn-block' onClick={this.facebookLogin.bind(this)}>Facebook</button>
		          <button className='btn btn-light-blue btn-block' onClick={this.twitterLogin.bind(this)}>Twitter</button>
		          <button className='btn btn-red btn-block' onClick={this.googleLogin.bind(this)}>Google+</button>
		      </div>
          <br/>
          <div className='container-box text-center'>
            <p>Or <Link to='/register'>register</Link> a new account!</p>
          </div>
				</div>
			</div>
		)
	}
}

export default Login;