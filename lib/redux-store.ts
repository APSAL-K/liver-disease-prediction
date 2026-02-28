import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any,
    token: null as string | null,
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

// Predictions slice
const predictionsSlice = createSlice({
  name: 'predictions',
  initialState: {
    predictions: [] as any[],
    loading: false,
  },
  reducers: {
    setPredictions: (state, action: PayloadAction<any[]>) => {
      state.predictions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Appointments slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [] as any[],
    loading: false,
  },
  reducers: {
    setAppointments: (state, action: PayloadAction<any[]>) => {
      state.appointments = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Doctors slice
const doctorsSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [] as any[],
    loading: false,
  },
  reducers: {
    setDoctors: (state, action: PayloadAction<any[]>) => {
      state.doctors = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    predictions: predictionsSlice.reducer,
    appointments: appointmentsSlice.reducer,
    doctors: doctorsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const {
  setUser,
  setToken,
  logout,
} = authSlice.actions;

export const {
  setPredictions,
} = predictionsSlice.actions;

export const {
  setAppointments,
} = appointmentsSlice.actions;

export const {
  setDoctors,
} = doctorsSlice.actions;
