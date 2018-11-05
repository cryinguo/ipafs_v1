import React from 'react'
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './login/_helpers'
import { alertActions } from './login/_actions';
import { PrivateRoute } from './login/_components';
import { LoginPage } from './login/LoginPage';
import { RegisterPage } from './login/RegisterPage';
import App from './../App'
//import { HomePage } from './login/HomePage/HomePage';
// import QueuiAnim from 'rc-queue-anim'
// import Logo from '../image/Logo'
// import {brandName} from '../image/config'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        const { alert } = this.props;
        return (
            <div className="full">
                <Router history={history}>
                    <Route path="/home" component={App} />
                </Router>

                {alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                }

                <Router history={history}>
                    <div className="route">
                        <PrivateRoute exact path="/" component={LoginPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                    </div>
                </Router>
            </div>

        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedLogin = connect(mapStateToProps)(Login);
export { connectedLogin as Login }; 