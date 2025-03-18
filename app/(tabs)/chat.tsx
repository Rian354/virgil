import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Text, Card, List, IconButton, Surface, Avatar, Chip } from 'react-native-paper';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const MAX_WIDTH = Math.min(width * 0.75, 500);

const SUPPORTED_FILE_TYPES = [
  { type: 'application/pdf', name: 'PDF' },
  { type: 'text/plain', name: 'Text' },
  { type: 'application/msword', name: 'DOC' },
  { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', name: 'DOCX' },
  { type: 'application/vnd.ms-excel', name: 'XLS' },
  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', name: 'XLSX' },
];

export default function ChatScreen() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const ws = useRef<WebSocket | null>(null);
  const [files, setFiles] = useState<Array<{ name: string; uri: string }>>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  useEffect(() => {
    if (isLoggedIn && !ws.current) {
      ws.current = new WebSocket('ws://localhost:5000');

      ws.current.onmessage = (event) => {
        const response = event.data;
        setMessages(prev => [...prev, { text: response, isBot: true }]);
      };

      return () => {
        ws.current?.close();
      };
    }
  }, [isLoggedIn]);

  const pickDocument = async () => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_FILE_TYPES.map(type => type.type),
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map(file => ({
          name: file.name,
          uri: file.uri,
        }));
        setFiles(prev => [...prev, ...newFiles]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const removeDocument = (uri: string) => {
    setFiles(prev => prev.filter(file => file.uri !== uri));
  };

  const sendMessage = () => {
    if (message.trim() && ws.current) {
      setMessages(prev => [...prev, { text: message, isBot: false }]);
      ws.current.send(message);
      setMessage('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Surface style={[styles.header, { 
        backgroundColor: colors.background.default,
        borderBottomColor: colors.background.dark
      }]} elevation={0}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Chat</Text>
      </Surface>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.chatContainer, { backgroundColor: colors.background.default }]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {files.length > 0 ? (
          <>
            <View style={[styles.fileListContainer, { backgroundColor: colors.background.paper }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {files.map((file, index) => (
                  <Surface 
                    key={index} 
                    style={[styles.fileChip, { backgroundColor: colors.background.default }]}
                    elevation={0}
                  >
                    <Ionicons name="document-outline" size={16} color={colors.primary.main} />
                    <Text 
                      numberOfLines={1} 
                      style={[styles.fileChipText, { color: colors.text.primary }]}
                    >
                      {file.name}
                    </Text>
                    <IconButton
                      icon="close-circle"
                      size={18}
                      iconColor={colors.text.secondary}
                      onPress={() => removeDocument(file.uri)}
                      style={styles.removeButton}
                    />
                  </Surface>
                ))}
              </ScrollView>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((item, index) => (
                <View key={index} style={[
                  styles.messageWrapper,
                  item.isBot ? styles.botMessageWrapper : styles.userMessageWrapper
                ]}>
                  <Surface 
                    style={[
                      styles.messageBubble,
                      item.isBot ? styles.answerBubble : styles.questionBubble,
                      { backgroundColor: item.isBot ? colors.background.paper : colors.primary.main }
                    ]} 
                    elevation={0}
                  >
                    {item.isBot && (
                      <Avatar.Icon 
                        size={24} 
                        icon="robot"
                        style={[styles.botAvatar, { backgroundColor: colors.primary.main }]}
                        color={colors.background.paper}
                      />
                    )}
                    <Text style={[
                      styles.messageText,
                      { color: item.isBot ? colors.text.primary : colors.background.paper }
                    ]}>
                      {item.text}
                    </Text>
                  </Surface>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Surface style={[styles.emptyStateCard, { backgroundColor: colors.background.paper }]} elevation={0}>
              <Ionicons 
                name="cloud-upload-outline" 
                size={48} 
                color={colors.primary.main} 
              />
              <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
                Start a Conversation
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: colors.text.secondary }]}>
                Upload documents to chat about them
              </Text>
              
              <View style={styles.supportedFilesContainer}>
                <Text style={[styles.supportedFilesTitle, { color: colors.text.secondary }]}>
                  Supported file types:
                </Text>
                <View style={styles.fileTypeChips}>
                  {SUPPORTED_FILE_TYPES.map((fileType, index) => (
                    <Chip
                      key={index}
                      style={[styles.fileTypeChip, { backgroundColor: colors.background.default }]}
                      textStyle={{ color: colors.text.primary }}
                    >
                      {fileType.name}
                    </Chip>
                  ))}
                </View>
              </View>

              <Button
                mode="contained"
                onPress={pickDocument}
                style={[styles.emptyStateButton, { backgroundColor: colors.primary.main }]}
                contentStyle={styles.emptyStateButtonContent}
                icon={({ size, color }) => (
                  <Ionicons name="document-attach-outline" size={size} color={color} />
                )}
              >
                Upload Files
              </Button>
            </Surface>
          </View>
        )}

        {files.length > 0 && (
          <Surface style={[styles.inputContainer, { 
            backgroundColor: colors.background.paper,
            borderTopColor: colors.background.dark
          }]} elevation={0}>
            <IconButton
              icon="document-attach"
              size={24}
              iconColor={colors.primary.main}
              onPress={pickDocument}
              style={styles.attachButton}
            />
            <TextInput
              mode="outlined"
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              style={[styles.input, { backgroundColor: colors.background.paper }]}
              outlineStyle={styles.inputOutline}
              contentStyle={styles.inputContent}
              theme={{
                colors: {
                  primary: colors.primary.main,
                  text: colors.text.primary,
                  placeholder: colors.text.secondary,
                  background: colors.background.paper,
                },
              }}
            />
            <IconButton
              icon="send"
              size={24}
              iconColor={message.trim() ? colors.primary.main : colors.text.secondary}
              onPress={sendMessage}
              disabled={!message.trim()}
              style={styles.sendButton}
            />
          </Surface>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  chatContainer: {
    flex: 1,
  },
  fileListContainer: {
    padding: 8,
    borderBottomWidth: 1,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  fileChipText: {
    marginHorizontal: 8,
    fontSize: 14,
    maxWidth: 120,
  },
  removeButton: {
    margin: 0,
    padding: 0,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginVertical: 4,
    maxWidth: MAX_WIDTH,
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  answerBubble: {
    borderTopLeftRadius: 4,
  },
  questionBubble: {
    borderTopRightRadius: 4,
  },
  botAvatar: {
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  attachButton: {
    margin: 0,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
  },
  inputOutline: {
    borderRadius: 20,
  },
  inputContent: {
    paddingHorizontal: 8,
  },
  sendButton: {
    margin: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  supportedFilesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  supportedFilesTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  fileTypeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fileTypeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  emptyStateButton: {
    width: '100%',
    borderRadius: 12,
  },
  emptyStateButtonContent: {
    paddingVertical: 8,
  },
});

