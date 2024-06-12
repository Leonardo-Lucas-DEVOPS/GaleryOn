import {createStackNavigator} from '@react-navigation/stack';

import Home from './pagesApp/Home';
import Login from './pagesLogin/Login';
import Cadastro from './pagesLogin/Cadastro';
import CadastrarDiario from './pagesApp/CadastrarDiario';
import AlterarDiario from './pagesApp/AlterarDiario';

const Stack = createStackNavigator();

export default function Rotas(){
    return(
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <Stack.Screen name="Cadastro" component={Cadastro} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
            <Stack.Screen name="Cadastrar Diario" component={CadastrarDiario} options={{headerShown: false}}/>
            <Stack.Screen name="Alterar Diario" component={AlterarDiario} options={{headerShown: false}}/>

        </Stack.Navigator>
    );
}