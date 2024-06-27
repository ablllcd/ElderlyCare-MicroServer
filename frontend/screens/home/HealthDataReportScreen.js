import { StyleSheet, View } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import HistoryDataList from '../../components/HealthHistoryData/HistoryDataList';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();


const HealthDataReportScreen = () => {
    return (
        <View style={styles.root}>

            <Tab.Navigator
                style={styles.tab_bar}
                sceneContainerStyle={{ backgroundColor: 'transparent' }}
                screenOptions={({ route }) => ({
                    tabBarInactiveTintColor: 'gray',
                    tabBarIndicatorStyle: {
                        backgroundColor: Colors.green300
                    },
                    labelStyle: {
                        fontSize: 40,
                    },
                    tabBarLabelStyle: {
                        "fontFamily": 'dm-m',
                        "fontSize": 16,
                        "textTransform": "none"
                    }
                })}

            >
                <Tab.Screen name="Hourly" component={HistoryDataList} initialParams={{ type: 'avgHour' }}
                    style={styles.tab_screen} />
                <Tab.Screen name="Daily" component={HistoryDataList} initialParams={{ type: 'avgDay' }}
                    style={styles.tab_screen} />
                <Tab.Screen name="Monthly" component={HistoryDataList} initialParams={{ type: 'avgMonth' }}
                    style={styles.tab_screen} />
            </Tab.Navigator>
        </View>
    );
}

export default HealthDataReportScreen;

const styles = StyleSheet.create({
    tab_bar: {
        borderRadius: 10,
    },
    tab_screen: {
        backgroundColor: '#ffffff',
    },

    root: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        rowGap: 20,
        backgroundColor: '#FFFFFF'
    }

})
