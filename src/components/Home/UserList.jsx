import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React from 'react';

const users = [
  {
    id: 1,
    name: 'Bitisha Maharjan',
    imageUrl: require('../../assets/user/bits.jpg'), 
  },
  {
    id: 2,
    name: 'Prekshya Dali',
    imageUrl: require('../../assets/user/pre.jpg'),  
  },
  {
    id: 3,
    name: 'Avantika Nepal',
    imageUrl: require('../../assets/user/av.jpg'),  
  },
  {
    id: 4,
    name: 'Lana del rey',
    imageUrl: require('../../assets/user/lana.jpg'), 
  },
];

const UserList = () => {
  return (
    <View style={styles.container}>
        <Text>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
             <Image 
              source={typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl} 
              style={styles.userImage} 
            />
            <Text style={styles.userName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});
