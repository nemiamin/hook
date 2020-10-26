import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
const { height, width } = Dimensions.get('window');
import Carousel from 'react-native-snap-carousel';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import {remove_review} from '../actions/product';
import { toast } from '../actions/toast';

const ReviewCard = ({ reviews, product_id, remove_review, toast, reload, isDelete }) => {

    const DeleteReview = async (data) => {
        
        const payload = {
            review_id: data._id,
            product_id
        }

        const response = await remove_review(payload);
        console.log(response, 'response remove')
        if(response.success) {
            toast('success', 'Product review removed!');
            reload()
        } else {
            toast('err', response.data);
        }
    }

    const DeleteIcon = (item) => {
        if(isDelete) {
            return (
                    <TouchableOpacity onPress={() => DeleteReview(item)} style={{flex:0.3,marginTop:20, justifyContent:'center'}}>
                    <Icon name="trash" size={16} color="red" />
                    </TouchableOpacity>
            )
        }
        
    }

    const _renderItem = ({item, index}) => {
       return (
           <View style={{backgroundColor:'white', borderRadius:10, marginRight:width*0.1, paddingHorizontal:10, alignItems:'center', paddingBottom:15}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:16, marginTop:20,fontWeight:'bold'}}>
                        {item.name}
                    </Text>
                    </View>
                    {DeleteIcon(item)}
                </View>
            <AirbnbRating
                count={5}
                defaultRating={item.rating}
                size={16}
                isDisabled={true}
                />
            <Text style={{fontStyle:'italic', padding:4}}>
            {item.description}
            </Text>
           </View>
       )
    }
      

    return (
        <View>
            <Carousel
            layout={'default'}
            data={reviews}
            renderItem={_renderItem}
            sliderWidth={width}
            itemWidth={width}
            
        />
        </View>
    )
}
       

const mapStateToProps = state => ({
    toasts: state.toast
})

export default connect(
    mapStateToProps, {
        remove_review, toast
    }
) (ReviewCard)

const styles = StyleSheet.create({
    slide: {
        minHeight: height*0.15,
    },
    title: {
        height:height*0.35,
        justifyContent:'flex-end'
    },

})