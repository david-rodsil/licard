import { AuthBindings } from "@refinedev/core";
import axios from "axios";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthBindings = {
  login: async ({ access, password }) => {
    try {
      // Make API call to backend to login
      const response = await axios.post('https://mylicard.onrender.com/api/v1/usuarios/login', { access, password });

      // Check if login is successful
      if (response.data.success) {
        // Save user data in local storage
        localStorage.setItem(TOKEN_KEY, response.data.accessToken);
        // Save user collection data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Return success with redirect URL
        return {
          success: true,
          redirectTo: "/datos",
        };
      } else {
        // Handle unsuccessful login
        // Display error message or do other actions
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Invalid username or password",
          },
        };
      }
    } catch (error) {
      // Handle error in API call
      // Display error message or do other actions
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Error in server",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
