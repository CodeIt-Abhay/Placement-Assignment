# CineVault
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://cinevault-f87d8.web.app/)

A premium streaming catalogue UI built with HTML, CSS, and vanilla JavaScript. It includes Firebase email/password authentication, a cinematic show catalogue powered by the TVMaze public API, offline cache support, and polished responsive interactions.

This project was created as part of a college placement assignment.

## Features

- Firebase login and signup flow with a browser-based demo fallback
- Cinematic featured-show hero section
- TV show gallery loaded from the TVMaze API
- Top-rated and recent show filters
- Search across titles, genres, and release years
- Infinite scrolling for browsing more shows
- Loading skeletons, empty states, and API error handling
- Local storage cache for offline browsing
- Responsive premium layout for desktop and mobile

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Firebase Authentication and Hosting
- TVMaze API

## Getting Started

### Prerequisites

- A browser such as Chrome, Edge, Firefox, or Safari
- Optional: a local static server such as VS Code Live Server
- Optional: a Firebase project for your own authentication backend

### Run Locally

Clone the repository and open `index.html` in your browser:

```bash
git clone https://github.com/CodeIt-Abhay/Placement-Assignment.git
cd Placement-Assignment/CineVault
```

For the best development experience, serve the folder with a local static server.

## Firebase Setup

The project includes a Firebase Web configuration in `js/auth.js`. If Firebase is not available or the deployed domain is not authorized, the app falls back to browser-based demo authentication using `localStorage` so the assignment can still be reviewed smoothly.

Firebase Web config values are public identifiers, not service account secrets, but you should still protect your Firebase project with proper authorized domains, authentication settings, and security rules.

To use your own Firebase project:

1. Create a Firebase project in the Firebase Console.
2. Enable Email/Password authentication.
3. Create a Web App in Firebase.
4. Replace the `firebaseConfig` object in `js/auth.js` with your own Web App config.
5. If deploying with Firebase Hosting, run `firebase init hosting` or create your own `.firebaserc` locally.

## Deployment

For Firebase Hosting, install the Firebase CLI and run:

```bash
firebase deploy --only hosting
```

For GitHub Pages, publish the repository and serve the `CineVault` folder that contains `index.html`.

## License

This project is licensed under the MIT License.
