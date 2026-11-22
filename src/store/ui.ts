import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
}

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false } as UiState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
