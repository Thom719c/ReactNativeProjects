import * as React from 'react';
import { StyleSheet } from "react-native";
import { DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native'

const getGlobalStyles = (props) => StyleSheet.create({
    container: {
        // backgroundColor: props.colors.backgroundColor !== 'dark' ? DarkTheme : DefaultTheme,
        backgroundColor: props.colors.backgroundColor === 'dark' ? DarkTheme : DefaultTheme,
    },
    textStyle: {
        color: props.colors.backgroundColor === 'dark' ? 'black' : 'white',
        //color: props.colors.color !== 'dark' ? DarkTheme : DefaultTheme,
    }
});

function useGlobalStyles() {
    const { colors } = useTheme();

    // We only want to recompute the stylesheet on changes in color.
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

    return styles;
}

export default useGlobalStyles;