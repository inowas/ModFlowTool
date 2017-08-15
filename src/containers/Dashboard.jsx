import '../less/dashboard.less';

import React, { PropTypes } from 'react';
import { fetchInstances, setActiveTool, setPublic, cloneToolInstance } from '../actions/dashboard';
import { getActiveToolSlug, getPublic } from '../reducers/dashboard/ui';
import { getTool, getTools } from '../reducers/dashboard/tools';

import ConfiguredRadium from 'ConfiguredRadium';
import Icon from '../components/primitive/Icon';
import { Link } from 'react-router';
import Menu from '../components/primitive/Menu';
import Navbar from './Navbar';
import Popup from '../components/primitive/Popup';
import Table from '../components/primitive/table/Table';
import Td from '../components/primitive/table/Td';
import Tr from '../components/primitive/table/Tr';
import { connect } from 'react-redux';
import {Formatter} from '../core';
import styleGlobals from 'styleGlobals';
import Button from '../components/primitive/Button';

const RadiumLink = ConfiguredRadium(Link);

const styles = {
    menu: {
        width: 2 * styleGlobals.dimensions.gridColumn + styleGlobals.dimensions.gridGutter,
        marginRight: styleGlobals.dimensions.gridGutter
    },

    linkActive: {
        textDecoration: 'underline'
    },

    lastTd: {
        position: 'relative',
        width: 0,
        padding: 0
    },

    actionWrapper: {
        position: 'absolute',
        right: 0,
        width: 500
    },

    actionContent: {
        paddingLeft: 50,
        paddingTop: styleGlobals.dimensions.spacing.small,
        paddingRight: styleGlobals.dimensions.spacing.small,
        paddingBottom: styleGlobals.dimensions.spacing.small - 1,
        background: 'linear-gradient(to right, transparent, ' + styleGlobals.colors.background + ' 50px)',
        float: 'right'
    },

    action: {
        marginLeft: styleGlobals.dimensions.spacing.large
    }
};

@ConfiguredRadium
class Dashboard extends React.Component {

    static propTypes = {
        tools: PropTypes.array,
        activeTool: PropTypes.object,
        publicInstances: PropTypes.bool,
        setActiveTool: PropTypes.func.isRequired,
        fetchInstances: PropTypes.func.isRequired,
        setPublic: PropTypes.func.isRequired,
        cloneToolInstance: PropTypes.func.isRequired
    };

    state = {
        popupVisible: false,
        navigation: [
            {
                name: 'Documentation',
                path: 'https://wiki.inowas.hydro.tu-dresden.de/',
                icon: <Icon name="file"/>
            }, {
                name: 'Datasets',
                path: 'https://kb.inowas.hydro.tu-dresden.de',
                icon: <Icon name="dataset"/>
            }/* , {
            name: 'Projects',
            icon: <Icon name="folder"/>
        }, {
            name: 'Applications',
            icon: <Icon name="layer_vertical"/>
        }, {
            name: 'Tools',
            icon: <Icon name="layer_horizontal_hatched"/>
        }*/
        ],
        hoveredInstance: null
    }

    componentDidMount( ) {
        // eslint-disable-next-line no-shadow
        const { activeTool, fetchInstances, publicInstances } = this.props;
        fetchInstances( activeTool.slug, publicInstances );
    }

    componentDidUpdate( prevProps ) {
        // eslint-disable-next-line no-shadow
        const { activeTool, publicInstances, fetchInstances } = this.props;

        if ( activeTool.slug !== prevProps.activeTool.slug || publicInstances !== prevProps.publicInstances ) {
            fetchInstances( activeTool.slug, publicInstances );
        }
    }

    setToolSelection = slug => {
        return ( ) => {
            this.props.setActiveTool( slug );
        };
    }

