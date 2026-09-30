// ===================================================================
// ABES ENGINEERING COLLEGE - CAMPUS HELP DESK
// Student Support Portal Frontend Logic (Vanilla JS)
// ===================================================================

// Global state variables
let requests = [];
let isEditing = false;
let currentEditId = null;
let deleteTargetId = null;

// DOM Elements
const form = document.getElementById('helpDeskForm');
const requestIdInput = document.getElementById('requestId');
const studentNameInput = document.getElementById('studentName');
const emailInput = document.getElementById('email');
const categorySelect = document.getElementById('category');
const prioritySelect = document.getElementById('priority');
const descriptionInput = document.getElementById('description');

// Buttons & Indicators
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitSpinner = document.getElementById('submitSpinner');
const resetBtn = document.getElementById('resetBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const cancelEditBtnTop = document.getElementById('cancelEditBtnTop');
const editModeIndicator = document.getElementById('editModeIndicator');
const editingIdBadge = document.getElementById('editingIdBadge');
const formSectionTitle = document.getElementById('formSectionTitle');

// Statistics Counters
const headerTotalCount = document.getElementById('headerTotalCount');
const statTotal = document.getElementById('statTotal');
const statHigh = document.getElementById('statHigh');
const statMedium = document.getElementById('statMedium');
const statLow = document.getElementById('statLow');

// List & State Containers
const requestsList = document.getElementById('requestsList');
const requestsLoading = document.getElementById('requestsLoading');
const emptyState = document.getElementById('emptyState');
const filterPriority = document.getElementById('filterPriority');
const searchInput = document.getElementById('searchInput');

// Delete Modal Elements
const deleteModal = document.getElementById('deleteModal');
const deleteTargetIdSpan = document.getElementById('deleteTargetId');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Theme Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

// Toast Notification
const toastNotification = document.getElementById('toastNotification');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
let toastTimeout = null;

// ===================================================================
// 1. TOAST NOTIFICATIONS & FEEDBACK
// ===================================================================

const showToast = (title, message, isError = false) => {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  if (isError) {
    toastNotification.classList.add('toast-error');
  } else {
    toastNotification.classList.remove('toast-error');
  }

  toastNotification.classList.remove('hidden');

  toastTimeout = setTimeout(() => {
    toastNotification.classList.add('hidden');
  }, 3500);
};

// ===================================================================
// 2. THEME CONTROLLER (DARK & LIGHT MODE)
// ===================================================================

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('campusDeskTheme', theme);

  if (theme === 'light') {
    themeIcon.textContent = '🌙';
    themeLabel.textContent = 'Dark';
  } else {
    themeIcon.textContent = '☀️';
    themeLabel.textContent = 'Light';
  }
};

const initTheme = () => {
  const savedTheme = localStorage.getItem('campusDeskTheme') || 'dark';
  applyTheme(savedTheme);
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
};

// ===================================================================
// 3. STATISTICS CALCULATOR
// ===================================================================

const updateStatistics = (items) => {
  const total = items.length;
  const high = items.filter((r) => r.priority === 'High').length;
  const medium = items.filter((r) => r.priority === 'Medium').length;
  const low = items.filter((r) => r.priority === 'Low').length;

  // Animate counter values
  headerTotalCount.textContent = total;
  statTotal.textContent = total;
  statHigh.textContent = high;
  statMedium.textContent = medium;
  statLow.textContent = low;
};

// ===================================================================
// 4. API CALLS (CRUD WITH FETCH)
// ===================================================================

// READ: Fetch all requests from backend Express API
const loadRequests = async () => {
  requestsLoading.classList.remove('hidden');
  requestsList.classList.add('hidden');
  emptyState.classList.add('hidden');

  try {
    const response = await fetch('/api/requests');
    if (!response.ok) {
      throw new Error(`Failed to load requests (${response.status})`);
    }
    requests = await response.json();
    updateStatistics(requests);
    renderRequests();
  } catch (error) {
    console.error('Error fetching requests:', error);
    showToast('Network Error', error.message, true);
    emptyState.classList.remove('hidden');
  } finally {
    requestsLoading.classList.add('hidden');
    requestsList.classList.remove('hidden');
  }
};

