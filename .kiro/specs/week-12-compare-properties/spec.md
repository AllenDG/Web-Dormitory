# Week 12: Compare Properties Feature

## Overview
Implement a comprehensive property comparison feature that allows users to compare up to 4 properties side-by-side. This feature will help tenants make informed decisions by viewing key property attributes in a structured comparison table.

## Goals
- Enable users to add properties to a comparison list
- Display up to 4 properties in a side-by-side comparison
- Show key comparison metrics: price, amenities, location, reviews, availability
- Provide mobile-responsive comparison experience
- Integrate seamlessly with existing property browsing flows

## Success Criteria
- [ ] Users can add/remove properties from comparison (max 4)
- [ ] Floating compare button shows count and navigates to comparison page
- [ ] Comparison table displays all key property attributes
- [ ] Mobile-responsive design (swipeable cards on mobile)
- [ ] Comparison state persists across sessions
- [ ] Zero build errors
- [ ] Consistent with existing design system (8px radius, #2563EB primary, Poppins font)

## Technical Approach
- Create Zustand store for comparison state management
- Build reusable comparison components
- Add "Add to Compare" button to PropertyCard component
- Create dedicated comparison page with table layout
- Implement floating action button with count badge
- Use localStorage for persistence
- Follow established patterns from existing stores (useRentalStore, useReviewStore)

## Design Considerations
- Maintain 8px border radius consistency
- Use #2563EB primary color for compare actions
- Poppins font throughout
- Smooth animations (0.2s-0.3s transitions)
- Desktop: Table layout with sticky headers
- Mobile: Swipeable card layout
- Highlight differences between properties
- Color-coded ratings and badges
- Empty state with clear CTA when no properties selected

## Integration Points
- PropertyCard component (add compare button)
- FindRentalsPage (display floating compare button)
- RentalDetailPage (add compare button)
- Navbar (optional compare icon with count)
- Routes (add /compare route)

## Dependencies
- Existing rental store (useRentalStore) for property data
- Existing PropertyCard component
- Chakra UI components
- React Router for navigation
- Zustand for state management

## Timeline
Estimated: 1 week

## Related Documentation
- PLATFORM_MIGRATION_PLAN.md (Phase 11)
- PROJECT_STATUS_SUMMARY.md
- Existing store patterns: useReviewStore.js, useRecommendationStore.js
