import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { loginSuccess, logoutSuccess } from '../store/authSlice';
import api from './request';

export const userLogin = async (data) => {
    try {
        const res = await api.post('/user/login', data);
        if (res.data.token == null) {
            return res.data;
        }
        store.dispatch(loginSuccess(res.data.token));
        await AsyncStorage.setItem('token', res.data.token);
        return null;
    } catch (error) {
        // console.log(error.response);
        // console.log(error.message);
        // console.log(error.request);
        console.log('login error ' + error);
        throw error;
    }
}

export const userLogout = async () => {
    try {
        await AsyncStorage.removeItem('token');
        store.dispatch(logoutSuccess());
    } catch (error) {
        console.log('logout error ' + error);
        throw error;
    }
};

export const userSignup = async (data) => {
    try {
        const res = await api.post('/user/register', data);

        if (res.data.status == 0) return null;
        else if (res.data.status == 9) {
            return {
                type: 'accountName',
                error: res.data.msg
            }
        } else if (res.data.status == 1) {
            return {
                type: 'email',
                error: res.data.msg
            }
        } else return null;

    } catch (error) {
        console.log('sign up error ' + error);
        throw error;
    }
}
