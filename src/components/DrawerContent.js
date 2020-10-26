import React, { useState, useEffect } from "react";
import { View, StyleSheet, Share } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/FontAwesome";
import { getUser, clearUser } from "../actions/authHandler";
import { connect } from "react-redux";
import { login, logout, fireToast } from '../actions/auth';
import colors from "../../assets/Colors";
import { toast } from '../actions/toast'

const DrawerContent = (props) => {
  const [language, setLanguage] = useState(false);
  const toggleLanguage = () => {
    setLanguage(!language);
  };
  const [ user, setUser ] = useState(null);
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    (async () => {
      const resp = await getUser();
      // console.log(resp, 'from local storage &', loading, resp.token)
      setUser(resp);
      if(resp) {
        setAuthenticated(true);
      }
      
      setLoading(false);
    })()
  }, []);

  useEffect(() => {  
    (async () => {
      const resp = await getUser();
      // console.log(resp, 'from local storage', loading, resp.token)
      setUser(resp);
      if(resp) {
        setAuthenticated(true);
      }
      
      setLoading(false);
    })()
   
  }, [props.auth.isAuthenticated, props.auth])

  const shareReferral = async () => {
    try {
      console.log(user, 'this is user for refer')
      const result = await Share.share({
        message:
        `This is my referral code. Use this to unlock exciting discount => ${user.reference_id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              {/* <Avatar.Image
                source={{
                  uri:
                    "https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
                }}
                size={50}
              /> */}
              {/* <View style={{ marginLeft: 15 }}>
                <Title style={styles.title}>Dharmik Soni</Title>
                <Caption style={styles.caption}>@dharmiksoni37</Caption>
              </View> */}
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="home-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Home"
              onPress={() => props.navigation.navigate("HomeScreen")}
            />
           
             <DrawerItem
              icon={({ color, size }) => (
                <Icons
                  name="shopping-bag"
                  color={color}
                  size={size}
                />
              )}
              label="Shop By Category"
              onPress={() => props.navigation.navigate("AllCategory")}
            />
           
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="cart-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Cart"
              onPress={() => props.navigation.navigate("CartScreen")}
            />
                 <DrawerItem
                 icon={({ color, size }) => (
                   <Icon
                     name="face-profile"
                     color={color}
                     size={size}
                   />
                 )}
                 label="Profile"
                 onPress={() => 
                  {
                    if(user && user.token && authenticated && !loading) {
                      props.navigation.navigate("ProfileScreen")
                    }
                    else {
                      console.log('comes inside')
                      props.fireToast(props.navigation);
                    }
                  }
                }
               />


   </Drawer.Section>
             {/* )} */}
             {/* {user && user.token && authenticated && !loading && ( */}
              
<DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="heart-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Wishlist"
              onPress={() => 
                {
                  if(user && user.token && authenticated && !loading) {
                  props.navigation.navigate("WishlistScreen")
                  } else {
                    props.fireToast(props.navigation)
                  }
              }}
            />
             {/* )} */}
  {/* {user && user.token && authenticated && !loading && ( */}
<DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="border-all"
                  color={color}
                  size={size}
                />
              )}
              label="Orders"
              onPress={() => 
                {
                  if(user && user.token && authenticated && !loading) {
                  props.navigation.navigate("OrderScreen")
                  } else {
                    props.fireToast(props.navigation)
                  }
              }
            }
            />

<DrawerItem
              icon={({ color, size }) => (
                <Icons
                  name="shopping-basket"
                  color={color}
                  size={size}
                />
              )}
              label="Re-Order"
              onPress={() => 
                {
                  if(user && user.token && authenticated && !loading) {
                  props.navigation.navigate("OrderScreen")
                  } else {
                    props.fireToast(props.navigation)
                  }
              }
            }
            />
  {/* )} */}
    {/* {user && user.token && authenticated && !loading && ( */}
      <Drawer.Section style={styles.drawerSection}>
<DrawerItem
              icon={({ color, size }) => (
                <Icons
                  name="money"
                  color={color}
                  size={size}
                />
              )}
              label="Refer & Earn"
              onPress={() => 
                {
                  if(user && user.token && authenticated && !loading) {
                    shareReferral()
                  } else {
                    props.fireToast(props.navigation)
                  }
              }}
            />
            <DrawerItem
                 icon={({ color, size }) => (
                   <Icons
                     name="headphones"
                     color={color}
                     size={size}
                   />
                 )}
                 label="Contact Us"
                 onPress={() => 
                  {
                    // if(user && user.token && authenticated && !loading) {
                      props.navigation.navigate("ContactScreen")
                    // }
                    // else {
                    //   console.log('comes inside')
                    //   props.fireToast(props.navigation);
                    // }
                  }
                }
               />
            </Drawer.Section>
  {/* )} */}
          {/* </Drawer.Section> */}

          {/* <Drawer.Section title="Preferences">
            <TouchableRipple onPress={() => toggleLanguage()}>
              <View style={styles.preference}>
                {/* {language ? <Text>Hindi</Text> : <Text>English</Text>} */}
                {/* <Text>English - Hindi</Text>
                <View pointerEvents="none">
                  <Switch value={language} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>  */}
          {user && user.token && authenticated && !loading && (
      // <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            props.navigation.navigate("HomeScreen");
            props.logout()
          }}
        />
      // </Drawer.Section>
      )}
        </View>
      </DrawerContentScrollView>
      
          {!loading && !user.token && (
 <Drawer.Section style={styles.bottomDrawerSection}>
 <DrawerItem
   icon={({ color, size }) => (
     <Icon name="exit-to-app" color={color} size={size} />
   )}
   label="Sign In"
   onPress={() => {
     props.navigation.navigate("AuthStack");
   }}
 />
</Drawer.Section>
          )}
     
    </View>
  );
};
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    // marginTop: 4,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#F4F4F4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  login, logout, fireToast
})(DrawerContent);
