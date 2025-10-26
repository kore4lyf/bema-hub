'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { hydrateAuth } from '@/lib/features/auth/authSlice'
import { useEffect } from 'react'

function AuthHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate auth state from localStorage on mount
    store.dispatch(hydrateAuth())
  }, [])

  return <>{children}</>
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <AuthHydration>{children}</AuthHydration>
    </Provider>
  )
}