// CREATE & UPDATE: Submit or update a request
const handleFormSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const payload = {
    studentName: studentNameInput.value.trim(),
    email: emailInput.value.trim(),
    category: categorySelect.value,
    priority: prioritySelect.value,
    description: descriptionInput.value.trim()
  };

  // Button loading state
  submitBtn.disabled = true;
  submitSpinner.classList.remove('hidden');
  submitBtnText.textContent = isEditing ? 'Updating...' : 'Submitting...';

  try {
    let url = '/api/requests';
    let method = 'POST';

    if (isEditing && currentEditId) {
      url = `/api/requests/${currentEditId}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Operation failed on server');
    }

    showToast(isEditing ? 'Updated Successfully' : 'Submitted Successfully', data.message);

    resetForm();
    await loadRequests();
  } catch (error) {
    console.error('Error saving request:', error);
    showToast('Error', error.message, true);
  } finally {
    submitBtn.disabled = false;
    submitSpinner.classList.add('hidden');
    submitBtnText.textContent = isEditing ? 'Update Request' : 'Submit Request';
  }
};

// DELETE: Delete request by ID
const executeDelete = async (id) => {
  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete request');
    }

    showToast('Deleted', data.message);

    // If currently editing this item, cancel edit
    if (isEditing && currentEditId === id) {
      resetForm();
    }

    closeDeleteModal();
    await loadRequests();
  } catch (error) {
    console.error('Error deleting request:', error);
    showToast('Delete Error', error.message, true);
    closeDeleteModal();
  }
};

// ===================================================================
// 5. FORM VALIDATION & HELPERS
// ===================================================================

const clearErrors = () => {
  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('categoryError').textContent = '';
  document.getElementById('priorityError').textContent = '';
  document.getElementById('descriptionError').textContent = '';
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  const nameVal = studentNameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const catVal = categorySelect.value;
  const priVal = prioritySelect.value;
  const descVal = descriptionInput.value.trim();

  if (!nameVal) {
    document.getElementById('nameError').textContent = 'Please enter your full name.';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    document.getElementById('emailError').textContent = 'Email address is required.';
    isValid = false;
  } else if (!emailRegex.test(emailVal)) {
    document.getElementById('emailError').textContent = 'Please enter a valid email address.';
    isValid = false;
  }

  if (!catVal) {
    document.getElementById('categoryError').textContent = 'Please select a relevant category.';
    isValid = false;
  }

  if (!priVal) {
    document.getElementById('priorityError').textContent = 'Please select a priority level.';
    isValid = false;
  }

  if (!descVal) {
    document.getElementById('descriptionError').textContent = 'Please describe your problem or request.';
    isValid = false;
  } else if (descVal.length < 10) {
    document.getElementById('descriptionError').textContent = 'Description should be at least 10 characters long.';
    isValid = false;
  }

  return isValid;
};

// Populate form for editing
const startEdit = (id) => {
  const req = requests.find((r) => r.id === id);
  if (!req) return;

  isEditing = true;
  currentEditId = id;

  requestIdInput.value = req.id;
  studentNameInput.value = req.studentName;
  emailInput.value = req.email;
  categorySelect.value = req.category;
  prioritySelect.value = req.priority;
  descriptionInput.value = req.description;

  // UI state change
  formSectionTitle.textContent = 'EDIT CAMPUS REQUEST';
  submitBtnText.textContent = 'Update Request';
  cancelEditBtn.classList.remove('hidden');
  editModeIndicator.classList.remove('hidden');
  editingIdBadge.textContent = req.id;

  clearErrors();

  // Smooth scroll to form
  document.getElementById('requestFormSection').scrollIntoView({ behavior: 'smooth' });
};

// Reset form to default create state
const resetForm = () => {
  form.reset();
  requestIdInput.value = '';
  isEditing = false;
  currentEditId = null;

  formSectionTitle.textContent = 'SUBMIT NEW REQUEST';
  submitBtnText.textContent = 'Submit Request';
  cancelEditBtn.classList.add('hidden');
  editModeIndicator.classList.add('hidden');

  clearErrors();
};

// ===================================================================
// 6. DELETE MODAL HANDLERS
// ===================================================================

const openDeleteModal = (id) => {
  deleteTargetId = id;
  deleteTargetIdSpan.textContent = id;
  deleteModal.classList.remove('hidden');
};

const closeDeleteModal = () => {
  deleteTargetId = null;
  deleteModal.classList.add('hidden');
};

// ===================================================================
// 7. RENDER REQUESTS LIST
// ===================================================================

const getInitials = (name) => {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatDate = (isoString) => {
  if (!isoString) return 'Recently';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return 'Recently';
  }
};

const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'High':
      return 'badge-high';
    case 'Medium':
      return 'badge-medium';
    case 'Low':
      return 'badge-low';
    default:
      return 'badge-low';
  }
};

const renderRequests = () => {
  const selectedPriority = filterPriority.value;
  const searchKeyword = searchInput.value.trim().toLowerCase();

  // Filter requests
  let filtered = requests.filter((req) => {
    const matchPriority = selectedPriority === 'ALL' || req.priority === selectedPriority;
    const matchSearch =
      !searchKeyword ||
      req.id.toLowerCase().includes(searchKeyword) ||
      req.studentName.toLowerCase().includes(searchKeyword) ||
      req.email.toLowerCase().includes(searchKeyword) ||
      req.category.toLowerCase().includes(searchKeyword) ||
      req.description.toLowerCase().includes(searchKeyword);

    return matchPriority && matchSearch;
  });

  // Empty state handling
  if (filtered.length === 0) {
    requestsList.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // Build modern HTML cards
  requestsList.innerHTML = filtered
    .map((req) => {
      const initials = getInitials(req.studentName);
      const priorityClass = getPriorityBadgeClass(req.priority);
      const createdDate = formatDate(req.createdAt);

      return `
        <article class="request-card" data-id="${req.id}">
          <div>
            <div class="card-top">
              <span class="req-id-badge">${req.id}</span>
              <div class="card-badges">
                <span class="category-tag">${req.category}</span>
                <span class="priority-badge ${priorityClass}">
                  <span class="dot"></span>
                  ${req.priority}
                </span>
              </div>
            </div>

            <p class="card-description">${escapeHtml(req.description)}</p>
          </div>

          <div>
            <div class="card-student-info">
              <div class="student-avatar" title="${escapeHtml(req.studentName)}">${initials}</div>
              <div class="student-meta">
                <span class="student-name">${escapeHtml(req.studentName)}</span>
                <span class="student-email">${escapeHtml(req.email)}</span>
              </div>
            </div>

            <div class="card-actions">
              <span class="card-timestamp">Logged: ${createdDate}</span>
              <div class="btn-group-actions">
                <button 
                  type="button" 
                  class="btn-card-action btn-card-edit" 
                  data-action="edit" 
                  data-id="${req.id}"
                  title="Edit this request"
                >
                  Edit
                </button>
                <button 
                  type="button" 
                  class="btn-card-action btn-card-delete" 
                  data-action="delete" 
                  data-id="${req.id}"
                  title="Delete this request"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
};

// Helper: Escape HTML to prevent XSS
const escapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// ===================================================================
// 8. EVENT LISTENERS
// ===================================================================

const setupEventListeners = () => {
  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Form events
  form.addEventListener('submit', handleFormSubmit);
  resetBtn.addEventListener('click', resetForm);
  cancelEditBtn.addEventListener('click', resetForm);
  cancelEditBtnTop.addEventListener('click', resetForm);

  // Filter and search
  filterPriority.addEventListener('change', renderRequests);
  searchInput.addEventListener('input', renderRequests);

  // Delete modal actions
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', () => {
    if (deleteTargetId) {
      executeDelete(deleteTargetId);
    }
  });

  // Modal backdrop click to dismiss
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  // Event delegation on requests list for Edit and Delete buttons
  requestsList.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');

    if (action === 'edit') {
      startEdit(id);
    } else if (action === 'delete') {
      openDeleteModal(id);
    }
  });

  // Real-time input clearing for validation
  studentNameInput.addEventListener('input', () => {
    document.getElementById('nameError').textContent = '';
  });
  emailInput.addEventListener('input', () => {
    document.getElementById('emailError').textContent = '';
  });
  categorySelect.addEventListener('change', () => {
    document.getElementById('categoryError').textContent = '';
  });
  prioritySelect.addEventListener('change', () => {
    document.getElementById('priorityError').textContent = '';
  });
  descriptionInput.addEventListener('input', () => {
    document.getElementById('descriptionError').textContent = '';
  });
};

// ===================================================================
// 9. INITIALIZATION
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  loadRequests();
});
