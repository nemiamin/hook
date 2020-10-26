import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import List from '../../components/List';
import { ScrollView } from 'react-native-gesture-handler';
import {fetchMainCategory} from '../../actions/category';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Grid from '../../components/Grid';
import Loader from '../../components/Loader'; 
import {toast} from '../../actions/toast';
import HomeGrid from '../../components/HomeGrid';
import colors from '../../../assets/Colors';
const { height } = Dimensions.get('window');

const MainCategory = ({fetchMainCategory, category, route, navigation, toast}) => {
    const [main_category, setMainCategrory] = useState(null)
    const [sub_category, setSubCategory] = useState([])
    const [loading, setLoading] = useState(true)
    useFocusEffect(
        useCallback(() => {
            async function MainCategoryData() {
                console.log(route.params,'params')
                if(route.params.mainCategoryId) {
                    const response = await fetchMainCategory({category_id: route.params.mainCategoryId});
                    console.log(response.productData, '***')
                setMainCategrory(response);
                setSubCategory(response.productData)
                if(response){
                    setLoading(false)
                }
                } else {
                    setLoading(false)
                    toast('err', 'Invalid request')
                }
            }
            MainCategoryData();
        }, [])
    ) 

    const categoryGrid = (MainCat) => {
        var shopByCategories = MainCat.categories;
        console.log(shopByCategories, 'cate')
        if(shopByCategories && shopByCategories.length > 0) {
             
        const gridItems = [];
        let i = 0, j = 0;
        for(const cat of shopByCategories) {
            if(i % 3 == 0) {
                if(j <= i) {
                gridItems.push(
                    <View key={i} style={{ flexDirection: 'row' }}>
    <HomeGrid category={shopByCategories[j]} height={height * 0.17} screen={'SubCategoryScreen'} param={{category_id: shopByCategories[j]._id }} navigation={navigation} />
    
                {shopByCategories[j+1] ? (
  <HomeGrid category={shopByCategories[j+1]} height={height * 0.17} screen={'SubCategoryScreen'} param={{category_id: shopByCategories[j+1]._id }} navigation={navigation} />
                        ) : <View style={{ flex: 1 }}></View>}

{shopByCategories[j+2] ? (
  <HomeGrid category={shopByCategories[j+2]} height={height * 0.17} screen={'SubCategoryScreen'} param={{category_id: shopByCategories[j+2]._id }} navigation={navigation} />
                        ) : <View style={{ flex: 1 }}></View>}
               
                    
                    </View>
                )
                    }
                j += 3;
            }
            i++;
        }
        return gridItems;
        } else {
            return (
                <View style={{alignItems:'center', paddingHorizontal:10, paddingVertical:10}}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>
                        No Data found!
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
        {!loading && main_category  && (
        <ScrollView style={{flexDirection:'column', backgroundColor: 'white'}}>
            {categoryGrid(main_category)}
         {!loading  && main_category && main_category.productData.length > 0 &&  (main_category.productData.map(subCategory => 
<View key={Math.random().toString()}>
            {!loading && sub_category.length > 0 && (
                sub_category.map(category => (
                    <View style={{ marginTop: 6, marginBottom:6}} key={Math.random().toString()}>
                        <View style={{alignItems:'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom:6}}>
                            {category.category_name}
                        </Text>
                            </View>
                        <View style={{marginTop: 10, marginHorizontal: 10}}>
    {!loading && category.sliced.length > 0 && (
                category.sliced.map((product,index) => (
                    <List key={product._id+index} data={product} navigation={navigation} />
                ))
            )}
    </View>
                        <TouchableOpacity style={{marginTop:15, alignItems:'center', backgroundColor: colors.purple_text, paddingVertical: 10 }} onPress={() => {navigation.navigate('SubCategoryScreen', {category_id: category.cat_id})
                        }}>
                            <Text style={{ fontWeight: 'bold',fontSize: 16 }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
            </View>
            ))}
        </ScrollView>
    )}
       </>)
}

const mapStateToProps = state => ({
    category: state.category
})

export default connect(
    mapStateToProps, {
        fetchMainCategory, toast
    }
) (MainCategory) 

   