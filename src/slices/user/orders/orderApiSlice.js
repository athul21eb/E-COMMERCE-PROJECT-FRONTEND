import userApiSlice from "../../../app/api/user/userApiSlice.js";

const orderUrl = "/user/orders";

const userOrderApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${orderUrl}/create`,
        method: "POST",
        body: data,
      }),
    }),

    getOrdersForUser: builder.query({
      query: ({ itemsPerPage, currentPage }) => ({
        url: `${orderUrl}/user-orders?page=${currentPage}&limit=${itemsPerPage}`,
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${orderUrl}/${id}`,
      }),
    }),
    cancelOrderItem: builder.mutation({
      query: ({ orderId, itemId }) => ({
        url: `${orderUrl}/${orderId}/items/${itemId}/cancel`,
        method: "PATCH",
      }),
    }),
    returnOrderItem: builder.mutation({
      query: ({ orderId, itemId, reason, remarks }) => ({
        url: `${orderUrl}/${orderId}/items/${itemId}/return`,
        method: "PATCH",
        body: { reason, remarks },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `${orderUrl}/verify-payment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useLazyGetOrdersForUserQuery,
  useLazyGetOrderByIdQuery,
  useCancelOrderItemMutation,
  useVerifyPaymentMutation,
  useReturnOrderItemMutation,
} = userOrderApiSlice;
