import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import colors from '../../assets/Colors';

const Pay = ({ show, close, payment }) => {
    // console.log(show, 'pay model')
    const [ online, setOnline ] = useState(true);
    return (
        <Modal visible={show} transparent={true} animationType='fade'>
            <View style={{ flex: 1, backgroundColor: colors.purple_text }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={close}></TouchableOpacity>
                <View style={{ flex: 1, borderTopRightRadius: 13, borderTopLeftRadius: 13, backgroundColor: 'white', elevation: 6, paddingVertical: 20, paddingHorizontal: 13, marginHorizontal: 10, }}>
                    <View style={{ flex: 0.2 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                       Choose Payment Method
                    </Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                    <TouchableOpacity onPress={() => {
                        setOnline(true)
                        payment(true)
                        }} style={{ backgroundColor: online ? colors.purple : colors.trans_black, paddingHorizontal: 13, paddingVertical: 18, marginTop: 20, borderRadius: 13 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            Pay Online
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => 
                   { setOnline(false)
                    payment(false)
                }
                    
                    } style={{ backgroundColor: !online ? colors.purple : colors.trans_black, paddingHorizontal: 13, paddingVertical: 18, marginTop: 13, borderRadius: 13 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            Cash On Delivery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: colors.purple_text, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginTop: 59, alignContent: 'flex-end' }} onPress={() => payment(online)}>
                                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                         {online ? 'Proceed' : 'Place Order'}
                                         </Text>
                                     </TouchableOpacity>
                                     </View>
                </View>
            </View>
        </Modal>
    )
}

Pay.propTypes = {

}

export default Pay

