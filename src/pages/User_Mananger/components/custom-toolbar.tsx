import {useAtomValue} from "jotai";
import {selectedItemsAtom} from "./store"
export const CustomToolbar = () => {
  const selectedItems = useAtomValue(selectedItemsAtom)
  return (
    <div>Test: {selectedItems}</div>
  )
}