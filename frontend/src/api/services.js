import axiosInstance from './axiosInstance';

export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login:    (data) => axiosInstance.post('/auth/login', data),
  logout:   ()     => axiosInstance.post('/auth/logout'),
  refresh:  ()     => axiosInstance.post('/auth/refresh'),
};

export const userAPI = {
  getUser:    (id)       => axiosInstance.get(`/users/${id}`),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUser: (id)       => axiosInstance.delete(`/users/${id}`),
};

export const gigAPI = {
  getGigs:      (params) => axiosInstance.get('/gigs', { params }),
  getSingleGig: (id)     => axiosInstance.get(`/gigs/single/${id}`),
  createGig:    (data)   => axiosInstance.post('/gigs', data),
  deleteGig:    (id)     => axiosInstance.delete(`/gigs/${id}`),
};

export const orderAPI = {
  getOrders:           ()      => axiosInstance.get('/orders'),
  createPaymentIntent: (gigId) => axiosInstance.post(`/orders/create-payment-intent/${gigId}`),
  confirmOrder:        (data)  => axiosInstance.put('/orders', data),
};

export const reviewAPI = {
  getReviews:   (gigId) => axiosInstance.get(`/reviews/${gigId}`),
  createReview: (data)  => axiosInstance.post('/reviews', data),
  deleteReview: (id)    => axiosInstance.delete(`/reviews/${id}`),
};

export const conversationAPI = {
  getConversations:      ()     => axiosInstance.get('/conversations'),
  createConversation:    (data) => axiosInstance.post('/conversations', data),
  getSingleConversation: (id)   => axiosInstance.get(`/conversations/single/${id}`),
  updateConversation:    (id)   => axiosInstance.put(`/conversations/${id}`),
};

export const messageAPI = {
  getMessages:   (convId) => axiosInstance.get(`/messages/${convId}`),
  createMessage: (data)   => axiosInstance.post('/messages', data),
};

/**
 * Upload API — all use multipart/form-data
 * Pass a FormData object with field "image" (single) or "images" (multiple).
 */
export const uploadAPI = {
  // Upload profile avatar — returns { img, user }
  avatar: (formData) =>
    axiosInstance.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload single gig cover — returns { url }
  // formData should contain "image" file and optionally "gigId"
  gigCover: (formData) =>
    axiosInstance.post('/upload/gig-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload up to 5 gig gallery images — returns { urls[] }
  // formData should contain "images" files and "gigId"
  gigImages: (formData) =>
    axiosInstance.post('/upload/gig-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
