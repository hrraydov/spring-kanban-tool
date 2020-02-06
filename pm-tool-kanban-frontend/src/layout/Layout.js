import React from 'react';

const Layout = ({children}) => (
    <div className="wrapper">
        {children}
        <footer className="mt-auto py-3 fixed-bottom bg-light">
            <div className="container text-center">
                Project management tool &copy;{(new Date().getFullYear())}
            </div>
        </footer>
    </div>
);

export default Layout;
