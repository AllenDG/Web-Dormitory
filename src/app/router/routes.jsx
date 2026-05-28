import { lazy, Suspense } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import MainLayout from '../../shared/layouts/MainLayout';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../../features/home/LandingPage'));
const AboutPage = lazy(() => import('../../features/about/AboutPage'));
const HowItWorksPage = lazy(() => import('../../features/how-it-works/HowItWorksPage'));
const ContactPage = lazy(() => import('../../features/contact/ContactPage'));
const FindRentalsPage = lazy(() => import('../../features/rentals/FindRentalsPage'));
const RentalDetailPage = lazy(() => import('../../features/rentals/RentalDetailPage'));
const FavoritesPage = lazy(() => import('../../features/favorites/FavoritesPage'));
const BudgetFinderPage = lazy(() => import('../../features/budget-finder/BudgetFinderPage'));
const NotFoundPage = lazy(() => import('../../features/error/NotFoundPage'));

// Loading component
const PageLoader = () => (
  <Center h="80vh">
    <Spinner size="xl" color="primary.500" thickness="4px" />
  </Center>
);

// Wrapper for lazy loaded components
const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/**
 * Modern Route Configuration
 * Clean architecture with lazy loading
 */
export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <LandingPage />
          </LazyPage>
        ),
      },
      {
        path: 'find-rentals',
        element: (
          <LazyPage>
            <FindRentalsPage />
          </LazyPage>
        ),
      },
      {
        path: 'listing/:id',
        element: (
          <LazyPage>
            <RentalDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'how-it-works',
        element: (
          <LazyPage>
            <HowItWorksPage />
          </LazyPage>
        ),
      },
      {
        path: 'about-us',
        element: (
          <LazyPage>
            <AboutPage />
          </LazyPage>
        ),
      },
      {
        path: 'contact',
        element: (
          <LazyPage>
            <ContactPage />
          </LazyPage>
        ),
      },
      {
        path: 'favorites',
        element: (
          <LazyPage>
            <FavoritesPage />
          </LazyPage>
        ),
      },
      {
        path: 'budget-finder',
        element: (
          <LazyPage>
            <BudgetFinderPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    ),
  },
];
