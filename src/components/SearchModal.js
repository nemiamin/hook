import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, BackHandler } from 'react-native';
import Input from './Input';
import Icon from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import { search_product, storeSearch } from '../actions/product'

const SearchModal = ({ search, close, search_product, storeSearch, navigation }) => {
  const [ searchForm, setSearchForm ] = useState({
    name: ''
});

const [ products, setProducts ] = useState([]);

const changeSearchInput = async (name, e) => {
  setSearchForm({
      ...searchForm, [name]: e
  });
if(e && e.length > 2) {
  const response = await search_product({name:e});
  console.log(response, 'searched product');
  setProducts(response)
}
else {
  setProducts([])
}
}

const search_method = async (_id, cat_id) => {
const wait = await storeSearch({ product_id: _id });
console.log(wait, 'stored product')
  close();
  navigation.navigate('SubCategoryScreen', {
    category_id: cat_id
  })
}

BackHandler.addEventListener('hardwareBackPress', () => {
  console.log('fires back')
})
    return (
      <Modal visible={search} animated={true} animationType='slide' onRequestClose={close}>
          <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 6, paddingTop: 13, alignItems: 'center' }} onPress={close}>
        <Icon name='chevron-left' size={25} />
        <Text>
            Back
        </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={close}>
            <Input placeholder='Search Here' name='name' value={searchForm.name} changeInput={changeSearchInput} />
          </TouchableOpacity>
          {products && products.length > 0 && (
            products.map(prod => (
              <TouchableOpacity key={prod._id} style={{ paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 0.5, borderColor: 'rgba(211,211,211,0.8)' }} onPress={() => search_method(prod._id, prod.category_id)}>
                <Text style={{ fontSize: 13 }}>
                 {prod.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
      </Modal>
    )
}



const mapStateToProps = state => ({
 
})


export default connect(
  mapStateToProps, {
    search_product, storeSearch
  }
) (SearchModal)

