import { createContext, useReducer } from 'react';

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.user,
                token: action.token
            }
        case 'LOGOUT':
            return {
                user: null,
                token: null
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null
    })

    // console.log('AuthContext state', state)

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}

export const AuthContext = createContext()