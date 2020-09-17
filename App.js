import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  Image,
} from 'react-native';
import Constants from 'expo-constants';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const URL = 'https://fetch-hiring.s3.amazonaws.com/hiring.json';

  const sortedByList = [];

  const sortData = (item) => {
    let id = item.listId;
    if (item.name && item.name.length) {
      if (!sortedByList[id - 1]) {
        sortedByList[id - 1] = { title: `List ${id}`, data: [] };
      } else {
        sortedByList[id - 1].data.push({ name: item.name, id: item.id });
      }
    }
  };

  const doFetch = async () => {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let json = await response.json();
      json.forEach((item) => sortData(item));
      sortedByList.forEach((list) => list.data.sort((a, b) => a.id - b.id));
      setIsLoaded(true);
      setItems(sortedByList);
      console.log(sortedByList);
    }
  };

  useEffect(() => {
    doFetch();
  }, []);

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  if (!isLoaded) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.imageView}>
          <Image
            source={{
              uri:
                'https://www.fetchrewards.com/assets/FetchRewardsHorizontalLogo.png',
            }}
            style={{
              height: 100,
              width: '100%',
            }}
            resizeMode="contain"
          />
        </View>

        <SectionList
          showsVerticalScrollIndicator={false}
          sections={items}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={styles.itemView}>
              <Item title={item.name} />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 20,
  },
  item: {
    backgroundColor: '#f3b549',
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#300c39',
    shadowOpacity: 1.0,
    width: '95%',
  },
  itemView: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: '#300c39',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    color: '#300c39',
    textAlign: 'center',
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
});
