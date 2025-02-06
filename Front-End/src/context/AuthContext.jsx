import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { csrf } from '../api/api';
import { toast } from 'react-toastify';

// @ts-ignore
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState(null);

     

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error) {
                // console.error(error);
            }
        };
        fetchUser();
    }, []);

    const login = async ({ setErrors, ...props }) => {
        await csrf();
        setErrors([]);
        try {
            await axios.post('/login', props);
            const response = await axios.get('/api/user');
            setUser(response.data);
            navigate("/");
        } catch (error) {
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        }
    }

    // const register = async ({ setErrors, ...props }) => {
    //     await csrf()
    //     setErrors([])
    //     axios
    //         .post('/api/users', props)
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error
    //             setErrors(error.response.data.errors)
    //         })
    //     navigate("/"); //redireccionar a lista de perfiles (vista administradores) 
    // }
    /* El usuario Administrador se encarga de registrar, 
    no es necesario loguear el usuario recien creado */

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()
        setErrors([])
        setStatus(null)
        const promesie = axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
        await toast.promise(promesie, {pending: 'Enviando link de reestablecimiento...'})
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()
        setErrors([])
        setStatus(null)
        axios
            // .post('/reset-password', { token: params.token, ...props })
            .post('/reset-password', { ...props })
            .then(response => navigate(`/login?reset=${btoa(response.data.status)}`))
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
        window.location.pathname = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            // register,
            forgotPassword,
            resetPassword,
            resendEmailVerification,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};