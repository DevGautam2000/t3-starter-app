import { z } from "zod";

import { router, publicProcedure } from "../trpc";

/* 
 v9:
const appRouter = trpc.router()
  .query('addItem', {
    input: z.object({
      name:z.string()
    }),
    resolve: async ({ input,ctx }) {
      
      await ctx.prisma.shoppingList.create({
        data: {
          input.name
        }
      });
    },
  });

v10:
const appRouter = router({
  greeting: publicProcedure
    .input(z.string())
    .query(({ input }) => `hello ${input}!`),
});

*/
export const itemRouter = router({
  addItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.shoppingList.create({
        data: input,
      });

      return item;
    }),

  getItems: publicProcedure.input(z.null()).query(async ({ ctx }) => {
    const items = await ctx.prisma.shoppingList.findMany();
    return items;
  }),

  deleteItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({input,ctx}) => {

      const item = await ctx.prisma.shoppingList.delete({
        where: {
          id: input.id
        }
      })

      return item
    }),
  
  checkItem: publicProcedure
  .input(
    z.object({
      id: z.string(),
      checked:z.boolean()
    })
  )
  .mutation(async ({input,ctx}) => {

    const item = await ctx.prisma.shoppingList.update({
      where: {
        id: input.id
      },
      data:{
        checked: input.checked
      }
    })

    return item
  }),
});
