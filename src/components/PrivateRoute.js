import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const role = localStorage.getItem('role');
    const isAuthenticated = role !== null;

    return (
        <Route
            {...rest}
            element={
                isAuthenticated
                    ? (role === 'admin' && rest.path.startsWith('/admin-dashboard') ? <Element /> : <Navigate to="/user-dashboard" />)
                    : <Navigate to="/" />
            }
        />
    );
};

export default PrivateRoute;
