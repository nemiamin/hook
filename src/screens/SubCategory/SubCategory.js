import React, { useState, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import List from '../../components/List';
import { ScrollView } from 'react-native-gesture-handler';
import {fetchSubCategoryProducts} from '../../actions/category';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';

const SubCategory = ({fetchSubCategoryProducts, category, route, navigation}) => {
    const [subProduct, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                console.log(route.params,'param')
                const response = await fetchSubCategoryProducts({category_id: route.params.category_id});
                console.log(response, 'sub category')
                if(response) {
                    setProduct(response);
                    setLoading(false);
                }
            }
            
            fetchData();
        }, [])
    )

        const ProductsData = () => {
            if(subProduct && subProduct.length > 0) {
                return (
                    <View style={{marginTop: 50, marginHorizontal: 10}}>
          {!loading && (
                subProduct.map(product => (
                    <List key={product._id} data={product} navigation={navigation} />
                ))
            )}
            </View>
                )
            } else {
                return (
                    <View style={{marginTop: 50, marginHorizontal: 10, alignItems:'center'}}>
                        <Text>
                            No Products found!
                        </Text>
            </View>
                )
            }
        }

    return (
        <>
        {loading && (
        <Loader />
          )}
          {!loading && (
        <ScrollView style={{flexDirection:'column',}}>
          

          {ProductsData()}

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
        fetchSubCategoryProducts
    }
) (SubCategory) 

