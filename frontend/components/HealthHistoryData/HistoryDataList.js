import {ScrollView} from "react-native";
import HistoryDataCard from "./HistoryDataCard";

function HistoryDataList({route}) {
    const para = route.params.type;
    const types = ['heartRate', 'temperature', 'oxygenLevel'];

    return (
        <ScrollView>
            {types.map((type, i) => (<HistoryDataCard type={type} para={para} key={i}/>))}
        </ScrollView>
    );
}

export default HistoryDataList;
