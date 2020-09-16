import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
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
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <SectionList
            sections={items}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item.name} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
