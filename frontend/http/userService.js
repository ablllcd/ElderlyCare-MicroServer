import api from './request';

const FormData = global.FormData;

export const getUserInfo = async () => {
    try {
        const res = await api.get('/user/info');

        let userBasicInfo = res.data.userBasicInfo;
        let account = res.data.account;

        const out = {
            accountName: account.accountName,
            email: account.email,
            name: userBasicInfo.name,
            gender: userBasicInfo.gender,
            age: userBasicInfo.age,
        }
        
        return out;
    } catch (error) {
        console.log('get user info ' + error);
        throw error;
    }
}

export const getUserProfilePic = async () => {
    try {
        const res = await api.get('/user/image');
        return res.data;
    } catch (error) {
        console.log('get user profile pic ' + error);
        throw error;
    }
}

export const uploadUserProfilePic = async (image) => {
    try {
        const formData = new FormData();

        formData.append("file", {
            uri: image,
            type: "image/png",
            name: 'profile-image',
        });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            transformRequest: () => {
                return formData;
            }
        };

        const res = await api.post('/user/image/upload', formData, config);
        return res;

    } catch (error) {
        console.log('upload user profile pic ' + error);
        throw error;
    }
}

export const editUserInfo = async (data) => {
    try {
        const res = await api.post('/user/info', data);
        return res.data
    } catch (error) {
        console.log('edit user info ' + error);
        throw error;
    }
}

export const addDevice = async (device_id) => {
    try {
        const data = {
            'deviceID': device_id
        }
        const res = await api.post('/user/device', data);
        return null;

    } catch (error) {
        console.log('add device error ' + error);
        throw error;
    }
}

export const getDevice = async () => {
    try {
        const res = await api.get('/user/device');
        if (res.data.length == 0) return null;
        return res.data[0];
    } catch (error) {
        console.log('get device error ' + error);
        throw error;
    }
}