import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import axios from 'axios';
import Colors from '../../constants/Colors';

const ChatBotScreen = () => {
  const [data, setData] = useState([{ type: 'Chat Bot AI', text: 'How can I help you today?' }]);
  const [textInput, setTextInput] = useState('');
  const apiKey = 'sk-proj-n4w4RFmDbMfN3dHvNAoRT3BlbkFJMt2TnEgXJs8AVtictoOm';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const handleSend = async () => {
    const prompt = textInput;
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const text = response.data.choices[0].message.content;
    setData([...data, { type: 'User', text: prompt }, { type: 'Chat Bot AI', text }]);
    setTextInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        style={styles.body}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.type === 'User' ? styles.userMessage : styles.chatBotMessage]}>
            <Text style={[styles.messageText, item.type === 'User' ? styles.userText : styles.chatBotText]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={textInput}
          onChangeText={(text) => setTextInput(text)}
          placeholder="Ask me anything..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatBotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.grey100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.grey100,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: Colors.green300,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  userMessage: {
    backgroundColor: Colors.green100,
    alignSelf: 'flex-end',
  },
  chatBotMessage: {
    backgroundColor: Colors.grey100,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'dm-m',
  },
  userText: {
    color: Colors.green300,
  },
  chatBotText: {
    color: Colors.grey400,
  },
});