import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Country {
  name: { common: string }
  cca2: string
}

interface City {
  id: number
  name: string
}

interface LocationState {
  countries: Country[]
  cities: City[]
  selectedCountry: string | null
  selectedCountryCode: string | null
  selectedCity: string | null
  isLoadingCountries: boolean
  isLoadingCities: boolean
  error: string | null
}

const initialState: LocationState = {
  countries: [],
  cities: [],
  selectedCountry: null,
  selectedCountryCode: null,
  selectedCity: null,
  isLoadingCountries: false,
  isLoadingCities: false,
  error: null,
}

export const fetchCountries = createAsyncThunk(
  'location/fetchCountries',
  async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/countries`)
    
    if (!response.ok) {
      throw new Error('Failed to load countries')
    }
    
    const data = await response.json()
    return data.sort((a: Country, b: Country) => 
      a.name.common.localeCompare(b.name.common)
    )
  }
)

export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async (country: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/states`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to load states')
    }
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((cityName: string, index: number) => ({
        id: index + 1,
        name: cityName
      })).sort((a: City, b: City) => a.name.localeCompare(b.name))
    }
    
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
      state.selectedCity = null
      state.cities = []
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload
    },
    clearLocation: (state) => {
      state.selectedCountry = null
      state.selectedCountryCode = null
      state.selectedCity = null
      state.cities = []
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
      // Fetch Cities
      .addCase(fetchCities.pending, (state) => {
        state.isLoadingCities = true
        state.error = null
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoadingCities = false
        state.cities = action.payload
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoadingCities = false
        state.error = action.error.message || 'Failed to load states'
      })
  },
})

export const { setSelectedCountry, setSelectedCity, clearLocation, clearError } = locationSlice.actions
export default locationSlice.reducer
