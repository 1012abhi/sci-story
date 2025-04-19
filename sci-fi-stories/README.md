# Sci-Fi Stories Web Application

An interactive web application for exploring science fiction stories with gamification elements.

## Overview

This React application provides a platform for users to read and interact with science fiction stories in an engaging way. It features:

- Interactive story exploration with multiple learning modes
- Modern UI with gamified elements
- Story navigation with previous/next functionality
- Responsive design for various devices

## Features

### BrainyLingo Interface

The application uses a gamified interface with three learning modes:

1. **Word Explorer** - Interactive word-picture matching game
2. **Story Adventure** - Traditional story reading experience with tabbed interface
3. **Brain Quest** - Knowledge testing mode

### Story Navigation

Users can browse through stories with intuitive navigation:
- Previous/Next story buttons
- Home navigation 
- Genre filtering options

## Technology Stack

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- REST API integration for story data

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd sci-fi-stories
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The application connects to a remote API endpoint to fetch story data:
- API Base URL: `https://mxpertztestapi.onrender.com/api/sciencefiction`
- Story details: `https://mxpertztestapi.onrender.com/api/sciencefiction/:id`

## Project Structure

```
sci-fi-stories/
├── public/
├── src/
│   ├── components/
│   │   ├── TabsComponent.jsx     # Story content tabs
│   │   └── ...
│   ├── pages/
│   │   ├── StoryDetails.jsx      # Individual story view with game modes
│   │   └── ...
│   ├── App.js                    # Main application component
│   └── index.js                  # Entry point
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
