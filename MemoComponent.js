import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import db from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export default function MemoComponent({ date }) {
    const [memoText, setMemoText] = useState('');

    const handleSaveMemo = async () => {
     try {
         await addDoc(collection(db, "memos"), {
             date,
             memoText
         });
         console.log('Memo saved successfully!');
         setMemoText('');
     } catch (error) {
         console.error('Error saving memo: ', error);
     }
 };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.memoInput}
                value={memoText}
                onChangeText={setMemoText}
                multiline
                placeholder="Enter your memo here"
            />
            <Button title="Save Memo" onPress={handleSaveMemo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    memoInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        minHeight: 100, // 메모 입력란의 최소 높이 설정
    },
});