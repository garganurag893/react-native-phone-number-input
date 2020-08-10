declare const styles: {
    container: {
        width: number;
        backgroundColor: string;
        flexDirection: "row";
    };
    flagButtonView: {
        width: number;
        height: string;
        minWidth: number;
        justifyContent: "center";
        flexDirection: "row";
        alignItems: "center";
    };
    shadow: {
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    dropDownImage: {
        height: number;
        width: number;
    };
    textContainer: {
        flex: number;
        backgroundColor: string;
        paddingHorizontal: number;
        paddingVertical: number;
        textAlign: "left";
        flexDirection: "row";
        alignItems: "center";
    };
    codeText: {
        fontSize: number;
        marginRight: number;
        fontWeight: "500";
        color: string;
    };
    numberText: {
        fontSize: number;
        color: string;
        flex: number;
    };
};
export default styles;
