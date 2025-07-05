/**
 * Validator is a utility class that provides static methods
 * for validating user input such as integers and strings.
 */
class Validator {
    /**
     * Checks if the given value is a non-negative integer.
     *
     * @param {number} number - The value to check.
     * @returns {boolean} Returns true if the value is a non-negative integer, otherwise false.
     */
    static checkInt(number) {
        if (isNaN(number)) {
            return false;
        }
        if (number % 1 !== 0) {
            return false;
        }
        if (number < 0) {
            return false;
        }
        return true;
    }

    /**
     * Checks if the provided value is a non-empty string.
     *
     * @param {any} str - The value to check.
     * @returns {boolean} Returns true if the value is a non-empty string, otherwise false.
     */
    static checkString(str) {
        if (typeof str !== 'string') {
            return false;
        }
        if (str.trim() === "") {
            return false;
        }
        return true;
    }
}

const API_URL = 'http://localhost:3000/users';
let users = [];
let currentEditingId = null;
let userToDeleteId = null;

// DOM Elements
const usersContainer = document.getElementById('users-container');
const loadingContainer = document.getElementById('loading-container');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const genderFilter = document.getElementById('gender-filter');
const userForm = document.getElementById('user-form');
const modalTitle = document.getElementById('modal-title');
const saveUserBtn = document.getElementById('save-user-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const refreshBtn = document.getElementById('refresh-btn');

// Stats
const totalUsersEl = document.getElementById('total-users');
const activeUsersEl = document.getElementById('active-users');
const maleUsersEl = document.getElementById('male-users');
const femaleUsersEl = document.getElementById('female-users');

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    initializeEventListeners();
});

/**
 * Initializes all necessary event listeners for user interactions on the page.
 * 
 * - Sets up input and change listeners for search, status, and gender filters to trigger user filtering.
 * - Adds click listeners for saving a user, confirming deletion, and refreshing the user list.
 * - Handles form submission to save user data without reloading the page.
 * - Listens for clicks on elements with the 'modal-close' class to reset the form.
 */
function initializeEventListeners() {
    searchInput.addEventListener('input', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
    genderFilter.addEventListener('change', filterUsers);
    
    saveUserBtn.addEventListener('click', handleSaveUser);
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    refreshBtn.addEventListener('click', loadUsers);
    
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSaveUser();
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            resetForm();
        }
    });
}

/**
 * Handles the save user operation (create or update).
 * Validates the form, collects user data, and makes API calls to create or update users.
 * Displays loading states, success/error messages, and refreshes the UI.
 *
 * @async
 * @function handleSaveUser
 * @returns {Promise<void>} Resolves when the save operation is complete.
 */
