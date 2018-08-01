/*
React, Redux, Router Cores
*/
import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from './router/AppRouter';
import store from './store/index';

/*
Material-UI Theme
*/
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/*
Local CSS
*/
import './App.css';


/**
 * Application container
 *      set up necessary providers for children components to use.
 */
const App = () => (
    <div className='app-container'>
        <Provider store={store}>
            {/* MuiThemeProvider is required to use Material UI components */}
            <MuiThemeProvider>
                    <AppRouter/>
            </MuiThemeProvider>
        </Provider>
    </div>
);


export default App;
