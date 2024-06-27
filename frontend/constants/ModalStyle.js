import Colors from "./Colors";
import TextStyle from "./TextStyle";

const ModalStyle = {
    modalView: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    navigator: {
        width: '100%', flexDirection: 'row', justifyContent: 'space-between',
    },
    navigator_text: {
        fontFamily: 'dm-m', color: Colors.green300, fontSize: 16
    },
    body: {
        flex: 1,
        marginTop: 30,
        paddingHorizontal: 10,
        rowGap: 60,
        alignItems: 'center',
        width: '100%'
    },
    title: {
        rowGap: 8,
        alignItems: 'center',
    },
}

export default ModalStyle;