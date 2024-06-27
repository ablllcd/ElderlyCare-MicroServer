import api from './request';

export const getCurrentHealthData = async () => {
    try {
        const res = await api.get('/healthInfo/current');

        const out = {
            heartRate: res.data.heartRate,
            temperature: res.data.temperature,
            oxygenLevel: res.data.oxygen,
        }

        return out;
    } catch (error) {
        console.log('get current health data ' + error);
        throw error;
    }
}

export const getHistoryHealthData = async (type, startTime, endTime) => {
    try {
        const res = await api.get('/healthInfo/history', {
            params: {
                type: type,
                startTime: startTime,
                endTime: endTime,
            }
        });
        return res.data;
    } catch (error) {
        console.log('get history health data ' + error);
        throw error;
    }
}