import { useColorScheme, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native-paper';

// Screens
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BusinessCardScreen from './screens/BusinessCardScreen';
import MyNotebookScreen from './screens/NotebookScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import MenuScreen from './screens/MenuScreen';

// Screen names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';
const menuName = 'Menu';
const BusinessCardName = 'Business Card';
const MyNotebookName = 'My Notebook';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// const NotebookStack = createStackNavigator();

function NotebookStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'MyNotebookName'}
                component={MyNotebookScreen}
                options={{ title: 'My Notebook' }}
            />
            <Stack.Screen
                name="AddNote"
                component={AddNoteScreen}
                options={{ title: 'Note' }}
            />
        </Stack.Navigator>
    );
}
const MenuStackScreen = ({ logout }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'Menu'}
                component={MenuScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen name={'Settings'} options={{ title: 'Settings' }}>
                {() => <SettingsScreen logout={logout} />}
            </Stack.Screen>

        </Stack.Navigator>
    );
};

function MainContainer(props) {
    const scheme = useColorScheme();

    return (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Tab.Navigator initialRouteName={homeName}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === homeName) {
                            iconName = focused ? 'home' : 'home-outline'
                        } else if (rn === detailsName) {
                            iconName = focused ? 'list' : 'list-outline'
                        } else if (rn === BusinessCardName) {
                            iconName = focused ? 'at-circle' : 'at-circle-outline'
                        } else if (rn === MyNotebookName) {
                            iconName = focused ? 'book' : 'book-outline'
                        } else if (rn === settingsName) {
                            iconName = focused ? 'settings' : 'settings-outline'
                        } else if (rn === menuName) {
                            iconName = focused ? 'menu' : 'menu-outline'
                        }
                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarItemStyle: {
                        padding: 10,
                        // height: 70
                    },
                    headerRight: () => (
                        <Button mode="contained"
                            buttonColor='transparent'
                            icon="logout"
                            labelStyle={styles.headerRightBtn}
                            onPress={() => props.logout()}>
                        </Button>
                    )
                })}
                tabBarOptions={{
                    activeTintColor: 'lime',
                    inactiveTintColor: 'grey',
                    labelStyle: { paddingBottom: 10, fontSize: 10 },
                }}>

                <Tab.Screen name={homeName} component={HomeScreen} />
                <Tab.Screen name={detailsName} component={DetailsScreen} />
                <Tab.Screen name={BusinessCardName} component={BusinessCardScreen} />
                <Tab.Screen name={MyNotebookName} component={NotebookStackScreen} options={{ headerShown: false }} />
                <Tab.Screen name={menuName}>
                    {() => <MenuStackScreen logout={props.logout} />}
                </Tab.Screen>

                {/* <Tab.Screen name={settingsName}>
                    {() => <SettingsScreen logout={props.logout} />}
                </Tab.Screen> */}

            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    headerRightBtn: {
        fontSize: 22,
        fontWeight: '330',
    }
});

export default MainContainer
