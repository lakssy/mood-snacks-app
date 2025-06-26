# Mood Snacks App 🍫 😊

A React Native application that helps users track their moods and suggests appropriate snacks based on their emotional state. This innovative app combines mood tracking with personalized snack recommendations to help users make mindful eating choices that complement their emotional well-being.

## Introduction

Mood Snacks is a mobile application built with React Native and Expo that helps users:
- Track their daily moods and emotional states
- Record the intensity of their emotions
- Get personalized snack recommendations based on their current mood
- Manage a customizable list of mood-appropriate snacks
- View their mood history and patterns

## Features

### 1. Mood Tracking
- Record daily moods with emoji representations
- Add notes to mood entries
- Set mood intensity levels
- Track mood patterns over time

### 2. Smart Snack Recommendations
- Get personalized snack suggestions based on current mood
- View detailed snack descriptions
- Customize snack-mood associations

### 3. User Interface
- Dark/Light mode support
- Intuitive and responsive design
- Haptic feedback for enhanced user experience
- Smooth animations and transitions

### 4. Data Management
- Local storage for mood and snack data
- Persistent user preferences
- Secure data handling

## Technical Stack

- **Framework**: React Native with Expo
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **UI Components**: Custom components with native elements
- **Styling**: React Native StyleSheet
- **Navigation**: Expo Router

## Prerequisites

Before running the app, ensure you have the following installed:
- Node.js (LTS version 18.x or 20.x)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lakssy/mood-snacks-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mood-snacks-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npx expo start
   ```

## Project Structure

```
my-app/
├── app/                 # Main application screens
├── components/         # Reusable UI components
├── constants/         # App-wide constants
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── assets/           # Images, fonts, and other static files
```

## Key Components

### 1. Mood Management
- `MoodTracker`: Core component for recording moods
- `MoodHistory`: Displays historical mood data
- `MoodIntensity`: Allows users to set mood intensity levels

### 2. Snack Features
- `SnackRecommendation`: Suggests snacks based on mood
- `SnackManager`: Interface for managing snack entries
- `SnackList`: Displays available snacks

### 3. UI Components
- `ThemedView`: Context-aware themed container
- `ThemedText`: Context-aware themed text
- `HapticTab`: Touch-responsive tab with haptic feedback

## Configuration

The app can be configured through various environment variables and settings:
- Dark/Light mode preferences
- Default snack recommendations
- Mood tracking intervals
- Data persistence options

## Contributing

We welcome contributions to the Mood Snacks app! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation

## Future Enhancements

1. **Analytics Dashboard**
   - Detailed mood tracking analytics
   - Snack consumption patterns
   - Correlation analysis

2. **Social Features**
   - Share mood journals
   - Community snack recommendations
   - Friend system

3. **Advanced Personalization**
   - Machine learning-based recommendations
   - Custom mood categories
   - Dietary preference integration

## Acknowledgments

- React Native community
- Expo team
- All contributors and testers

---

Built with ❤️ by [lakssy](https://github.com/lakssy)
