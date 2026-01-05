# Campus Placement Management System

A comprehensive React Native mobile application for managing campus placements with support for three user roles: Students, Recruiters, and Admins.

## Features

### Student Features
- Browse approved job postings
- Apply for jobs with eligibility check
- Track application status
- Upload and manage resume
- View and accept job offers
- Complete profile management

### Recruiter Features
- Create and manage company profile
- Post job openings
- Review student applications
- Shortlist candidates
- Schedule interviews
- Upload offer letters

### Admin Features
- Dashboard with placement statistics
- Manage users (view, edit roles, delete)
- Approve job postings
- Monitor placement activities

## Tech Stack

- **Framework:** React Native 0.83
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **UI Library:** React Native Paper (Material Design)
- **Icons:** React Native Vector Icons
- **Forms:** React Native Element Dropdown, DateTimePicker
- **API:** Axios with interceptors
- **Storage:** AsyncStorage
- **State Management:** Context API

## Project Structure

```
src/
├── navigation/         # Navigation configuration
├── screens/           # All app screens
├── components/        # Reusable components
├── services/          # API services
├── context/           # React context (Auth)
├── utils/             # Utilities and helpers
└── theme/             # Theme configuration
```

## Installation

```bash
# Install dependencies
npm install

# iOS only
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## API Configuration

Base URL: `http://app.undefineddevelopers.online/placement/api`

Update in `src/utils/constants.ts` if needed.

## Development Status

### ✅ Completed
- Complete navigation architecture
- Authentication flow (Login, Signup)
- All API service layer
- Theme and styling system
- Reusable components
- AuthContext for state management

### 🚧 To Be Completed
- Full implementation of Student screens
- Full implementation of Recruiter screens
- Full implementation of Admin screens
- File upload UI for resume and offers
- Search and filter features
- Comprehensive testing

## Key Files

- `App.tsx` - Main app entry point
- `src/navigation/AppNavigator.tsx` - Root navigation with role-based routing
- `src/context/AuthContext.tsx` - Authentication state management
- `src/services/api.ts` - Axios configuration with interceptors
- `src/theme/theme.ts` - App theming

## Available Roles

- `STUDENT` - Access to job browsing and application features
- `RECRUITER` - Access to job posting and candidate management
- `ADMIN` - Access to user management and approval features

## Contributing

1. Implement remaining screen functionality
2. Add comprehensive form validation
3. Implement file upload features
4. Add unit and integration tests
5. Optimize performance

## License

Private project - All rights reserved
