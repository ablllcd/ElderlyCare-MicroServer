import Colors from "./Colors";
import Sizes from "./Sizes";

const TextStyle = {
    ElderlyCare: {
        fontSize: Sizes.xl50,
        fontFamily: 'dm-bold',
    },
    slogan: {
        fontSize: Sizes.xs16,
        fontFamily: 'dm-regular',
        color: Colors.grey300
    },
    welcome_func: {
        fontSize: Sizes.m22,
        fontFamily: 'dm-m',
        color: Colors.grey400,
    },
    welcome_prompt: {
        fontSize: Sizes.xs16,
        fontFamily: 'dm-m',
        color: Colors.grey400,
    },
    sign_in_up: {
        fontSize: Sizes.l42,
        fontFamily: 'dm-bold',
    },
    form_title: {
        fontSize: Sizes.s18,
        fontFamily: 'dm-m'
    },
    home_greeting: {
        fontSize: Sizes.xs16,
        fontFamily: 'dm-regular',
        color: Colors.green500,
    },
    home_section: {
        fontSize: Sizes.m22,
        fontFamily: 'dm-bold',
    },
    record_card_title: {
        fontSize: Sizes.s18,
        fontFamily: 'dm-bold',
    },
    record_card_text: {
        fontSize: Sizes.xs16,
        fontFamily: 'dm-m',
    }
};

export default TextStyle;