import { useState } from 'react';
import UserContext from '../contexts/UserContexts.js';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home.js';

export default function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <BrowserRouter>
                <Switch>
                    <Route path="/home" component={Home} exact />
                </Switch>
            </BrowserRouter>
        </UserContext.Provider>
    );
}
