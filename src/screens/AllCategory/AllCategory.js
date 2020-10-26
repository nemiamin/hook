import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import List from '../../components/List';
import { ScrollView } from 'react-native-gesture-handler';
import {fetch_all_category} from '../../actions/category';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Grid from '../../components/Grid';
import Loader from '../../components/Loader'; 
import {toast} from '../../actions/toast';
import HomeGrid from '../../components/HomeGrid';
const { height } = Dimensions.get('window');

const AllCategory = ({fetch_all_category, category, route, navigation, toast}) => {
    const [main_category, setMainCategrory] = useState(null)
    const [sub_category, setSubCategory] = useState([])
    const [loading, setLoading] = useState(true)
    useFocusEffect(
        useCallback(() => {
            async function MainCategoryData() {
                // console.log(route.params,'params')
                // if(route.params.mainCategoryId) {
                    const response = await fetch_all_category({type: 'category'});
                    console.log(response, 'all category')
                setMainCategrory(response);
                if(response){
                    setLoading(false)
                }
                
            }
            MainCategoryData();
        }, [])
    ) 

    const categoryGrid = (shopByCategories) => {
        
        
        if(shopByCategories && shopByCategories.length > 0) {
             
        const gridItems = [];
        let i = 0, j = 0;
        for(const cat of shopByCategories) {
            if(i % 3 == 0) {
                if(j <= i) {
                gridItems.push(
                    <View key={i}  style={{ flexDirection: 'row' }}>
    <HomeGrid height={height * 0.17} category={shopByCategories[j]} screen={'MainCategoryScreen'} param={{mainCategoryId: shopByCategories[j]._id }} navigation={navigation} />
    
                {shopByCategories[j+1] ? (
  <HomeGrid height={height * 0.17} category={shopByCategories[j+1]} screen={'MainCategoryScreen'} param={{mainCategoryId: shopByCategories[j+1]._id }} navigation={navigation} />
                        ) : <View style={{ flex: 1 }}></View>}

{shopByCategories[j+2] ? (
  <HomeGrid height={height * 0.17} category={shopByCategories[j+2]} screen={'MainCategoryScreen'} param={{mainCategoryId: shopByCategories[j+2]._id }} navigation={navigation} />
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
                        No Main Category found!
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
        <ScrollView style={{flexDirection:'column',}}>
            {categoryGrid(main_category)}
       
        </ScrollView>
    )}
       </>)
}

const mapStateToProps = state => ({
    category: state.category
})

export default connect(
    mapStateToProps, {
        fetch_all_category, toast
    }
) (AllCategory) 

   