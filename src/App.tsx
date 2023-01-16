import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import Header from './components/header/Header';
import { router } from './config/AppRouting';


function App() {
    return (
        <div className="App">
            <Header />
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
