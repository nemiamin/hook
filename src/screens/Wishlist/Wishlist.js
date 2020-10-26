import React, { useState, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import List from '../../components/List';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {fetchSubCategoryProducts} from '../../actions/category';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import {getUser} from '../../actions/authHandler';
import {get_wishlist} from '../../actions/auth';
import {toast} from '../../actions/toast';
import colors from '../../../assets/Colors';
// import Button from '../../components/'

const Wishlist = ({get_wishlist, toast, navigation}) => {
    const [ wishlist, setWishlist ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ user, setUser ] = useState(null);
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            async function fetchData() {
                const resp = await getUser();

                if(resp && resp.token) {
                    setUser(resp);
                    reload(resp)
                } else {
                    setLoading(false)
                    toast('err','Please login to see wishlist')
                }
            }
            
            fetchData();
        }, [])
    )

    const reload = async (resp) => {
        const response = await get_wishlist({token: resp ? resp.token : user.token})
                    setWishlist(response)
                    setLoading(false);
    }
    return (
        <>
        {loading && (
        <Loader />
          )}
          {!loading && (
        <ScrollView style={{flexDirection:'column'}}>
          

          <View style={{marginTop: 50, marginHorizontal: 10}}>
          {!loading && wishlist.length > 0 ? (
                wishlist.map(product => (
                    <List key={product._id} data={product} navigation={navigation} is_wishlist={true} reloadList={reload} />
                ))
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}> 
                <Text style={{ fontSize: 35, color: colors.trans_black }}>
                    Lets Wishlist some product !
                </Text>
                <TouchableOpacity style={{ marginVertical: 15, paddingHorizontal: 35, alignItems: 'center', paddingVertical: 13, backgroundColor: colors.purple, borderRadius: 6 }} onPress={() => navigation.navigate('HomeScreen')}>
                <Text>
                    Continue
                </Text>
                </TouchableOpacity>
                    </View>
            )}
            </View>

        </ScrollView>
          )}
          </>
    )
}

const mapStateToProps = state => ({
    category: state.category
})

export default connect(
    mapStateToProps, {
        get_wishlist, toast
    }
) (Wishlist) 

