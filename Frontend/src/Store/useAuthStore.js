import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,  // Expected format: { name, email, role }
      token: null, // Optional if using cookies

      // ✅ login function
      login: (userData, tokenData) => {
        // userData should include a 'role' field, e.g. 'admin' or 'customer'
        set({ user: userData, token: tokenData });
      },

      // ✅ logout function
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // stored key in localStorage
    }
  )
);

export default useAuthStore;
