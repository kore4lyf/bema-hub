import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Country {
  name: { common: string }
  cca2: string
}

interface State {
  id: number
  name: string
}

interface LocationState {
  countries: Country[]
  states: State[]
  selectedCountry: string | null
  selectedCountryCode: string | null
  selectedState: string | null
  isLoadingCountries: boolean
  isLoadingStates: boolean
  error: string | null
}

const initialState: LocationState = {
  countries: [],
  states: [],
  selectedCountry: null,
  selectedCountryCode: null,
  selectedState: null,
  isLoadingCountries: false,
  isLoadingStates: false,
  error: null,
}

export const fetchCountries = createAsyncThunk(
  'location/fetchCountries',
  async () => {
    // Use free public REST Countries API
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
    
    if (!response.ok) {
      throw new Error('Failed to load countries')
    }
    
    const data = await response.json()
    return data.sort((a: Country, b: Country) => 
      a.name.common.localeCompare(b.name.common)
    )
  }
)

export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (country: string) => {
    // For now, return empty array since we're using RTK Query
    return []
  }
)

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedCountry: (state, action: PayloadAction<{ name: string; code: string }>) => {
      state.selectedCountry = action.payload.name
      state.selectedCountryCode = action.payload.code
      state.selectedState = null
      state.states = []
    },
    setSelectedState: (state, action: PayloadAction<string>) => {
      state.selectedState = action.payload
    },
    clearLocation: (state) => {
      state.selectedCountry = null
      state.selectedCountryCode = null
      state.selectedState = null
      state.states = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Countries
      .addCase(fetchCountries.pending, (state) => {
        state.isLoadingCountries = true
        state.error = null
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.isLoadingCountries = false
        state.countries = action.payload
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.isLoadingCountries = false
        state.error = action.error.message || 'Failed to load countries'
      })
      // Fetch States
      .addCase(fetchStates.pending, (state) => {
        state.isLoadingStates = true
        state.error = null
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.isLoadingStates = false
        state.states = action.payload
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.isLoadingStates = false
        state.error = action.error.message || 'Failed to load states'
      })
  },
})

export const { setSelectedCountry, setSelectedState, clearLocation, clearError } = locationSlice.actions
export default locationSlice.reducer
