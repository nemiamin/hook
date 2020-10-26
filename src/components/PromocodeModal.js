import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Picker } from 'react-native';
import colors from '../../assets/Colors';
const { height, width } = Dimensions.get('window');
import { connect } from 'react-redux';
import {getUser, storeUser} from '../actions/authHandler';
import { toast } from '../actions/toast';
import { loadUser , apply_promocode, fetch_promocode} from '../actions/auth';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from './Input';
import Loader from './Loader';

const PromocodeModal = ({ toast, loadUser ,cart_id, fetch_promocode, total_price, apply_promocode, reloadData, close }) => {
    const [user, setUser] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ promocodeForm, setPromocodeForm ] = useState({
        promocode: '',
    });
    const [promocodeList, setPromocode] = useState([]);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
              const resp = await getUser();
            if(resp) {
                setUser(resp);
                const response = await loadUser({user_id: resp._id});
                if(response) {
                    setUser(response);
                    const promocodeData = await fetch_promocode();
                    if(promocodeData.success) {
                        setPromocode(promocodeData.data);
                        console.log(promocodeData.data, 'promo code details')
                    }
                    setLoading(false);
                }
            }
            }
            fetchData();
        }, [])
    )


const changePromocodeInput = (name, e) => {
    setprofileForm({
        ...promocodeForm, [name]: e
    })
}

const showPrice = (price) => {
    const calc = total_price * (1 - (price / 100))
    return Math.round(( calc + Number.EPSILON ) * 100) / 100
     
}

const ApplyPromcode = async (name) => {

    const applyPromocode = await apply_promocode({name, _id: cart_id});
    console.log(applyPromocode, 'check the resp')
    if(applyPromocode.success) {
        toast('success', 'Promocode applied!');
        reloadData();
    }
    else {
        close()
        toast('err', applyPromocode.data)
    }

}

       return (
        <>
        {loading && (
        <Loader />
          )}
          {!loading && (
        <ScrollView>
            <View style={{flexDirection:'row', marginHorizontal:10,marginVertical:10}}>
                <View style={{flex:2,justifyContent:'center'}}>
                    <Input placeholder='Promocode' name='promocode' value={promocodeForm.promocode} changeInput={changePromocodeInput} />
                </View>
                <TouchableOpacity style={{flex:1,justifyContent:'center', marginHorizontal:10}}>
                    <View style={{backgroundColor: colors.purple,justifyContent:'center', alignContent:'center',alignItems:'center', padding:10}}>
                        <Text style={{}}>Check</Text>
                    </View>
                </TouchableOpacity>


                
            </View>


            {promocodeList && promocodeList.length > 0 && (
                promocodeList.map(code => (
                    code.active && (
                      <View key={code._id} style={{}}>
                      <TouchableOpacity onPress={()=>ApplyPromcode(code.name)} style={{padding: 20,backgroundColor:'whitesmoke', marginHorizontal:10, marginVertical:10}}>
                        <View style={{flexDirection:'row', flex:1}}>
                            <View style={{ flex:1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                {code.name}
                            </Text> 
                            </View>
                            <View style={{ flex:1, alignItems: 'flex-end' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                Rs. {code.type == 'unit' ? code.value : showPrice(code.value)}
                            </Text>
                            </View>
                            
                        </View>
                        <View style={{}}>
                            <Text>
                                {code.description}
                            </Text>
                        </View>
                        </TouchableOpacity>
                     </View>
                    )
                ))

                
            )}
        </ScrollView>

        
         )}
         </>
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: colors.silver,
        marginTop:20
    }
})

const mapStateToProps = (state) => ({
    
})

export default connect(
    mapStateToProps, {
        loadUser, toast, apply_promocode, fetch_promocode
    }
) (PromocodeModal)

