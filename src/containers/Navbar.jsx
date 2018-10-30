import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Icon, Menu} from "semantic-ui-react";
import {Link, withRouter} from 'react-router';
import {connect} from 'react-redux';

const styles = {
    navBar: {
        borderRadius: 0,
        padding: '0 101.5px 0 101.5px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200
    }
};

class NavBar extends React.Component {

    historyPushTo = route => {
        this.props.router.push(route);
    };

    renderLinks(links, recursionDepth = 0) {
        return links.filter(l => l).map((l, index) => {
            let active = false;
            const currentPath = this.props.routing.locationBeforeTransitions.pathname;

            if (currentPath && l.path) {
                active = true;
                const currentPathFragments = currentPath.trimLeft('/').split('/');
                const linkPathFragments = l.path.trimLeft('/').split('/');
                for (let i = recursionDepth; i < Math.max(currentPathFragments.length, linkPathFragments.length); i++) {
                    if (currentPathFragments[i] !== linkPathFragments[i]) {
                        active = false;
                        break;
                    }
                }

                if (l.path.trimLeft('/') === 'tools') {
                    active = l.path.trimLeft('/') === currentPath.trimLeft('/');
                }
            }

            let navElement = (
                <Menu.Item
                    key={index}
                    active={active}
                >
                    {l.icon}{l.name}
                </Menu.Item>
            );

            if (l.path) {
                navElement = (
                    <Link className="item" to={l.path} data-active={active} key={index}>
                        {l.icon}{l.name}
                    </Link>
                );

                if (l.path.includes('http')) {
                    navElement = (
                        <a className="item" href={l.path} target="_blank" data-active={active} key={index}>
                            {l.icon}{l.name}
                        </a>
                    );
                }
            }

            return (
                //<li key={index} className="nav-item">
                <div key={index}>
                    {navElement}
                    {l.sub && <ul className="nav-list">{this.renderLinks(l.sub, recursionDepth + 1)}</ul>}
                </div>
                //</li>
            );
        });
    }

    renderInfo = (info) => <li style={{margin: 5}}><span dangerouslySetInnerHTML={{__html: info}}/></li>;

    renderRoleSpecificItems = roles => {
        if (roles.includes('ROLE_ADMIN')) {
            return (
                <Dropdown.Item onClick={() => this.historyPushTo('/admin')}>
                    Admin
                </Dropdown.Item>
            );
        }

        return null;
    };

    renderUserNavigation(userIsLoggedIn) {
        const {roles, name} = this.props.user;
        if (userIsLoggedIn) {
            return (
                <Dropdown item text={name}>
                    <Dropdown.Menu>
                        {this.renderRoleSpecificItems(roles)}
                        <Dropdown.Item onClick={() => this.historyPushTo('/credentials')}>
                            Change password
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.historyPushTo('/profile')}>
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.historyPushTo('/logout')}>
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }

        return (
            <Menu.Item onClick={() => this.historyPushTo('/login')}>
                <Icon name="user"/> Login
            </Menu.Item>
        );
    }

    render() {
        const standardLinks = [];
        const standardLinksAuthenticationRequired = [
            {
                name: 'Dashboard',
                path: '/tools',
                icon: <Icon name="settings"/>
            }
        ];

        const userIsLoggedIn = this.props.session.apiKey;

        return (
            <Menu inverted style={styles.navBar} color='grey'>
                {this.renderLinks(standardLinks)}
                {userIsLoggedIn && this.renderLinks(standardLinksAuthenticationRequired.concat(this.props.links))}
                {!userIsLoggedIn && this.props.info && this.renderInfo(this.props.info)}
                <Menu.Menu position='right'>
                    {this.renderUserNavigation(userIsLoggedIn)}
                </Menu.Menu>
            </Menu>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
        session: state.session,
        routing: state.routing,
        ...ownProps
    };
};

NavBar.propTypes = {
    router: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    info: PropTypes.string,
    links: PropTypes.array
};

export default withRouter(connect(mapStateToProps)(NavBar));
