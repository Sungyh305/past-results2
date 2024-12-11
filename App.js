import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Calendar } from 'react-native-calendars';
import MemoComponent from './src/MemoComponent';
import { query, where, getDocs, collection  } from "firebase/firestore";
import db from './src/firebaseConfig';

export default function App() {
  const [memos, setMemos] = useState([]);
  const [location, setLocation] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // 메모를 가져오는 비동기 함수를 실행합니다.
    const fetchMemos = async () => {
      if (selectedDate) {
        try {
          // Firebase Firestore에서 선택된 날짜에 해당하는 메모를 쿼리합니다.
          const q = query(collection(db, "memos"), where("date", "==", selectedDate));
          const querySnapshot = await getDocs(q);
          let fetchedMemos = [];
          querySnapshot.forEach((doc) => {
            // Firestore 문서에서 메모 텍스트를 가져와 배열에 추가합니다.
            fetchedMemos.push(doc.data().memoText);
          });
          setMemos(fetchedMemos); // 메모 상태를 업데이트합니다.
        } catch (error) {
          console.error("Error getting memos: ", error);
        }
      }
    };

    fetchMemos(); // useEffect의 의존성 배열에 selectedDate가 변경될 때 실행됩니다.
  }, [selectedDate]);

  useEffect(() => {
    // 기기의 현재 위치를 가져오는 함수를 실행합니다.
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position); // 위치 정보를 설정합니다.
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []); // 컴포넌트가 마운트될 때 실행됩니다.

  useEffect(() => {
    // 위치 정보와 선택된 날짜에 따라 날씨 정보를 가져오는 함수를 실행합니다.
    if (location && selectedDate) {
      fetchWeatherInfo(location, selectedDate);
    }
  }, [location, selectedDate]); // location 또는 selectedDate가 변경될 때 실행됩니다.

  const fetchWeatherInfo = async (location, date) => {
    const API_KEY = "d1d3fd17f0a12299576e13d4a49eef52";
    const LAT = location.coords.latitude;
    const LON = location.coords.longitude;

    try {
      // OpenWeatherMap API를 사용하여 날씨 정보를 가져옵니다.
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      const hourlyData = data.list.filter(d => d.dt_txt.includes(date));
      setWeatherInfo(hourlyData); // 날씨 정보 상태를 업데이트합니다.
    } catch (error) {
      console.error("Error fetching weather info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)} // 사용자가 날짜를 선택하면 선택된 날짜를 설정합니다.
      />
      {selectedDate && <MemoComponent date={selectedDate} />}          {/* 선택된 날짜가 있으면 메모 컴포넌트를 렌더링합니다. */}
      <FlatList
        data={weatherInfo}
        keyExtractor={(item) => item.dt_txt}
        renderItem={({ item }) => (
          <View>
            <Text>시간: {item.dt_txt.split(' ')[1]}</Text>
            <Text>온도: {item.main.temp}°C</Text>
            <Text>날씨: {item.weather[0].description}</Text>
          </View>
        )}
      />
      <View style={{marginTop: 20}}>
        {memos.map((memo, index) => (
          <Text key={index}>{memo}</Text> // 메모 목록을 렌더링합니다.
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
