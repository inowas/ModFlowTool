import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Action} from '../actions';
import {hasSessionKey, isAdmin, getFetched} from '../reducers';
import {withRouter} from 'react-router';
import App from '../../components/App';

class AppForAdminUser extends React.Component {

    checkAuthentication() {
        if (!this.props.userIsLoggedIn) {
            this.props.router.push('/login');
        }

        if (this.props.userShouldBeFetched) {
            this.props.fetchUser();
        }

        if (!this.props.userIsAdmin) {
            this.props.router.push('/');
        }
    }

    render() {
        this.checkAuthentication();
        return <App children={this.props.children}/>;
    }
}

const mapStateToProps = state => {
    return {
        userIsAdmin: isAdmin(state.user),
        userIsLoggedIn: hasSessionKey(state.session),
        userShouldBeFetched: !getFetched(state.user)
    };
};

const mapDispatchToProps = {
    fetchUser: Action.fetchUser,
};

AppForAdminUser.propTypes = {
    children: PropTypes.node,
    fetchUser: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    userIsAdmin: PropTypes.bool.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    userShouldBeFetched: PropTypes.bool.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppForAdminUser));
