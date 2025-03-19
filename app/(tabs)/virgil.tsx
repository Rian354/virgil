import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, Animated } from 'react-native';
import { TextInput, Button, Text, Surface, Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedListItem } from '@/components/AnimatedListItem';

const { width } = Dimensions.get('window');
const MAX_WIDTH = Math.min(width * 0.75, 500);

const WELCOME_MESSAGE = {
  text: "Hello! I'm Virgil, your personal medical assistant AI. I'm here to help you understand medical information, answer health-related questions, and provide general medical guidance. While I can offer information and explanations, please remember that I'm not a replacement for professional medical advice. How can I assist you today?",
  isBot: true,
};

export default function VirgilScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const ws = useRef<WebSocket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    ws.current = new WebSocket('ws://localhost:5000');

    ws.current.onmessage = (event) => {
      const response = event.data;
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect

  const sendMessage = () => {
    if (message.trim() && ws.current) {
      setMessages(prev => [...prev, { text: message, isBot: false }]);
      ws.current.send(message);
      setMessage('');
    }
  };

  return (
    <Animated.View style={[styles.container, {
      opacity: fadeAnim,
      backgroundColor: colors.background.default
    }]}>
      <Surface style={[styles.header, { backgroundColor: colors.primary.main }]} elevation={0}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          <Avatar.Icon
            size={40}
            icon="medical-bag"
            style={[styles.avatar, { backgroundColor: colors.primary.dark }]}
            color={colors.background.paper}
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.background.paper }]}>Virgil</Text>
            <Text style={[styles.headerSubtitle, { color: colors.background.paper }]}>Medical Assistant AI</Text>
          </View>
        </Animated.View>
      </Surface>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.chatContainer, { backgroundColor: colors.background.default }]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((item, index) => (
            <AnimatedListItem
              key={index}
              index={index}
              style={[
                styles.messageWrapper,
                item.isBot ? null : { alignSelf: 'flex-end' }
              ]}
            >
              <Surface
                style={[
                  styles.messageBubble,
                  item.isBot ? [styles.botBubble, { backgroundColor: colors.background.paper }] : [styles.userBubble, { backgroundColor: colors.primary.light }]
                ]}
                elevation={0}
              >
                {item.isBot && (
                  <Avatar.Icon
                    size={24}
                    icon="medical-bag"
                    style={[styles.messageAvatar, { backgroundColor: colors.primary.main }]}
                    color={colors.background.paper}
                  />
                )}
                <Text style={[
                  styles.messageText,
                  item.isBot ? [styles.botText, { color: colors.text.primary }] : [styles.userText, { color: colors.text.primary }]
                ]}>
                  {item.text}
                </Text>
              </Surface>
            </AnimatedListItem>
          ))}
        </ScrollView>

        <Animated.View style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background.paper,
            borderTopColor: colors.background.dark,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}>
          <TextInput
            mode="outlined"
            placeholder="Ask Virgil anything..."
            value={message}
            onChangeText={setMessage}
            style={[styles.input, { backgroundColor: colors.background.paper }]}
            outlineStyle={[styles.inputOutline, { borderColor: colors.primary.light }]}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: colors.primary.main,
                text: colors.text.primary,
                placeholder: colors.text.secondary,
                background: colors.background.paper,
              },
            }}
            onSubmitEditing={sendMessage}
          />
          <Button
            mode="contained"
            onPress={sendMessage}
            style={[styles.sendButton, { backgroundColor: colors.primary.main }]}
            contentStyle={styles.sendButtonContent}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color={colors.background.paper} />
          </Button>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginVertical: 4,
    maxWidth: MAX_WIDTH,
    alignSelf: 'flex-start',
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
  },
  botBubble: {
    marginRight: 48,
  },
  userBubble: {
    alignSelf: 'flex-end',
    marginLeft: 48,
  },
  messageAvatar: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {},
  userText: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  inputOutline: {
    borderRadius: 20,
  },
  inputContent: {
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  sendButtonContent: {
    width: 44,
    height: 44,
    margin: 0,
  },
});