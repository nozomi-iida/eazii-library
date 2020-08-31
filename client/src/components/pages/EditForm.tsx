import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { IBook } from '../../types/book';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { deleteBook } from '../actions/book';

type FormData = {
  title: string;
  url: string;
  description: string;
  reason: string;
};

type RootStackParamList = {
  Apply: undefined;
  詳細: { book: IBook };
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, '詳細'>;

type NavigationProp = StackNavigationProp<RootStackParamList, 'Apply'>;

type Props = {
  navigation: NavigationProp;
  route: ProfileScreenRouteProp;
};

export default function EditForm({ navigation, route }: Props) {
  const { control, setValue, handleSubmit, errors } = useForm<FormData>();
  const [book, setBook] = useState<IBook>();
  const [user, setUser] = useState({ username: '', email: '' });
  const dispatch = useDispatch();

  const Boiler = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .get('http://192.168.0.22:8000/user/', {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(res => setUser(res.data))
      .catch(error => console.log('Error: ' + error));
  };

  useEffect(() => {
    Boiler();
    setBook(route.params.book);
  }, []);
  const onSubmit = ({ title, description, reason, url }: FormData) => {
    const apply = {
      username: user.username,
      title,
      description,
      reason,
      url,
      status: '申請中',
      review: 1,
    };
    axios
      .post('http://192.168.0.22:8000/book/addApply', apply)
      .then(res => {
        res.data;
        navigation.navigate('Apply');
        setValue('title', '');
        setValue('url', '');
        setValue('description', '');
        setValue('reason', '');
      })
      .catch(error => console.log(error));
  };

  const deletePress = (id: string) => {
    dispatch(deleteBook(id));
    navigation.navigate('Apply');
  };

  return (
    <View>
      {book && (
        <View>
          <Text>タイトル*</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name='title'
            rules={{ required: true }}
            defaultValue={book.title}
          />
          <View style={styles.errContainer}>
            {errors.title && (
              <Text style={{ color: '#FF0000' }}>書き忘れています。</Text>
            )}
          </View>

          <Text>AmazonのURL*</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name='url'
            rules={{ required: true }}
            defaultValue={book.url}
          />
          <View style={styles.errContainer}>
            {errors.url && (
              <Text style={{ color: '#FF0000' }}>書き忘れています。</Text>
            )}
          </View>

          <Text>本の簡単な詳細*</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name='description'
            rules={{ required: true }}
            defaultValue={book.description}
          />
          <View style={styles.errContainer}>
            {errors.description && (
              <Text style={{ color: '#FF0000' }}>書き忘れています。</Text>
            )}
          </View>

          <Text>読みたい理由*</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name='reason'
            rules={{ required: true }}
            defaultValue={book.reason}
          />
          <View style={styles.errContainer}>
            {errors.reason && (
              <Text style={{ color: '#FF0000' }}>書き忘れています。</Text>
            )}
          </View>
          <View style={{ marginBottom: 10 }}>
            <Button title='更新する' onPress={handleSubmit(onSubmit)} />
          </View>
          <Button title='削除する' onPress={() => deletePress(book._id)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0e101c',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
  errContainer: {
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
  },
});