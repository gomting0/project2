import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ThemeProvider,
  createTheme,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PetsIcon from '@mui/icons-material/Pets';

// 커스텀 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB6C1',
    },
    background: {
      default: '#FFF8E1',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 20,
          },
        },
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const newMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
    setIsLoading(true);

    // 임시 메시지 추가
    const tempMessage = {
      text: "생각하고 있어요...",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      isTemp: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // 임시 메시지를 실제 응답으로 교체
      setMessages(prev => prev.map(msg => 
        msg.isTemp ? {
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        } : msg
      ));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(msg => 
        msg.isTemp ? {
          text: "죄송합니다. 서버와 통신 중 오류가 발생했습니다.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: 'background.default',
        py: 2
      }}>
        <Container maxWidth="sm">
          <Box sx={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              gap: 1
            }}>
              <PetsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}
              >
                두리봇
              </Typography>
              <PetsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            
            <Paper 
              elevation={3} 
              sx={{ 
                flex: 1, 
                mb: 2, 
                p: 2, 
                overflow: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 4,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            >
              <List>
                {messages.map((message, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      sx={{ 
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        gap: 1
                      }}
                    >
                      {message.sender === 'bot' && (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <PetsIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            두리봇
                          </Typography>
                        </Box>
                      )}
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: message.sender === 'user' ? 'primary.main' : '#fff',
                          maxWidth: '70%',
                          borderRadius: 4,
                          boxShadow: 2,
                          position: 'relative'
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Box>
                              {message.sender === 'user' && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: 'block', 
                                    color: '#fff',
                                    mb: 0.5,
                                    fontWeight: 'bold'
                                  }}
                                >
                                  사용자
                                </Typography>
                              )}
                              <Typography 
                                sx={{ 
                                  whiteSpace: 'pre-line',
                                  color: message.sender === 'user' ? '#fff' : 'inherit',
                                  fontFamily: 'inherit'
                                }}
                              >
                                {message.text}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                display: 'block',
                                mt: 1
                              }}
                            >
                              {message.timestamp}
                            </Typography>
                          }
                        />
                      </Paper>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              p: 2,
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'primary.main'
            }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff'
                  }
                }}
              />
              <Button 
                variant="contained" 
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleSend}
                disabled={isLoading}
                sx={{
                  px: 3,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                전송
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;