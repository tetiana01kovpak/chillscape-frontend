export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LOCATIONS: '/locations',
  ADD_LOCATION: '/locations/add',
  PROFILE: (userId: string) => `/profile/${userId}`,
};
