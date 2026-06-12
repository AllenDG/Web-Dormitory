import { lazy } from 'react';

// Tenant/Guest Pages
export const LandingPage = lazy(() => import('../../modules/guest/home/LandingPage'));
export const AboutPage = lazy(() => import('../../modules/guest/about/AboutPage'));
export const HowItWorksPage = lazy(() => import('../../modules/guest/how-it-works/HowItWorksPage'));
export const ContactPage = lazy(() => import('../../modules/guest/contact/ContactPage'));
export const NotFoundPage = lazy(() => import('../../modules/guest/error/NotFoundPage'));

// Property/Rental Pages (Domain-driven)
export const FindRentalsPage = lazy(() => import('../../domains/properties/pages/FindRentalsPage'));
export const RentalDetailPage = lazy(() => import('../../domains/properties/pages/RentalDetailPage'));
export const ComparePropertiesPage = lazy(() => import('../../domains/properties/pages/ComparePropertiesPage'));

// Favorites (Domain-driven)
export const FavoritesPage = lazy(() => import('../../domains/favorites/pages/FavoritesPage'));

// Appointments/Visits (Domain-driven)
export const ScheduleVisitPage = lazy(() => import('../../domains/appointments/pages/ScheduleVisitPage'));
export const MyVisitsPage = lazy(() => import('../../domains/appointments/pages/MyVisitsPage'));

// Profile (Domain-driven)
export const ProfilePage = lazy(() => import('../../domains/users/pages/ProfilePage'));

// Chat (Domain-driven)
export const ChatPage = lazy(() => import('../../domains/chat/pages/ChatPage'));

// Bookings (Domain-driven)
export const BookingPage = lazy(() => import('../../domains/bookings/pages/BookingPage'));
export const PaymentPage = lazy(() => import('../../domains/bookings/pages/PaymentPage'));
export const BookingConfirmationPage = lazy(() => import('../../domains/bookings/pages/BookingConfirmationPage'));
export const MyBookingsPage = lazy(() => import('../../domains/bookings/pages/MyBookingsPage'));
export const ContractPage = lazy(() => import('../../domains/bookings/pages/ContractPage'));

// Reviews (Domain-driven)
export const ReviewPage = lazy(() => import('../../domains/reviews/pages/ReviewPage'));
