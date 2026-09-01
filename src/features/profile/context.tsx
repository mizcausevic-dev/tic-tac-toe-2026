import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import type { ProfileState } from "./types"
import { profileReducer, type ProfileAction } from "./reducer"
import { loadProfileState, saveProfileState } from "./storage"

interface ProfileContextValue {
  state: ProfileState
  dispatch: Dispatch<ProfileAction>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, undefined, loadProfileState)

  useEffect(() => {
    saveProfileState(state)
  }, [state])

  return <ProfileContext.Provider value={{ state, dispatch }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider")
  return ctx
}
