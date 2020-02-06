import React from 'react';
import { Link } from 'react-router-dom'
import { Navbar as BSNavbar, Nav, NavItem, NavLink } from 'reactstrap';
import useUser from './../hooks/useUser';

const Navbar = () => {

    const user = useUser();

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <BSNavbar color="primary" light expand="sm">
            <Nav className="mr-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/dashboard"><i className="fas fa-chalkboard"></i> Dashboard</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/boards"><i className="fas fa-chalkboard"></i> Boards</NavLink>
                </NavItem>
            </Nav>
            <Nav className="ml-auto d-flex align-items-center" navbar>
                <NavItem className="mr-1">
                    <NavLink tag={Link} to={`/users/${user.id}`}>{user.email}</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</NavLink>
                </NavItem>
            </Nav>
        </BSNavbar>
    );
};

export default Navbar;
