import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import TextStyle from '../../constants/TextStyle';
import { getHistoryHealthData } from "../../http/healthService";
import { LineChart } from "react-native-chart-kit";


function getCurrentTime() {
    let nowDate = new Date().getTime()
    let offset_GMT = new Date().getTimezoneOffset()
    let GMT = nowDate + offset_GMT * 60 * 1000
    return new Date(GMT + 8 * 60 * 60 * 1000)
}


function getStartTime(currentTime, para) {
    let time;
    if (para === 'avgHour') {
        time = new Date(currentTime - 11 * 60 * 60 * 1000);
    } else if (para === 'avgDay') {
        time = new Date(currentTime - 6 * 24 * 60 * 60 * 1000);
    } else {
        time = new Date().setMonth(new Date().getMonth() - 11)
    }

    return time;
}


function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + ':';
    var ss = date.getMilliseconds() < 10 ? '00' + date.getMilliseconds() : date.getMilliseconds() < 100 ? '0' + date.getMilliseconds() : date.getMilliseconds();
    return Y + M + D + h + m + s + ss;
}


function processingData(data, type) {
    const length = data.length
    let labels = [];
    let showData = [];

    for (let i = 0; i < length; i++) {
        let item = data[i];
        labels.push(item.timestamp.slice(-2));
        if (type === 'heartRate') {
            showData.push(item.heartRate == null ? 0 : item.heartRate)
        } else if (type === 'temperature') {
            showData.push(item.temperature == null ? 0 : item.temperature)
        } else {
            showData.push(item.oxygen == null ? 0 : item.oxygen)
        }
    }
    return [labels, showData]
}

const HistoryDataCard = ({ type, para }) => {

    let data = [
        {
            "acctID": null,
            "timestamp": "200201",
            "heartRate": 0.49877846,
            "temperature": 0.49883083,
            "oxygen": 0.5057338
        },
        {
            "acctID": null,
            "timestamp": "200202",
            "heartRate": 0.4915792,
            "temperature": 0.49101707,
            "oxygen": 0.5117817
        },
        {
            "acctID": null,
            "timestamp": "200203",
            "heartRate": 0.49681354,
            "temperature": 0.48767853,
            "oxygen": 0.49546316
        },
        {
            "acctID": null,
            "timestamp": "200204",
            "heartRate": 0.49863622,
            "temperature": 0.5034914,
            "oxygen": 0.49359792
        },
        {
            "acctID": null,
            "timestamp": "200205",
            "heartRate": 0.50009197,
            "temperature": 0.49858308,
            "oxygen": 0.50588584
        },
        {
            "acctID": null,
            "timestamp": "200206",
            "heartRate": 0.4948915,
            "temperature": 0.49411583,
            "oxygen": 0.5006997
        },
        {
            "acctID": null,
            "timestamp": "200207",
            "heartRate": 0.49918756,
            "temperature": 0.5141513,
            "oxygen": 0.5001266
        },
        {
            "acctID": null,
            "timestamp": "200208",
            "heartRate": 0.4930886,
            "temperature": 0.5033223,
            "oxygen": 0.50580573
        },
        {
            "acctID": null,
            "timestamp": "200209",
            "heartRate": 0.50130814,
            "temperature": 0.5079579,
            "oxygen": 0.49878767
        },
        {
            "acctID": null,
            "timestamp": "200210",
            "heartRate": 0.48971334,
            "temperature": 0.5021489,
            "oxygen": 0.49372968
        },
        {
            "acctID": null,
            "timestamp": "200211",
            "heartRate": null,
            "temperature": null,
            "oxygen": null
        },
        {
            "acctID": null,
            "timestamp": "200212",
            "heartRate": null,
            "temperature": null,
            "oxygen": null
        }];
    data = processingData(data, type, para);

    const [chartData, setChartData] = useState({
        labels: data[0],
        datasets: [{ data: data[1] }],
    })

    const healthCardStructure = {
        heartRate: {
            icon: "heart-outline",
            color: Colors.pink300,
            unit: 'bpm',
            title: 'Heart Rate',
        },
        temperature: {
            icon: "thermometer-outline",
            color: Colors.cyan300,
            unit: '℃',
            title: 'Temperature',
        },
        oxygenLevel: {
            icon: 'eyedrop-outline',
            color: Colors.blue300,
            unit: '%Sa-O2',
            title: 'Oxygen Level'
        }
    }

    let currentTime = getCurrentTime()
    let startTime = getStartTime(currentTime, para)

    currentTime = timestampToTime(currentTime)
    startTime = timestampToTime(startTime)

    async function init() {
        try {
            const res = await getHistoryHealthData(para, startTime, currentTime);
            data = processingData(res, type);
            setChartData({
                labels: [...data[0]],
                datasets: [{ data: [...data[1]] }, { data: [0] }],
            });
        }
        catch (err) {
            console.log('history data card error ' + err);
        }
    }

    useEffect(() => {
        init();
    }, [para]);


    return (
        <View style={[styles.cardContainer]} cardElevation={2} cornerRadius={5}>
            <View style={styles.upper}>
                <Ionicons
                    name={healthCardStructure[type].icon}
                    size={Sizes.xs16}
                    color={healthCardStructure[type].color}
                />
                <Text
                    style={[
                        TextStyle.form_title,
                        { color: healthCardStructure[type].color }
                    ]}>
                    {healthCardStructure[type].title}
                </Text>
            </View>

            <LineChart
                data={chartData}
                width={deviceWidth}
                height={200}
                yLabelsOffset={25}

                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: () => healthCardStructure[type].color,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForBackgroundLines: {
                        strokeWidth: 0
                    },
                    barPercentage: 0.4,
                    yAxisLabel: "?",

                }}
                style={{
                    marginVertical: -5,
                    borderRadius: 16,
                    marginLeft: -20
                }}
            />
        </View>
    )
}

export default HistoryDataCard;

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        rowGap: 15,
        width: deviceWidth,
        marginBottom: 30,
        backgroundColor: '#ffffff',
    },
    upper: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
    },
    lower: {
        flexDirection: 'row',
        alignItems: 'baseline',
        columnGap: 5,
    }
});
