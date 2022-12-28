import { ShoppingList } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";

export interface ModalBehaviour {
  open: Dispatch<void>;
  close: Dispatch<void>;
}

interface ItemModalProps {
  mb: ModalBehaviour;
  setItems: Dispatch<SetStateAction<ShoppingList[]>>;
}

const ItemModal: FC<ItemModalProps> = ({ mb, setItems }) => {
  const [input, setInput] = useState<string>("");
  const { mutate: addItem } = trpc.shoppingList.addItem.useMutation({
    onSuccess(newItem: ShoppingList) {
      setItems((prev) => [...prev, newItem]);
    },
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="space-y-4 rounded-md bg-white p-6">
        <h3 className="text-xl font-medium ">Name of item</h3>

        <input
          type="text"
          value={input}
          autoFocus={true}
          onChange={(e) => setInput(e.target.value)}
          className="border-grey-200 w-full rounded-md bg-gray-200 px-3 py-1  shadow-lg outline-none focus:right-2 focus:border-violet-300 focus:ring-1"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => mb.close()}
            className="mx-2 rounded-md bg-gray-500 px-2 py-1 text-sm text-white transition hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              addItem({ name: input });
              mb.close();
            }}
            className=" rounded-md bg-red-500 px-2 text-sm text-white transition hover:bg-red-400"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
