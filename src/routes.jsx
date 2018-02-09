import React from 'react';
import {Route, IndexRoute} from 'react-router';
import AppForAuthenticatedUser from './containers/AppForAuthenticatedUser';
import tools from './containers/tools';
import * as T02 from './t02/index';
import * as T03 from './t03/index';
import * as T04 from './t04/index';
import * as T07 from './t07/index';
import * as T08 from './t08/index';
import * as T09 from './t09/index';
import * as T13 from './t13/index';
import * as T14 from './t14/index';
import * as ToolInstance from './toolInstance/index';
import DashboardContainer from './containers/Dashboard';
import Login from './containers/Login';
import LandingPage from './containers/LandingPage';
import Impressum from './containers/Impressum';
import {WebData} from './core/index';
import SignUp from './containers/SignUp';

const routes = store => (
    <Route path="/">
        <IndexRoute component={LandingPage}/>
        <Route path="impressum" component={Impressum}/>
        <Route path="login" component={Login}/>
        <Route path="signup" component={SignUp}/>
        <Route path="tools" component={AppForAuthenticatedUser}>
            <IndexRoute component={DashboardContainer}/>
            <Route
                path="T02(/:id)"
                component={T02.Container.Main}
                tool={'T02'}
                onEnter={nextState => {
                    // REVIEW Shouldn't this be in componentWillReceiveProps and componentWillMount
                    store.dispatch(WebData.Modifier.Action.clear());
                    if (nextState.params.id) {
                        store.dispatch(
                            ToolInstance.Modifier.Query.getToolInstance(
                                'T02',
                                nextState.params.id,
                            )
                        );
                    }
                }}
            />
            <Route
                path="T03(/:id)(/:property)(/:type)(/:pid)"
                component={T03.Container.Main}
                tool={'T03'}
                onEnter={nextState => {
                    // REVIEW Shouldn't this be in componentWillReceiveProps and componentWillMount
                    store.dispatch(WebData.Modifier.Action.clear());
                    if (nextState.params.id) {
                        store.dispatch(
                            T03.Modifier.Query.getModflowModelDetails(
                                'T03',
                                nextState.params.id,
                                nextState.params.property,
                                nextState.params.type,
                                nextState.params.pid
                            )
                        );
                        return;
                    }
                    store.dispatch(
                        T03.Modifier.Action.destroyModflowModel('T03')
                    );
                }}
            />
            <Route path="T04" component={T04.Container.Main} tool={'T04'}/>
            <Route path="T06(/:id)" component={tools.T06}/>
            <Route path="T07" component={T07.Container.Main}>
                <IndexRoute component={T07.Component.New}/>
                <Route path=":id">
                    <IndexRoute component={T07.Component.CrossSection}/>
                    <Route
                        path="CrossSection"
                        component={T07.Component.CrossSection}
                    />
                    <Route
                        path="Difference"
                        component={T07.Component.Difference}
                    />
                    <Route
                        path="TimeSeries"
                        component={T07.Component.TimeSeries}
                    />
                </Route>
            </Route>
            <Route path="T07E/:said" tool={'T07E'}>
                <Route
                    path=":id(/:property)(/:type)(/:pid)"
                    component={T03.Container.Main}
                    tool={'T07E'}
                    onEnter={nextState => {
                        // REVIEW Shouldn't this be in componentWillReceiveProps and componentWillMount
                        store.dispatch(WebData.Modifier.Action.clear());
                        if (nextState.params.id) {
                            store.dispatch(
                                T03.Modifier.Query.getModflowModelDetails(
                                    'T07E',
                                    nextState.params.id,
                                    nextState.params.property,
                                    nextState.params.type,
                                    nextState.params.pid
                                )
                            );
                            return;
                        }
                        store.dispatch(
                            T03.Modifier.Action.destroyModflowModel('T07E')
                        );
                    }}
                />
            </Route>

            <Route path="T08(/:id)" component={T08.Container.Main} tool={'T08'}/>

            <Route path="T09" component={T09.Container.T09} tool={'T09'}/>
            <Route path="T09A(/:id)" component={T09.Container.T09A} tool={'T09A'}/>
            <Route path="T09B(/:id)" component={T09.Container.T09B} tool={'T09B'}/>
            <Route path="T09C(/:id)" component={T09.Container.T09C} tool={'T09C'}/>
            <Route path="T09D(/:id)" component={T09.Container.T09D} tool={'T09D'}/>
            <Route path="T09E(/:id)" component={T09.Container.T09E} tool={'T09E'}/>

            <Route path="T12(/:id)" component={tools.T12}/>

            <Route path="T13" component={T13.Container.T13}/>
            <Route path="T13A(/:id)" component={T13.Container.T13A} tool={'T13A'}/>
            <Route path="T13B(/:id)" component={T13.Container.T13B} tool={'T13B'}/>
            <Route path="T13C(/:id)" component={T13.Container.T13C} tool={'T13C'}/>

            <Route path="T14" component={T14.Container.T14}/>
            <Route path="T14A(/:id)" component={T14.Container.T14A} tool={'T14A'}/>
            <Route path="T14B(/:id)" component={T14.Container.T14B} tool={'T14B'}/>
            <Route path="T14C(/:id)" component={T14.Container.T14C} tool={'T14C'}/>
            <Route path="T14D(/:id)" component={T14.Container.T14D} tool={'T14D'}/>

            <Route path="T16(/:id)" component={tools.T16}/>

            <Route path="T17(/:id)" component={tools.T17}/>

            <Route path="T18(/:id)" component={tools.T18}/>
        </Route>
    </Route>
);

export default routes;
