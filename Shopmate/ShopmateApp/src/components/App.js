import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';

//const TopBar = () => <h2>Top Bar</h2>
//const Search = () => <h2>Search</h2>
//const Category = () => <h2>Category</h2>
const Landing = () => <h2>Landing</h2>
const Cart = () => <h2>Cart</h2>

const App = () => {
    return (
        <div>
           <Header />
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Landing} />
                    <Route path="/cart" component={Cart} />
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;