// Initialize Materialize components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modals
    M.Modal.init(document.querySelectorAll('.modal'));
    
    // Initialize select dropdowns
    M.FormSelect.init(document.querySelectorAll('select'));
    
    // Initialize floating action button tooltip
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    
    // Initialize character counter for inputs
    M.CharacterCounter.init(document.querySelectorAll('input[data-length]'));
    
    // Auto-resize textareas
    M.textareaAutoResize(document.querySelectorAll('textarea'));
    
    // Initialize sidenav for mobile
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
});

function createUserCard(user) {
    const statusClass = user.isActive ? 'active-status' : 'inactive-status';
    const statusText = user.isActive ? 'Active' : 'Inactive';
    const statusIcon = user.isActive ? 'check_circle' : 'cancel';
    const balanceClass = user.balance >= 0 ? 'balance-positive' : 'balance-negative';
    const genderColor = user.gender === 'male' ? 'blue' : 'pink';
    
    return `
        <div class="col s12 m6 l4">
            <div class="card user-card hoverable">
                <div class="card-content">
                    <div class="row">
                        <div class="col s12">
                            <h6 class="card-title">${user.first_name} ${user.last_name}</h6>
                            <p class="grey-text text-darken-1">ID: ${user.id}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12">
                            <div class="chip ${genderColor} white-text gender-chip">
                                <i class="material-icons">${user.gender === 'male' ? 'person' : 'person'}</i>
                                ${user.gender}
                            </div>
                            <div class="chip ${user.isActive ? 'green' : 'red'} white-text">
                                <i class="material-icons">${statusIcon}</i>
                                ${statusText}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12">
                            <p><strong>Balance:</strong> <span class="${balanceClass}">$${user.balance}</span></p>
                        </div>
                    </div>
                </div>
                <div class="card-action">
                    <a href="#!" class="btn-small waves-effect waves-light blue" onclick="editUser(${user.id})">
                        <i class="material-icons left">edit</i>Edit
                    </a>
                    <a href="#!" class="btn-small waves-effect waves-light red right" onclick="deleteUser(${user.id})">
                        <i class="material-icons left">delete</i>Delete
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Displays a toast notification using Materialize CSS.
 *
 * @param {string} message - The message to display in the toast.
 * @param {'success'|'error'|'info'} [type='success'] - The type of toast to display, which determines the icon and color.
 */
function showToast(message, type = 'success') {
    const color = type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue';
    M.toast({
        html: `<i class="material-icons left">${type === 'success' ? 'check' : type === 'error' ? 'error' : 'info'}</i>${message}`,
        classes: `${color} darken-2`,
        displayLength: 4000
    });
}
