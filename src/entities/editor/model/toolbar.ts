import {atom} from "jotai";
import type {ToolbarState} from "@/entities/editor/model/types.ts";

export const toolbarAtom = atom<ToolbarState>('select')
