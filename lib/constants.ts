export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LOCATIONS: '/locations',
  ADD_LOCATION: '/locations/add',
  PRO: '/pro',
  PROFILE: (userId: string) => `/profile/${userId}`,
};