async function handleSaveUser() {
    if (!validateForm()) return;
    
    const userData = {
        first_name: document.getElementById('first-name').value.trim(),
        last_name: document.getElementById('last-name').value.trim(),
        gender: document.getElementById('gender').value,
        balance: parseFloat(document.getElementById('balance').value),
        isActive: document.getElementById('is-active').checked
    };
    
    try {
        showLoading(true);
        
        if (currentEditingId) {
            // Update
            await updateUser(currentEditingId, userData);
            showToast('User updated successfully!', 'success');
        } else {
            // Create
            await createUser(userData);
            showToast('User created successfully!', 'success');
        }
        
        // Close modal and refresh
        M.Modal.getInstance(document.getElementById('add-user-modal')).close();
        resetForm();
        loadUsers();
        
    } catch (error) {
        console.error('Error saving user:', error);
        showToast('Error saving user. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Creates a new user by sending a POST request to the API.
 *
 * @async
 * @function createUser
 * @param {Object} userData - The user data to be created.
 * @param {string} userData.first_name - The user's first name.
 * @param {string} userData.last_name - The user's last name.
 * @param {string} userData.gender - The user's gender.
 * @param {number} userData.balance - The user's balance.
 * @param {boolean} userData.isActive - The user's active status.
 * @returns {Promise<Object>} The created user object from the API response.
 * @throws {Error} Throws an error if the API request fails.
 */
async function createUser(userData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create user');
    }
    
    return response.json();
}

/**
 * Loads all users from the API and updates the UI.
 * Displays loading state, handles errors, and updates statistics.
 *
 * @async
 * @function loadUsers
 * @returns {Promise<void>} Resolves when users are loaded and UI is updated.
 */
async function loadUsers() {
    try {
        showLoading(true);
        
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        users = await response.json();
        showUsers(users);
        updateStats();
        
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('Error loading users. Please check if the server is running.', 'error');
        showEmptyState();
    } finally {
        showLoading(false);
    }
}

/**
 * Updates an existing user by sending a PUT request to the API.
 *
 * @async
 * @function updateUser
 * @param {number|string} id - The unique identifier of the user to update.
 * @param {Object} userData - The updated user data.
 * @param {string} userData.first_name - The user's first name.
 * @param {string} userData.last_name - The user's last name.
 * @param {string} userData.gender - The user's gender.
 * @param {number} userData.balance - The user's balance.
 * @param {boolean} userData.isActive - The user's active status.
 * @returns {Promise<Object>} The updated user object from the API response.
 * @throws {Error} Throws an error if the API request fails.
 */
async function updateUser(id, userData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...userData, id})
    });
    
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    
    return response.json();
}

/**
 * Deletes a user by sending a DELETE request to the API.
 *
 * @async
 * @function deleteUserById
 * @param {number|string} id - The unique identifier of the user to delete.
 * @returns {Promise<Object>} The response from the API after deletion.
 * @throws {Error} Throws an error if the API request fails.
 */
async function deleteUserById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
    
    return response.json();
}

/**
 * Opens the user edit modal and populates the form fields with the selected user's data.
 *
 * @param {number|string} id - The unique identifier of the user to edit.
 */
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    currentEditingId = id;
    
    document.getElementById('first-name').value = user.first_name;
    document.getElementById('last-name').value = user.last_name;
    document.getElementById('gender').value = user.gender;
    document.getElementById('balance').value = user.balance;
    document.getElementById('is-active').checked = user.isActive;
    
    modalTitle.textContent = 'Edit User';
    
    M.FormSelect.init(document.querySelectorAll('select'));
    M.updateTextFields();
    
    M.Modal.getInstance(document.getElementById('add-user-modal')).open();
}

/**
 * Opens a confirmation modal to delete a user by their ID.
 * Sets the global variable `userToDeleteId` to the specified ID,
 * finds the user in the `users` array, and updates the modal's
 * message with the user's name before opening the modal.
 *
 * @param {number|string} id - The unique identifier of the user to delete.
 */
function deleteUserToast(id) {
    userToDeleteId = id;
    const user = users.find(u => u.id === id);
    
    if (user) {
        const modal = document.getElementById('delete-modal');
        modal.querySelector('p').textContent = 
            `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`;
        M.Modal.getInstance(modal).open();
    }
}

/**
 * Handles the confirmation and process of deleting a user.
 * Shows a loading indicator, attempts to delete the user by ID,
 * displays a toast notification based on the result, closes the modal,
 * reloads the user list, and resets the deletion state.
 *
 * @async
 * @function handleConfirmDelete
 * @returns {Promise<void>} Resolves when the deletion process is complete.
 */
async function handleConfirmDelete() {
    if (!userToDeleteId) return;
    
    try {
        showLoading(true);
        await deleteUserById(userToDeleteId);
        showToast('User deleted successfully!', 'success');
        
        M.Modal.getInstance(document.getElementById('delete-modal')).close();
        loadUsers();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Error deleting user. Please try again.', 'error');
    } finally {
        showLoading(false);
        userToDeleteId = null;
    }
}

