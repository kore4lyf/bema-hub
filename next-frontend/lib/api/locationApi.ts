import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Country {
  name: string
  flag: string
  iso2: string
  iso3: string
}

interface State {
  name: string
  state_code: string
}

interface StatesResponse {
  error: boolean
  msg: string
  data: {
    name: string
    iso3: string
    states: State[]
  }
}

interface CountriesResponse {
  error: boolean
  msg: string
  data: Country[]
}

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://countriesnow.space/api/v0.1/',
  }),
  tagTypes: ['Country', 'State'],
  keepUnusedDataFor: 300, // Keep data for 5 minutes
  refetchOnFocus: false, // Don't refetch when window gains focus
  refetchOnReconnect: false, // Don't refetch on reconnect
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => 'countries/flag/images',
      transformResponse: (response: CountriesResponse) => 
        response.data.sort((a, b) => a.name.localeCompare(b.name)),
      providesTags: ['Country'],
      keepUnusedDataFor: 3600, // Keep countries for 1 hour
    }),
    getStates: builder.mutation<State[], string>({
      query: (country) => ({
        url: 'countries/states',
        method: 'POST',
        body: { country },
      }),
      transformResponse: (response: StatesResponse) => 
        response.data.states.sort((a, b) => a.name.localeCompare(b.name)),
    }),
  }),
})

export const { useGetCountriesQuery, useGetStatesMutation } = locationApi
