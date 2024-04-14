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
        tableBody.empty();
        users.forEach((user) => {
          const row = `<tr data-user-id="${user._id}">
                         <td>${user.name}</td>
                         <td>${user.email}</td>
                         <td>
                           <button class="btn btn-primary btn-edit" data-user-id="${user._id}">Edit</button>
                           <button class="btn btn-danger btn-delete" data-user-id="${user._id}">Delete</button>
                         </td>
                       </tr>`;
          tableBody.append(row);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const token = localStorage.getItem("token");
  if (token) {
    $("#loginFormContainer").hide();
    $("#userList").show();
    fetchUsers();
  } else {
    $("#loginFormContainer").show();
    $("#userList").hide();
  }

  $("#userList").on("click", ".btn-edit", function () {
    const userId = $(this).closest("tr").data("user-id");
    axios
      .get(`http://localhost:3000/api/users/${userId}`)
      .then((response) => {
        const user = response.data;
        $("#editUserModal").modal("show");
        $("#editUserModal .modal-title").text("Edit User");
        $("#editUserId").val(user._id);
        $("#editName").val(user.name);
        $("#editEmail").val(user.email);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  });

  $("#saveChangesBtn").click(function () {
    const userId = $("#editUserId").val();
    const updatedName = $("#editName").val();
    const updatedEmail = $("#editEmail").val();
    const updatedPassword = $("#editPassword").val();
    const updatedUser = { name: updatedName, email: updatedEmail };

    if (updatedPassword) {
      updatedUser.password = updatedPassword;
    }

    axios
      .put(`http://localhost:3000/api/users/${userId}`, updatedUser)
      .then(() => {
        $("#editUserModal").modal("hide");
        fetchUsers();
        $("#successMessage").text("User details updated successfully.").show();
        setTimeout(() => {
          $("#successMessage").hide();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        $("#errorMessage")
          .text("Failed to update user details. Please try again.")
          .show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 2000);
      });
  });

  $("#userList").on("click", ".btn-delete", function () {
    const userId = $(this).data("user-id");
    if (confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:3000/api/users/${userId}`)
        .then(() => {
          fetchUsers(); // Refresh user list after delete
          $("#successMessage").text("User deleted successfully.").show();
          setTimeout(() => {
            $("#successMessage").hide();
          }, 1000);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          $("#errorMessage")
            .text("Failed to delete user. Please try again.")
            .show();
          setTimeout(() => {
            $("#errorMessage").hide();
          }, 2000);
        });
    }
  });

  $("#loginForm").submit(async function (event) {
    event.preventDefault();
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      $("#loginFormContainer").hide();
      $("#userList").show();
      await fetchUsers();
      $("#successMessage").text("Login successful!").show();
      setTimeout(() => {
        $("#successMessage").hide();
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      $("#errorMessage")
        .text("Login failed. Please check your credentials.")
        .show();
      setTimeout(() => {
        $("#errorMessage").hide();
      }, 2000);
    }
  });

  $("#logoutBtn").click(function () {
    localStorage.removeItem("token");
    axios
      .post("http://localhost:3000/api/logout")
      .then(() => {
        $("#loginFormContainer").show();
        $("#userList").hide();
        $("#successMessage").text("Logout successful.").show();
        setTimeout(() => {
          $("#successMessage").hide();
        }, 1000);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        $("#errorMessage").text("Logout failed. Please try again.").show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 2000);
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
        $("#registerFormContainer").hide();
        $("#loginFormContainer").show();
        $("#successMessage")
          .text("Registration successful. Please login.")
          .show();
        setTimeout(() => {
          $("#successMessage").hide();
        }, 1000);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        $("#errorMessage")
          .text("Registration failed. Please try again.")
          .show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 2000);
      });
  });

  $("#resetPasswordForm").submit(function (event) {
    event.preventDefault();
    const email = $("#resetEmail").val();
    const newPassword = $("#resetPassword").val();
    axios
      .post("http://localhost:3000/api/reset-password", { email, newPassword })
      .then(() => {
        alert("Password reset successful");
      })
      .catch((error) => {
        console.error("Password reset failed:", error);
        $("#errorMessage")
          .text("Password reset failed. Please try again.")
          .show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 2000);
      });
  });
});
