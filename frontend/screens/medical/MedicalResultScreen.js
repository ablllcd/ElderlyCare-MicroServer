import React, {useEffect, useRef, useState} from "react";
import WebView from "react-native-webview";

export default function MedicalScreen({route, navigation}) {
    const uri = route.params

    return (
        <WebView
            source={uri}
        />
    )
}