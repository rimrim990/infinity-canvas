import { atom } from 'jotai'
import type { ToolbarState } from '@/features/editor/types.ts'

export const toolbarAtom = atom<ToolbarState>('select')
