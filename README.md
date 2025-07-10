# User Management CRUD Application

A user management system built with **Materialize CSS** and **JavaScript**. This application provides CRUD (Create, Read, Update, Delete) operations for managing user data with a Material Design interface.

## 🌟 Features

### ✅ **Core Functionality**
- **Create Users**: Add new users with form validation
- **Read Users**: Display users in card layouts
- **Update Users**: Edit existing user information
- **Delete Users**: Remove users with confirmation dialogs

### 🎨 **User Interface**
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Material Design**: UI with Materialize CSS framework
- **Interactive Elements**: Modals, tooltips, dropdowns, and animations
- **Loading States**: Visual feedback during operations
- **Toast Notifications**: Success and error messages

### 🔍 **Advanced Features**
- **Real-time Search**: Search users by name or ID
- **Filtering**: Filter by status (active/inactive) and gender
- **Statistics Dashboard**: Live counters for user demographics
- **Form Validation**: Client-side validation with custom Validator class
- **Error Handling**: Robust error handling for API failures

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Materialize CSS
- **Icons**: Material Icons
- **Backend**: JSON Server (for development)
- **API**: RESTful API with fetch()

## 📁 Project Structure

```
├── pages/
│   └── index.html          # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom CSS styles
│   └── js/
│       ├── main.js         # Main application logic (CRUD operations)
│       └── ui.js           # UI initialization and helper functions
├── server/
│   └── db.json            # JSON Server database
├── package.json           # Project dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd your-project-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server**
   ```bash
   npx json-server --watch server/db.json --port 3000
   ```

4. **Open the application**
   - Open `pages/index.html` in your web browser
   - Or use a local server like Live Server extension in VS Code

### API Endpoints

The application uses JSON Server which provides the following endpoints:

```
GET    /users       # Get all users
POST   /users       # Create a new user
GET    /users/:id   # Get a specific user
PUT    /users/:id   # Update a user
DELETE /users/:id   # Delete a user
```

## 🎯 Usage Guide

### Adding a New User
1. Click the floating **"+"** button
2. Fill out the form with user details:
   - First Name (required)
   - Last Name (required)
   - Gender (required)
   - Balance (required, must be a positive integer)
   - Active status (checkbox)
3. Click **"Save"** to create the user

### Editing a User
1. Click the **"Edit"** button on any user card
2. Modify the user information in the form
3. Click **"Save"** to update the user

### Deleting a User
1. Click the **"Delete"** button on any user card
2. Confirm the deletion in the modal dialog
3. The user will be permanently removed

### Searching and Filtering
- **Search**: Type in the search box to find users by name or ID
- **Status Filter**: Filter by active/inactive users
- **Gender Filter**: Filter by male/female users
- **Combined Filters**: Use multiple filters simultaneously

## 🏗️ Architecture

### File Organization

#### `main.js` - Core Application Logic
- **CRUD Operations**: Create, read, update, delete functions
- **API Communication**: Fetch requests to JSON Server
- **Event Handling**: User interactions and form submissions
- **Data Management**: User array and state management
- **Validation**: Form validation using Validator class

#### `ui.js` - User Interface Layer
- **Component Initialization**: Materialize CSS setup
- **Template Generation**: User card HTML creation
- **Notification System**: Toast messages for user feedback
- **UI State Management**: Loading, empty states

#### `styles.css` - Custom Styling
- **Layout Styles**: Custom spacing and positioning
- **Interactive Effects**: Hover animations and transitions
- **Responsive Design**: Mobile-friendly adjustments
- **Theme Customization**: Color schemes and branding

### Design Patterns

- **Separation of Concerns**: Logic, UI, and styles are separated
- **Modular Architecture**: Functions are organized by responsibility
- **Event-Driven Programming**: User interactions trigger appropriate functions
- **Error Handling**: Try-catch blocks and user-friendly error messages

## 🔧 API Configuration

### Default Configuration
```javascript
const API_URL = 'http://localhost:3000/users';
```

### Changing the API Endpoint
To use a different backend, modify the `API_URL` constant in `main.js`:

```javascript
// For production
const API_URL = 'https://your-api.com/users';

// For different local port
const API_URL = 'http://localhost:8080/users';
```

## ✅ Form Validation

The application includes a custom `Validator` class with the following methods:

### `Validator.checkString(str)`
- Validates that input is a non-empty string
- Trims whitespace before validation
- Returns `true` for valid strings, `false` otherwise

### `Validator.checkInt(number)`
- Validates that input is a non-negative integer
- Checks for NaN, decimal numbers, and negative values
- Returns `true` for valid integers, `false` otherwise

### Validation Rules
- **First Name**: Must be a non-empty string
- **Last Name**: Must be a non-empty string
- **Gender**: Must be selected from dropdown
- **Balance**: Must be a positive integer (whole number)

## 🎨 Customization

### Changing Colors
Edit the color variables in `styles.css`:
```css
:root {
  --primary-color: #26a69a;
  --secondary-color: #ffab40;
  --success-color: #4caf50;
  --error-color: #f44336;
}
```

### Adding New Fields
1. Add the field to the HTML form in `index.html`
2. Update the `userData` object in `handleSaveUser()`
3. Add validation rules in `validateForm()`
4. Update the user card template in `ui.js`

### Modifying the Layout
- Edit grid classes in `index.html` for responsive behavior
- Adjust spacing and sizing in `styles.css`
- Customize Materialize components as needed

## 🐛 Troubleshooting

### Common Issues

**Users not loading**
- Check if JSON Server is running on port 3000
- Verify the API_URL is correct
- Check browser console for network errors

**Modals not opening**
- Ensure Materialize JavaScript is loaded
- Check that modal initialization is working
- Verify modal HTML structure

**Form validation not working**
- Check that Validator class is properly defined
- Verify form field IDs match the JavaScript selectors
- Ensure validation functions are called before submission

**Styling issues**
- Verify Materialize CSS is loaded
- Check for CSS conflicts
- Ensure custom styles are loaded after Materialize