/**
 * Renders a list of user cards in the users container.
 * If the provided array is empty, displays an empty state instead.
 *
 * @param {Array<Object>} usersToRender - Array of user objects to be rendered as cards.
 */
function showUsers(usersToRender) {
    if (usersToRender.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    usersContainer.innerHTML = usersToRender.map(user => createUserCard(user)).join('');
}

/**
 * Filters and displays users based on search term, status, and gender criteria.
 * Applies multiple filters simultaneously and updates the UI with filtered results.
 *
 * @function filterUsers
 * @returns {void}
 */
function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const genderValue = genderFilter.value;
    
    let filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.first_name.toLowerCase().includes(searchTerm) ||
            user.last_name.toLowerCase().includes(searchTerm) ||
            user.id.toString().includes(searchTerm);
        
        const matchesStatus = 
            statusValue === '' || 
            (statusValue === 'active' && user.isActive) ||
            (statusValue === 'inactive' && !user.isActive);
        
        const matchesGender = 
            genderValue === '' || user.gender === genderValue;
        
        return matchesSearch && matchesStatus && matchesGender;
    });
    
    showUsers(filteredUsers);
}

/**
 * Updates the user statistics displayed on the page, including total users,
 * active users, male users, and female users. Assumes the existence of a global
 * `users` array and DOM elements: `totalUsersEl`, `activeUsersEl`, `maleUsersEl`, and `femaleUsersEl`.
 */
function updateStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const maleUsers = users.filter(user => user.gender === 'male').length;
    const femaleUsers = users.filter(user => user.gender === 'female').length;
    
    totalUsersEl.textContent = totalUsers;
    activeUsersEl.textContent = activeUsers;
    maleUsersEl.textContent = maleUsers;
    femaleUsersEl.textContent = femaleUsers;
}

/**
 * Validates the user input fields in a form.
 * Checks if the first name, last name, and gender are valid strings,
 * and if the balance is a valid positive integer.
 * Displays a toast message and returns false if any validation fails.
 *
 * @returns {boolean} Returns true if all fields are valid, otherwise false.
 */
function validateForm() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const gender = document.getElementById('gender').value;
    const balance = parseFloat(document.getElementById('balance').value);
    
    if (!Validator.checkString(firstName)) {
        showToast('Please enter a valid first name', 'error');
        return false;
    }
    
    if (!Validator.checkString(lastName)) {
        showToast('Please enter a valid last name', 'error');
        return false;
    }
    
    if (!Validator.checkString(gender)) {
        showToast('Please select a gender', 'error');
        return false;
    }
    
    if (!Validator.checkInt(balance)) {
        showToast('Please enter a valid positive balance (whole number)', 'error');
        return false;
    }
    
    return true;
}

/**
 * Resets the user form to its default state.
 * - Clears all form fields.
 * - Sets the current editing ID to null.
 * - Updates the modal title to "Add New User".
 * - Checks the "is-active" checkbox by default.
 * - Refreshes Materialize text fields for proper label display.
 */
function resetForm() {
    userForm.reset();
    currentEditingId = null;
    modalTitle.textContent = 'Add New User';
    document.getElementById('is-active').checked = true;
    M.updateTextFields();
}

/**
 * Shows or hides the loading container element.
 *
 * @param {boolean} show - If true, displays the loading container; if false, hides it.
 */
function showLoading(show) {
    loadingContainer.style.display = show ? 'block' : 'none';
}

/**
 * Displays the empty state by making the emptyState element visible
 * and clearing all content from the usersContainer element.
 *
 * @function
 * @returns {void}
 */
function showEmptyState() {
    emptyState.style.display = 'block';
    usersContainer.innerHTML = '';
}

/**
 * Hides the empty state element by setting its display style to 'none'.
 * Assumes that `emptyState` is a reference to a DOM element.
 */
function hideEmptyState() {
    emptyState.style.display = 'none';
}
