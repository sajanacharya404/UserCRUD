$(document).ready(function () {
  $("#showRegisterForm").click(function (event) {
    event.preventDefault();
    $("#loginFormContainer").hide();
    $("#registerFormContainer").show();
  });

  $("#showLoginForm").click(function (event) {
    event.preventDefault();
    $("#registerFormContainer").hide();
    $("#loginFormContainer").show();
  });

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/users")
      .then((response) => {
        const users = response.data;
        const tableBody = $("#userTableBody");
        tableBody.empty(); // Clear existing table rows
        users.forEach((user) => {
          const row = `<tr data-user-id="${user._id}">
                         <td>${user.name}</td>
                         <td>${user.email}</td>
                         <td>
                           <button class="btn btn-primary btn-edit">Edit</button>
                           <button class="btn btn-danger btn-delete">Delete</button>
                         </td>
                       </tr>`;
          tableBody.append(row);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  // Initial fetch to load users when the page loads
  fetchUsers();

  // Function to handle edit user modal
  $("#userList").on("click", ".btn-edit", function () {
    const userId = $(this).closest("tr").data("user-id");
    axios
      .get(`http://localhost:3000/api/users/${userId}`)
      .then((response) => {
        const user = response.data;
        $("#editUserModal").modal("show");
        $("#editUserModal .modal-title").text("Edit User");
        const modalBody = $("#editUserModal .modal-body");
        modalBody.empty();
        const form = `<form id="editUserForm">
                        <div class="form-group">
                          <label for="editName">Name:</label>
                          <input type="text" class="form-control" id="editName" value="${user.name}" required>
                        </div>
                        <div class="form-group">
                          <label for="editEmail">Email:</label>
                          <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
                        </div>
                      </form>`;
        modalBody.append(form);
        const saveChangesBtn = $("#saveChangesBtn");
        saveChangesBtn.off("click").on("click", function () {
          const updatedName = $("#editName").val();
          const updatedEmail = $("#editEmail").val();
          const updatedUser = { name: updatedName, email: updatedEmail };
          axios
            .put(`http://localhost:3000/api/users/${userId}`, updatedUser)
            .then(() => {
              $("#editUserModal").modal("hide");
              fetchUsers(); // Refresh user list after update
            })
            .catch((error) => {
              console.error("Error updating user:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  });

  // Function to handle delete user
  $("#userList").on("click", ".btn-delete", function () {
    const userId = $(this).closest("tr").data("user-id");
    if (confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:3000/api/users/${userId}`)
        .then(() => {
          fetchUsers(); // Refresh user list after delete
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  });

  // Login functionality
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();
    axios
      .post("http://localhost:3000/api/login", { email, password })
      .then(() => {
        $("#loginFormContainer").hide(); // Hide login form
        $("#userList").show(); // Show user list
        fetchUsers(); // Fetch users after successful login
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Display login error message to the user
      });
  });

  // Logout functionality
  $("#logoutBtn").click(function () {
    axios
      .post("http://localhost:3000/api/logout")
      .then(() => {
        $("#loginFormContainer").show(); // Show login form
        $("#userList").hide(); // Hide user list
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Display logout error message to the user
      });
  });

  $("#registerForm").submit(function (event) {
    event.preventDefault();
    const name = $("#registerName").val();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();
    axios
      .post("http://localhost:3000/api/register", { name, email, password })
      .then(() => {
        $("#registerFormContainer").hide(); // Hide registration form
        $("#userList").show(); // Show user list
        fetchUsers(); // Fetch users after successful registration
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        // Display registration error message to the user
      });
  });
});
s;
