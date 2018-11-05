import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

import QueuiAnim from 'rc-queue-anim'
import Logo from '../../../image/Logo'
//import {brandName} from '../../../image/config'
//import './Login.css'
import '../../Login.css'
import {Form, Icon, Input } from 'antd'

//const FormItem = Form.Item

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false,
            show: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            console.log("LoginPage ", username, password)
            dispatch(userActions.login(username, password));
        }

    }

    render() {
        const { username, password, submitted } = this.state;
        return (
           <div className="login-container">
           <div className="login-header"  key="header">
          
                <div className="slogan">

                <QueuiAnim className="flexc" delay={300} type={['right', 'left']} key="p">
                  {
                <Form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group1' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username" className="labelName">Username</label>
                        <Input addonBefore={<Icon type="user"/>} placeholder="请输入用户名" type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group1' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password" className="labelName">Password</label>
                        <Input addonBefore={<Icon type="lock"/>} placeholder="请输入密码" type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group1">
                    <button className="btn btn-primary">Login</button>
                        <Link to="/register" className="btn btn-link">Register</Link>
                    </div>
                              
                </Form>
                  }
                </QueuiAnim>
                <div className="login-footer"> 

              </div>
            </div>
            <Logo />
            </div>
            </div>
            
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 