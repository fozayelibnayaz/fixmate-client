import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { apiFetch, patch, post } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "ready";
}

const initialState: AuthState = { user: null, status: "idle" };

export const loadSession = createAsyncThunk<User | null>("auth/load", async () => {
  try {
    const result = await apiFetch<{ user: User }>("/api/session/me");
    return result.user;
  } catch {
    return null;
  }
});

export const signIn = createAsyncThunk<User, { email: string; password: string }>(
  "auth/signin",
  async (values) => (await post<{ user: User }>("/api/session/signin", values)).user,
);

export const signUp = createAsyncThunk<
  User,
  { name: string; email: string; password: string; role: "customer" | "technician" }
>("auth/signup", async (values) => (await post<{ user: User }>("/api/session/signup", values)).user);

export const signOut = createAsyncThunk<void, void>("auth/signout", async () => {
  await post("/api/session/signout", {});
});

export const saveProfile = createAsyncThunk<User, Record<string, unknown>>(
  "auth/profile",
  async (values) => (await patch<{ user: User }>("/api/users/profile", values)).user,
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    const success = (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "ready";
    };
    builder
      .addCase(loadSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "ready";
      })
      .addCase(signIn.fulfilled, success)
      .addCase(signUp.fulfilled, success)
      .addCase(saveProfile.fulfilled, success)
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.status = "ready";
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
