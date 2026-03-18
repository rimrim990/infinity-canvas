import {atom} from "jotai";
import type {ToolbarStatus} from "@/entities/editor/model/types.ts";

export const toolbarAtom = atom<ToolbarStatus>('select')
