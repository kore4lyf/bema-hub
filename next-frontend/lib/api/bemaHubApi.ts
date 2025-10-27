import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bemaHubApi = createApi({
  reducerPath: 'bemaHubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/wp-json/bema-hub/v1/`,
  }),
  endpoints: () => ({}),
})