    renderTableRows( basePath, instances ) {
        // eslint-disable-next-line no-shadow
        const { publicInstances, cloneToolInstance } = this.props;
        return instances.map(( i, index ) => {
            return (
                <Tr key={index} onMouseEnter={( ) => this.setState({ hoveredInstance: index })} onMouseLeave={( ) => this.setState({ hoveredInstance: null })}>
                    <Td>{index}</Td>
                    <Td>{i.name}</Td>
                    <Td>{i.project}</Td>
                    <Td>{i.application}</Td>
                    <Td>{Formatter.dateToDatetime( new Date( i.created_at ))}</Td>
                    <Td>{i.user_name}</Td>
                    <Td style={[ styles.lastTd ]}>
                        {(( ) => {
                            if ( this.state.hoveredInstance === index ) {
                                return (
                                    <div style={[ styles.actionWrapper ]}>
                                        <div style={[ styles.actionContent ]}>
                                            {!i.fake && <Button style={[ styles.action ]} onClick={( ) => cloneToolInstance( i.id )} type="link">
                                                <Icon name="clone"/>
                                                clone
                                            </Button>}
                                            {!i.fake && !publicInstances && <Button style={[ styles.action ]} type="link">
                                                <Icon name="trash"/>
                                                delete
                                            </Button>}
                                            {!i.fake && <RadiumLink style={[ styles.action ]} className="link" to={basePath + i.id}>
                                                view
                                                <Icon name="arrow_right"/>
                                            </RadiumLink>}
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })( )}
                    </Td>
                </Tr>
            );
        });
    }

    renderDataTable( ) {
        // eslint-disable-next-line no-shadow
        const { activeTool, setPublic, publicInstances } = this.props;

        return (
            <div className="tile col col-abs-3 stretch">
                <h2 className="section-title">Instances of {activeTool.slug}</h2>
                <div className="grid-container toolbar">
                    <div className="col col-rel-1 toolbar-search">
                        <input className="input" placeholder="Search..." type="text"/>
                    </div>
                    <ul className="col stretch toolbar-edit">
                        <li>
                            <Link className="link" to={activeTool.path}>
                                <Icon name="add"/>
                                <span>Add new</span>
                            </Link>
                        </li>
                        <li>
                            <Button type="link" onClick={this.showPopup}>
                                <Icon name="import"/>
                                <span>Import</span>
                            </Button>
                        </li>
                        <li>
                            <Button type="link" onClick={this.showPopup}>
                                <Icon name="share"/>
                                <span>Share</span>
                            </Button>
                        </li>
                        <li>
                            <Button type="link" onClick={this.showPopup}>
                                <Icon name="trash"/>
                                <span>Delete</span>
                            </Button>
                        </li>
                    </ul>
                    <ul className="col toolbar-public">
                        <li>
                            <Button style={[( publicInstances || styles.linkActive )]} onClick={( ) => setPublic( false )} type="link">Private</Button>
                        </li>
                        <li>
                            <Button style={[( publicInstances && styles.linkActive )]} onClick={( ) => setPublic( true )} type="link">Public</Button>
                        </li>
                    </ul>
                </div>

                <Table>
                    <thead>
                        <Tr head>
                            <Td head>No.</Td>
                            <Td head>Name</Td>
                            <Td head>Project</Td>
                            <Td head>Application</Td>
                            <Td head>Date created</Td>
                            <Td head>Created by</Td>
                            <Td style={[ styles.lastTd ]} head/>
                        </Tr>
                    </thead>
                    <tbody>
                        {this.renderTableRows( activeTool.path, activeTool.instances )}
                    </tbody>
                </Table>
            </div>
        );
    }

    closePopup = ( ) => {
        this.setState({ popupVisible: false });
    }

    showPopup = ( ) => {
        this.setState({ popupVisible: true });
    }

    render( ) {
        const { navigation } = this.state;
        const { tools } = this.props;

        const menuItems = [
            {
                name: 'Projects',
                icon: <Icon name="folder"/>,
                items: [
                    {
                        name: 'Inowas'
                    }
                ]
            }, {
                name: 'Tools',
                icon: <Icon name="tools"/>,
                items: tools.map(t => {
                    return {
                        name: t.slug + ': ' + t.name,
                        onClick: this.setToolSelection( t.slug )
                    };
                })
            }
        ];

        return (
            <div className="dashboard">
                <Navbar links={navigation}/>
                <div className="app-width grid-container">
                    <Menu firstActive={1} title="Dashboard" items={menuItems} style={styles.menu}/> {this.renderDataTable( )}
                </div>
                <Popup visible={this.state.popupVisible} close={this.closePopup}>
                    <h2>Warning</h2>
                    <p>
                        You don't have the permissions to do this.
                    </p>
                </Popup>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        tools: getTools( state.dashboard.tools ),
        activeTool: getTool(state.dashboard.tools, getActiveToolSlug( state.dashboard.ui )),
        publicInstances: getPublic( state.dashboard.ui )
    };
};

// eslint-disable-next-line no-class-assign
Dashboard = connect(mapStateToProps, { setActiveTool, fetchInstances, setPublic, cloneToolInstance })( Dashboard );

export default Dashboard;
