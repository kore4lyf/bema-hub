# Redux RTK Query Implementation

This document summarizes the specific Redux RTK Query implementation approach used in the frontend for the Bema Hub plugin.

## Implementation Approach

The frontend uses Redux Toolkit RTK Query with `fetchBaseQuery` rather than traditional `createAsyncThunk` patterns. This approach provides automatic data fetching, caching, and state management.

## Key Differences from Traditional Redux Patterns

### Traditional Approach (Not Used)
```javascript
// ❌ Old approach with manual async thunks
const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  return response.json()
})
```

### Modern RTK Query Approach (Used)
```javascript
// ✅ Your approach: Define API shape, let RTK Query handle everything
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        body: { email, password },
      }),
    }),
  }),
})
```

## Architecture Components

### 1. State Management Separation
- **Auth Slice**: Only handles local state (user, token, flags)
- **API Slice**: Handles all server communication and caching
- **No more async thunks** - RTK Query manages async operations

### 2. Store Configuration
```javascript
export const store = configureStore({
  reducer: {
    // Local state slices
    auth: authReducer,
    ui: uiReducer,
    location: locationReducer,

    // API slices (auto-generated reducers)
    [authApi.reducerPath]: authApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)      // Handles caching/invalidation
      .concat(locationApi.middleware), // Background refetching
})
```

### 3. State Structure
```javascript
{
  // Local application state
  auth: {
    user: { id, email, name },
    token: "jwt_token",
    isAuthenticated: true,
    pendingUserEmail: null,
    resetUserEmail: null,
    resetToken: null
  },

  // RTK Query managed state (automatic)
  authApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: { ... }
  }
}
```

## Benefits Achieved

1. **Automatic Caching**
   - Countries fetched once, cached for 1 hour
   - No duplicate requests
   - Background updates when needed

2. **Optimistic Updates**
   - Mutations can update cache immediately
   - Rollback on failure

3. **Loading States**
   - Per-mutation loading: isLoading, error, data
   - No manual loading management

4. **Performance**
   - Reduced bundle size (no manual async logic)
   - Efficient re-renders (only affected components update)
   - Request deduplication

## Mental Model Shift

**Old Thinking**: "I need to fetch data and manage loading/error states"
**New Thinking**: "I need to define what data looks like and how to get it"

RTK Query handles:
- ✅ Fetching
- ✅ Caching
- ✅ Loading states
- ✅ Error handling
- ✅ Background updates
- ✅ Request deduplication

This approach eliminated ~200 lines of thunk boilerplate and gave us professional-grade caching and state management.