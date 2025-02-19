import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';

type User = {
    id: number,
    username: string,
    password?: string,
}

interface AuthContextType {
    loading: boolean;
    token: string | null;
    user: User | null;
    login: (userToken: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
}


export  const AuthContext = createContext<AuthContextType >({
    loading: false,
    token: null,
    user: null,
    login: async () => {},
    logout: async () => {},
})

export const AuthProvider = ({children}: {children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        //load user and token from storage
        const loadData = async () => {
            try {
                const tokenFromStorage = await  SecureStore.getItemAsync('token');
                const userFromStorage:any = await  SecureStore.getItemAsync('user');
                if (!tokenFromStorage && userFromStorage){
                   setUser(null)
                    setToken(null)
                    return;
                }
                setToken(tokenFromStorage)
                setUser(JSON.parse(userFromStorage))
            }catch (error){
                console.log("Error loading data: ", error)
            }finally {
                setLoading(false)
            }
        }

        loadData()
    }, []);


    const login = async (userToken:string, userData: User) => {
        try {
            await SecureStore.setItemAsync('token', userToken)
            await SecureStore.setItemAsync('user', JSON.stringify(userData))
            setToken(userToken)
            setUser(userData)
        }catch (error){
            console.log("Error saving data: ", error)
        }

    }

    const logout = async () => {
        await SecureStore.deleteItemAsync('token')
        await SecureStore.deleteItemAsync('user')
        setToken(null)
        setUser(null)
    }

    
    

    

  return (
      <AuthContext.Provider value={{loading, token, user, login, logout}}>
    {
          children
      }
          </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)