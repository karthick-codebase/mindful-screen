import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface GameStats {
  memoryBest: number;
  mathBest: number;
  totalGamesPlayed: number;
  totalScore: number;
}

export default function GamesScreen({ navigation }: any) {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  
  // Memory Game State
  const [memorySequence, setMemorySequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [memoryLevel, setMemoryLevel] = useState(1);
  const [memoryScore, setMemoryScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  
  // Math Game State
  const [mathProblem, setMathProblem] = useState({ question: '', answer: 0 });
  const [mathInput, setMathInput] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathTimer, setMathTimer] = useState(30);
  const [mathGameActive, setMathGameActive] = useState(false);
  
  // Game Stats
  const [gameStats, setGameStats] = useState<GameStats>({
    memoryBest: 0,
    mathBest: 0,
    totalGamesPlayed: 0,
    totalScore: 0,
  });
  
  // Word Association Game State
  const [wordGameActive, setWordGameActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [wordScore, setWordScore] = useState(0);
  const [wordTimer, setWordTimer] = useState(60);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  
  // Pattern Recognition Game State
  const [patternGameActive, setPatternGameActive] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [patternLevel, setPatternLevel] = useState(1);
  const [patternScore, setPatternScore] = useState(0);
  const [showingPattern, setShowingPattern] = useState(false);
  
  // Memory Game Logic
  const startMemoryGame = () => {
    setGameActive(true);
    setMemoryLevel(1);
    setMemoryScore(0);
    setUserSequence([]);
    generateSequence(1);
  };
  
  const generateSequence = (level: number) => {
    const sequence = [];
    for (let i = 0; i < level + 2; i++) {
      sequence.push(Math.floor(Math.random() * 4));
    }
    setMemorySequence(sequence);
    showSequence(sequence);
  };
  
  const showSequence = (sequence: number[]) => {
    setIsShowingSequence(true);
    setUserSequence([]);
    
    sequence.forEach((color, index) => {
      setTimeout(() => {
        // Flash the color (we'll simulate this with state)
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsShowingSequence(false);
          }, 600);
        }
      }, (index + 1) * 600);
    });
  };
  
  const handleColorPress = (colorIndex: number) => {
    if (isShowingSequence || !gameActive) return;
    
    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);
    
    // Check if the sequence matches so far
    if (newUserSequence[newUserSequence.length - 1] !== memorySequence[newUserSequence.length - 1]) {
      // Wrong sequence
      Alert.alert(
        ' Game Over!',
        `Great job! You reached level ${memoryLevel} with a score of ${memoryScore}`,
        [{ text: 'Play Again', onPress: startMemoryGame }]
      );
      setGameActive(false);
      updateStats('memory', memoryScore);
      return;
    }
    
    // Check if sequence is complete
    if (newUserSequence.length === memorySequence.length) {
      // Level complete!
      const newScore = memoryScore + (memoryLevel * 10);
      setMemoryScore(newScore);
      setMemoryLevel(memoryLevel + 1);
      
      setTimeout(() => {
        generateSequence(memoryLevel + 1);
      }, 1000);
    }
  };
  
  // Math Game Logic
  const startMathGame = () => {
    setMathGameActive(true);
    setMathScore(0);
    setMathTimer(30);
    generateMathProblem();
    
    // Start timer
    const timer = setInterval(() => {
      setMathTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endMathGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const generateMathProblem = () => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 1; num2 = 1; answer = 2;
    }
    
    setMathProblem({
      question: `${num1} ${operation} ${num2} = ?`,
      answer
    });
  };
  
  const checkMathAnswer = () => {
    if (parseInt(mathInput) === mathProblem.answer) {
      setMathScore(mathScore + 10);
      setMathInput('');
      generateMathProblem();
    } else {
      Alert.alert(' Incorrect', 'Try again!');
      setMathInput('');
    }
  };
  
  const endMathGame = () => {
    setMathGameActive(false);
    Alert.alert(
      ' Time\'s Up!',
      `Final Score: ${mathScore} points`,
      [{ text: 'Play Again', onPress: startMathGame }]
    );
    updateStats('math', mathScore);
  };
  
  const updateStats = (gameType: 'memory' | 'math' | 'word' | 'pattern', score: number) => {
    setGameStats(prev => ({
      ...prev,
      [gameType === 'memory' ? 'memoryBest' : 'mathBest']: Math.max(
        prev[gameType === 'memory' ? 'memoryBest' : 'mathBest'],
        score
      ),
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalScore: prev.totalScore + score,
    }));
  };
  
  const getColorForIndex = (index: number) => {
    const colors = [tokens.primary, tokens.success, tokens.warning, tokens.error];
    return colors[index];
  };
  
  // Word Association Game Logic
  const wordBank = [
    'ocean', 'mountain', 'forest', 'desert', 'river', 'cloud', 'storm', 'rainbow',
    'music', 'dance', 'painting', 'book', 'story', 'dream', 'adventure', 'journey',
    'friendship', 'love', 'happiness', 'peace', 'freedom', 'hope', 'courage', 'wisdom',
    'technology', 'innovation', 'discovery', 'science', 'nature', 'universe', 'star', 'planet'
  ];
  
  const startWordGame = () => {
    setWordGameActive(true);
    setWordScore(0);
    setWordTimer(60);
    setUsedWords([]);
    generateNewWord();
    
    const timer = setInterval(() => {
      setWordTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endWordGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const generateNewWord = () => {
    const availableWords = wordBank.filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) {
      // Reset if all words used
      setUsedWords([]);
      setCurrentWord(wordBank[Math.floor(Math.random() * wordBank.length)]);
    } else {
      const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(newWord);
    }
  };
  
  const submitWordAssociation = (association: string) => {
    if (association.trim().length > 2) {
      setWordScore(prev => prev + 10);
      setUsedWords(prev => [...prev, currentWord]);
      generateNewWord();
    }
  };
  
  const endWordGame = () => {
    setWordGameActive(false);
    Alert.alert(
      '🧠 Word Game Complete!',
      `Great creativity! You scored ${wordScore} points with ${Math.floor(wordScore / 10)} associations.`,
      [{ text: 'Play Again', onPress: startWordGame }]
    );
    updateStats('word', wordScore);
  };
  
  // Pattern Recognition Game Logic
  const startPatternGame = () => {
    setPatternGameActive(true);
    setPatternLevel(1);
    setPatternScore(0);
    setUserPattern([]);
    generatePattern(1);
  };
  
  const generatePattern = (level: number) => {
    const pattern = [];
    for (let i = 0; i < level + 2; i++) {
      pattern.push(Math.floor(Math.random() * 9)); // 0-8 for 3x3 grid
    }
    setCurrentPattern(pattern);
    showPattern(pattern);
  };
  
  const showPattern = (pattern: number[]) => {
    setShowingPattern(true);
    setUserPattern([]);
    
    pattern.forEach((cell, index) => {
      setTimeout(() => {
        // Pattern will be shown visually
        if (index === pattern.length - 1) {
          setTimeout(() => {
            setShowingPattern(false);
          }, 800);
        }
      }, (index + 1) * 600);
    });
  };
  
  const handlePatternCellPress = (cellIndex: number) => {
    if (showingPattern || !patternGameActive) return;
    
    const newUserPattern = [...userPattern, cellIndex];
    setUserPattern(newUserPattern);
    
    // Check if pattern matches so far
    if (newUserPattern[newUserPattern.length - 1] !== currentPattern[newUserPattern.length - 1]) {
      // Wrong pattern
      Alert.alert(
        '🧩 Game Over!',
        `Good effort! You reached level ${patternLevel} with ${patternScore} points.`,
        [{ text: 'Play Again', onPress: startPatternGame }]
      );
      setPatternGameActive(false);
      updateStats('pattern', patternScore);
      return;
    }
    
    // Check if pattern is complete
    if (newUserPattern.length === currentPattern.length) {
      const newScore = patternScore + (patternLevel * 15);
      setPatternScore(newScore);
      setPatternLevel(patternLevel + 1);
      
      setTimeout(() => {
        generatePattern(patternLevel + 1);
      }, 1000);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <StatusBar 
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={tokens.background} 
      />
      
      {/* Header */}
      <View style={{
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: tokens.background,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: tokens.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Text style={{ fontSize: 18, color: tokens.text }}>←</Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: tokens.text,
        }}>
          Brain Games
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Stats */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }),
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 16,
          }}>
            Your Stats
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.primary,
                marginBottom: 4,
              }}>
                {gameStats.memoryBest}
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Memory Best
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.success,
                marginBottom: 4,
              }}>
                {gameStats.mathBest}
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Math Best
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.accent,
                marginBottom: 4,
              }}>
                {gameStats.totalGamesPlayed}
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Games Played
              </Text>
            </View>
          </View>
        </View>

        {/* Memory Game */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            Memory Sequence Game
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            marginBottom: 16,
          }}>
            Watch the sequence and repeat it back!
          </Text>
          
          {gameActive && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ color: tokens.text }}>Level: {memoryLevel}</Text>
              <Text style={{ color: tokens.text }}>Score: {memoryScore}</Text>
            </View>
          )}
          
          {/* Color Grid */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            {[0, 1, 2, 3].map((colorIndex) => (
              <TouchableOpacity
                key={colorIndex}
                style={{
                  width: (width - 88) / 2 - 8,
                  height: 80,
                  backgroundColor: getColorForIndex(colorIndex),
                  borderRadius: 12,
                  marginBottom: 16,
                  opacity: isShowingSequence ? 0.5 : 1,
                  ...(themeName === 'dark' && {
                    shadowColor: getColorForIndex(colorIndex),
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }),
                }}
                onPress={() => handleColorPress(colorIndex)}
                disabled={isShowingSequence}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={{
              backgroundColor: gameActive ? tokens.warning : tokens.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={gameActive ? () => setGameActive(false) : startMemoryGame}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
            }}>
              {gameActive ? ' Stop Game' : ' Start Memory Game'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Math Game */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            Speed Math Challenge
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            marginBottom: 16,
          }}>
            Solve as many problems as you can in 30 seconds!
          </Text>
          
          {mathGameActive && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ color: tokens.text }}>Time: {mathTimer}s</Text>
              <Text style={{ color: tokens.text }}>Score: {mathScore}</Text>
            </View>
          )}
          
          {mathGameActive && (
            <View style={{
              backgroundColor: tokens.surface,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.text,
                marginBottom: 16,
              }}>
                {mathProblem.question}
              </Text>
              
              <View style={{
                flexDirection: 'row',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: tokens.primary,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 4,
                    }}
                    onPress={() => setMathInput(mathInput + num.toString())}
                  >
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={{
                flexDirection: 'row',
                gap: 12,
                marginTop: 16,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 18,
                  color: tokens.text,
                  minWidth: 60,
                  textAlign: 'center',
                  backgroundColor: tokens.background,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}>
                  {mathInput || '?'}
                </Text>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: tokens.success,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                  onPress={checkMathAnswer}
                  disabled={!mathInput}
                >
                  <Text style={{
                    color: '#ffffff',
                    fontWeight: '600',
                  }}>
                    Submit
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: tokens.error,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                  onPress={() => setMathInput('')}
                >
                  <Text style={{
                    color: '#ffffff',
                    fontWeight: '600',
                  }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <TouchableOpacity
            style={{
              backgroundColor: mathGameActive ? tokens.warning : tokens.success,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={mathGameActive ? () => setMathGameActive(false) : startMathGame}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
            }}>
              {mathGameActive ? ' Stop Game' : ' Start Math Challenge'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Word Association Game */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            💭 Word Association Challenge
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            marginBottom: 16,
          }}>
            Think of words related to the given word as fast as you can!
          </Text>
          
          {wordGameActive && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ color: tokens.text }}>Time: {wordTimer}s</Text>
              <Text style={{ color: tokens.text }}>Score: {wordScore}</Text>
            </View>
          )}
          
          {wordGameActive && (
            <View style={{
              backgroundColor: tokens.surface,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.text,
                marginBottom: 8,
              }}>
                Current Word:
              </Text>
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: tokens.primary,
                marginBottom: 16,
                textTransform: 'uppercase',
              }}>
                {currentWord}
              </Text>
              
              <TouchableOpacity
                style={{
                  backgroundColor: tokens.success,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  minWidth: 120,
                  alignItems: 'center',
                }}
                onPress={() => submitWordAssociation('association')}
              >
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  ✓ Got One!
                </Text>
              </TouchableOpacity>
              
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                marginTop: 8,
                textAlign: 'center',
              }}>
                Tap when you think of a related word
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={{
              backgroundColor: wordGameActive ? tokens.warning : tokens.info,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={wordGameActive ? () => setWordGameActive(false) : startWordGame}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
            }}>
              {wordGameActive ? '⏹️ Stop Game' : '▶️ Start Word Challenge'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pattern Recognition Game */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            🧩 Pattern Recognition
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            marginBottom: 16,
          }}>
            Watch the pattern and repeat it back in the correct order!
          </Text>
          
          {patternGameActive && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ color: tokens.text }}>Level: {patternLevel}</Text>
              <Text style={{ color: tokens.text }}>Score: {patternScore}</Text>
            </View>
          )}
          
          {/* 3x3 Pattern Grid */}
          <View style={{
            backgroundColor: tokens.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            alignItems: 'center',
          }}>
            <View style={{
              width: 180,
              height: 180,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cellIndex) => {
                const isInCurrentPattern = currentPattern.includes(cellIndex);
                const isInUserPattern = userPattern.includes(cellIndex);
                const shouldHighlight = showingPattern && isInCurrentPattern;
                
                return (
                  <TouchableOpacity
                    key={cellIndex}
                    style={{
                      width: 56,
                      height: 56,
                      margin: 2,
                      backgroundColor: shouldHighlight 
                        ? tokens.primary 
                        : isInUserPattern 
                        ? tokens.success 
                        : tokens.background,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: tokens.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: showingPattern ? (shouldHighlight ? 1 : 0.3) : 1,
                    }}
                    onPress={() => handlePatternCellPress(cellIndex)}
                    disabled={showingPattern}
                  >
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: shouldHighlight || isInUserPattern ? '#ffffff' : tokens.text,
                    }}>
                      {cellIndex + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {showingPattern && (
              <Text style={{
                fontSize: 14,
                color: tokens.primary,
                marginTop: 12,
                fontWeight: '600',
              }}>
                Watch the pattern...
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={{
              backgroundColor: patternGameActive ? tokens.warning : tokens.accent,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={patternGameActive ? () => setPatternGameActive(false) : startPatternGame}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
            }}>
              {patternGameActive ? '⏹️ Stop Game' : '▶️ Start Pattern Game'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          borderLeftWidth: 4,
          borderLeftColor: tokens.info,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            Brain Training Benefits
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            lineHeight: 20,
          }}>
            • Improves working memory and concentration{'\n'}
            • Enhances problem-solving skills{'\n'}
            • Boosts cognitive flexibility{'\n'}
            • Increases processing speed{'\n'}
            • Strengthens attention span
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
