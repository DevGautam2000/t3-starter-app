import { ShoppingList } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ItemModal, { ModalBehaviour } from "../components/itemModal";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [items, setItems] = useState<ShoppingList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);

  const mb: ModalBehaviour = {
    open: () => setIsModalOpen(() => true),
    close: () => setIsModalOpen(() => false),
  };

  const { data: itemsData, isLoading } = trpc.shoppingList.getItems.useQuery(
    null,
    {
      onSuccess(data) {
        setItems(() => data);
      },
    }
  );

  const { mutate: deleteItem } = trpc.shoppingList.deleteItem.useMutation({
    onSuccess(shoppingItem) {
      setItems((prev) => prev.filter((item) => item.id !== shoppingItem.id));
    },
  });

  const { mutate: checkItem } = trpc.shoppingList.checkItem.useMutation({});

  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isModalOpen ? <ItemModal mb={mb} setItems={setItems} /> : null}

      <main className="mx-auto my-12 max-w-3xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">My Shopping List</h2>

          <button
            type="button"
            onClick={() => mb.open()}
            className="inline-block 
                rounded bg-red-500 px-6 py-2.5 text-xs font-medium 
                uppercase leading-tight
              text-white shadow-md 
                transition duration-150 ease-in-out
                hover:bg-red-400 hover:shadow-lg
                  focus:bg-red-400 focus:shadow-lg focus:outline-none focus:ring-0
                  active:bg-red-500 active:shadow-lg"
          >
            Add Item
          </button>
        </div>

        {!itemsData || isLoading ? null : (
          <ul className="mt-4">
            {items.map((currItem) => {
              const { name, checked, id } = currItem;
              return (
                <li key={id} className="flex items-center justify-between p-1">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setItems(() => [
                        ...items.filter((item) => item.id !== id),
                        { id, name, checked: !checked },
                      ]);
                      checkItem({ id, checked: !checked });
                    }}
                  >
                    {checked ? (
                      <span className="line-through decoration-red-600 transition duration-150 ease-in-out">
                        {name}
                      </span>
                    ) : (
                      <span>{name}</span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteItem({ id })}
                    className="h-6 w-6 rounded-full bg-gray-200 text-sm text-red-400 outline-none hover:bg-gray-100 active:scale-95"
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
};

export default Home;
