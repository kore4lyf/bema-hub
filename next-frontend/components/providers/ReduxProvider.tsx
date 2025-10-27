'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { hydrateAuth } from '@/lib/features/auth/authSlice'
import { useEffect } from 'react'

function AuthHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedAuth = localStorage.getItem('authData')
    if (savedAuth) {
      try {
        store.dispatch(hydrateAuth(JSON.parse(savedAuth)))
      } catch (error) {
        localStorage.removeItem('authData')
      }
    }
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
