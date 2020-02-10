import React, {useEffect, useState} from 'react';
import AuthContext from './contexts/auth-context';
import UserContext from "./contexts/user-context";
import DefaultLayout from './layout/Layout';
import Navbar from './layout/Navbar';
import Home from './layout/Home';
import Register from './layout/Register';
import Boards from './boards/Boards';
import Dashboard from "./dashboard/Dashboard";
import BoardDetails from './boards/BoardDetails';
import UserDetails from "./users/UserDetails";
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {userInfo} from './services/board-service';
import jwt from 'jsonwebtoken';
import TaskDetails from "./tasks/TaskDetails";

const App = () => {

    const [user] = useState(JSON.parse(localStorage.getItem('token')));

    const [userDetails, setUserDetails] = useState({});

    const getUserInfo = () => {
        userInfo()
            .then(res => {
                setUserDetails(res);
            }).catch(err => {
            console.error(err);
        })
    };

    const renderDashboard = () => (
        <AuthContext.Provider value={user}>
            <UserContext.Provider value={userDetails}>
                <DefaultLayout>
                    <BrowserRouter>
                        <Navbar/>
                        <Switch>
                            <Route path="/dashboard" exact component={Dashboard}/>
                            <Route path="/boards" exact component={Boards}/>
                            <Route path="/boards/:boardId/details" exact component={BoardDetails}/>
                            <Route path="/boards/:boardId/tasks/:taskId/details" exact component={TaskDetails} />
                            <Route path="/users/:userId" exact component={UserDetails} />
                            <Redirect to="/dashboard"/>
                        </Switch>
                    </BrowserRouter>
                </DefaultLayout>
            </UserContext.Provider>
        </AuthContext.Provider>
    );

    const renderHomePage = () => (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/register" exact component={Register}/>
            </Switch>
        </BrowserRouter>
    );

    useEffect(() => {
        const func = async () => {
        };
        if (!!user) {
            if (jwt.decode(user, {complete: true}).payload.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                window.location.href = '/';
            } else {
                getUserInfo();
            }
            func();
        }
    }, [user]);

    if (!!user) {
        return renderDashboard();
    } else {
        return renderHomePage();
    }
};

export default App;
