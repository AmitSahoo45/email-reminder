import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector as <TSelected = unknown>(selector: (state: RootState) => TSelected) => TSelected;
export const useAppStore = useStore as () => AppStore;