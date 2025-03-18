import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, Appbar, List, IconButton } from 'react-native-paper';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import {Login} from './index';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ question: string; answer: string }[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [files, setFiles] = useState([]); // Stores multiple files

  useEffect(() => {
      if(!isLoggedIn && isMounted){
          router.push('/');
      }
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow any file type
        multiple: true, // Enable multiple selection
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('Document picking was canceled');
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...result.assets]); // Append new files
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const removeDocument = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000'); // Connect to your Flask WebSocket server

    ws.current.onmessage = (event) => {
      const response = event.data;
      setMessages(prev => [...prev, { question: message, answer: response }]);
    };

    return () => {
      ws.current?.close();
    };
  }, [message]);

  const sendMessage = () => {
    if (message.trim() && ws.current && files.length > 0) {
      ws.current.send(message);
      setMessages(prev => [...prev, { question: message, answer: 'Loading...' }]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Chat" />
      </Appbar.Header>

      {/* File Upload Section */}
      <View style={styles.fileUploadContainer}>
        <Button mode="contained" onPress={pickDocument}>
          Pick a Document
        </Button>

        {/* Display Uploaded Files with Remove Option */}
        <ScrollView style={styles.fileList}>
          {files.length > 0 ? (
            files.map((file, index) => (
              <List.Item
                key={index}
                title={file.name}
                description={`Size: ${file.size} bytes`}
                left={() => <List.Icon icon="file" />}
                right={() => (
                  <IconButton
                    icon="close"
                    onPress={() => removeDocument(index)}
                    accessibilityLabel={`Remove ${file.name}`}
                  />
                )}
              />
            ))
          ) : (
            <Text style={styles.noFilesText}>No files uploaded</Text>
          )}
        </ScrollView>
      </View>

      {/* Chat Section - Disabled Until File Upload */}
      {files.length > 0 ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {messages.map((item, index) => (
              <Card key={index} style={styles.messageCard}>
                <Card.Content>
                  <Text style={styles.question}>{item.question}</Text>
                  <Text style={styles.answer}>{item.answer}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Type a message..."
              value={message}
              onChangeText={setMessage}
              style={styles.input}
            />
            <Button mode="contained" onPress={sendMessage} style={styles.sendButton} disabled={files.length === 0}>
              Send
            </Button>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.uploadNotice}>
          <Text style={styles.uploadText}>Please upload at least one document to start the chat.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  chatContainer: { flex: 1 },
  scrollView: { padding: 10 },
  messageCard: { marginBottom: 10 },
  question: { fontWeight: 'bold', marginBottom: 5 },
  answer: { color: '#666' },
  inputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  input: { flex: 1, marginRight: 10 },
  sendButton: { justifyContent: 'center' },
  fileUploadContainer: { padding: 20, alignItems: 'center' },
  fileList: { width: '100%', marginTop: 10, maxHeight: 200 },
  noFilesText: { textAlign: 'center', color: '#777', marginTop: 10 },
  uploadNotice: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  uploadText: { fontSize: 16, fontWeight: 'bold', color: '#777' },
});

