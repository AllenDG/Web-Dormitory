# Tasks: Compare Properties Feature

## Task 1: Create Compare Store
**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** None

**Description:**
Create Zustand store for managing comparison state with persistence.

**Subtasks:**
- Create `src/shared/stores/useCompareStore.js`
- Implement state: `compareList`, `maxCompare`
- Implement actions: `addToCompare`, `removeFromCompare`, `clearCompare`, `isInCompare`
- Implement computed getters: `compareCount`, `canAddMore`, `hasProperties`, `getCompareProperties`
- Add localStorage persistence with key `compare-storage`
- Add devtools integration
- Handle edge cases: max limit, duplicates, missing properties

**Acceptance Criteria:**
- [ ] Store created with all actions
- [ ] State persists to localStorage
- [ ] Maximum 4 properties enforced
- [ ] Duplicate prevention works
- [ ] getCompareProperties fetches from rental store
- [ ] No console errors

**Files:**
- `src/shared/stores/useCompareStore.js` (new)

---

## Task 2: Create Floating Compare Button Component
**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1

**Description:**
Create floating action button that shows comparison count and navigates to comparison page.

**Subtasks:**
- Create `src/features/compare/components/CompareFloatingButton.jsx`
- Show button only when compareCount > 0
- Display count badge (e.g., "Compare (3)")
- Fixed position: bottom-right (desktop), bottom-center (mobile)
- Navigate to `/compare` on click
- Smooth fade-in/out animation
- Responsive positioning
- Accessible (ARIA labels, keyboard support)

**Acceptance Criteria:**
- [ ] Button visible when 1+ properties in comparison
- [ ] Shows correct count
- [ ] Navigates to /compare page
- [ ] Smooth animations
- [ ] Mobile-responsive
- [ ] Accessible

**Files:**
- `src/features/compare/components/CompareFloatingButton.jsx` (new)

---

## Task 3: Update PropertyCard with Compare Button
**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1

**Description:**
Add "Add to Compare" button to PropertyCard component.

**Subtasks:**
- Update `src/shared/components/PropertyCard.jsx`
- Add compare button next to favorite button
- Show "Added" state when property in comparison
- Toggle property in/out on click
- Disable when limit reached (for properties not in list)
- Icon changes: plus → checkmark
- Toast notifications
- Stop event propagation (don't navigate to detail page)

**Acceptance Criteria:**
- [ ] Compare button visible on all property cards
- [ ] Button state reflects comparison status
- [ ] Click toggles property in/out
- [ ] Toast notifications work
- [ ] Button disabled when limit reached
- [ ] No layout shifts

**Files:**
- `src/shared/components/PropertyCard.jsx` (update)

---

## Task 4: Create Comparison Table Component (Desktop)
**Priority:** High  
**Estimated Time:** 2 hours  
**Dependencies:** Task 1

**Description:**
Create desktop comparison table with side-by-side property columns.

**Subtasks:**
- Create `src/features/compare/components/CompareTable.jsx`
- Table layout with properties as columns
- Sticky header with property images
- Comparison rows for each attribute:
  - Title & Location
  - Price (monthly rate)
  - Bed Type
  - Capacity
  - Amenities (with icons)
  - Description
  - Distance (if available)
  - Rating (if reviews exist)
- Remove button on each column
- Action buttons: View Details, Chat, Schedule Visit
- Alternating row colors
- Highlight differences (e.g., lowest price)
- Responsive to window resize

**Acceptance Criteria:**
- [ ] Table displays all comparison attributes
- [ ] Sticky header works
- [ ] Remove buttons work
- [ ] Action buttons navigate correctly
- [ ] Visual highlights for differences
- [ ] Smooth scroll for long tables
- [ ] Responsive design

**Files:**
- `src/features/compare/components/CompareTable.jsx` (new)

---

## Task 5: Create Comparison Cards Component (Mobile)
**Priority:** High  
**Estimated Time:** 2 hours  
**Dependencies:** Task 1

**Description:**
Create mobile comparison view with swipeable cards.

**Subtasks:**
- Create `src/features/compare/components/CompareCards.jsx`
- Card-based layout (one property per card)
- Swipeable carousel (horizontal)
- Dots indicator showing position
- Each card shows all attributes
- Remove button on each card
- Action buttons: View Details, Chat, Schedule Visit
- Touch-friendly interactions
- Snap to card on release

**Acceptance Criteria:**
- [ ] Cards display all property attributes
- [ ] Swipe gesture works smoothly
- [ ] Dots indicator shows position
- [ ] Remove buttons work
- [ ] Action buttons navigate correctly
- [ ] Touch-friendly tap targets
- [ ] Snap behavior works

**Files:**
- `src/features/compare/components/CompareCards.jsx` (new)

---

## Task 6: Create Empty State Component
**Priority:** Medium  
**Estimated Time:** 30 minutes  
**Dependencies:** None

**Description:**
Create empty state component for when comparison list is empty.

**Subtasks:**
- Create `src/features/compare/components/CompareEmptyState.jsx`
- Icon or illustration
- Heading: "No Properties to Compare"
- Description: "Add properties from search results to compare them side-by-side"
- CTA button: "Browse Properties" → navigates to /find-rentals
- Centered layout
- Responsive design

**Acceptance Criteria:**
- [ ] Empty state displays correctly
- [ ] CTA button navigates to /find-rentals
- [ ] Centered and responsive
- [ ] Consistent with design system

**Files:**
- `src/features/compare/components/CompareEmptyState.jsx` (new)

---

## Task 7: Create Comparison Page
**Priority:** High  
**Estimated Time:** 1.5 hours  
**Dependencies:** Tasks 1, 4, 5, 6

**Description:**
Create main comparison page that orchestrates all comparison components.

**Subtasks:**
- Create `src/features/compare/ComparePropertiesPage.jsx`
- Page header with title and "Clear All" button
- Conditional rendering:
  - Empty state when no properties
  - CompareTable on desktop (>= 768px)
  - CompareCards on mobile (< 768px)
- Clear All confirmation modal
- Toast notifications
- Loading states
- Error handling

**Acceptance Criteria:**
- [ ] Page renders correctly
- [ ] Shows appropriate component based on screen size
- [ ] Clear All button works with confirmation
- [ ] Empty state shows when no properties
- [ ] Toast notifications work
- [ ] Responsive design

**Files:**
- `src/features/compare/ComparePropertiesPage.jsx` (new)

---

## Task 8: Create Component Index Files
**Priority:** Low  
**Estimated Time:** 15 minutes  
**Dependencies:** Tasks 2, 4, 5, 6

**Description:**
Create index files for clean imports.

**Subtasks:**
- Create `src/features/compare/components/index.js`
- Export all comparison components
- Create `src/features/compare/index.js`
- Export ComparePropertiesPage

**Acceptance Criteria:**
- [ ] All components exported
- [ ] Clean import paths work

**Files:**
- `src/features/compare/components/index.js` (new)
- `src/features/compare/index.js` (new)

---

## Task 9: Add Compare Route
**Priority:** High  
**Estimated Time:** 15 minutes  
**Dependencies:** Task 7

**Description:**
Add /compare route to application router.

**Subtasks:**
- Update `src/app/router/routes.jsx`
- Add route: `/compare` → `ComparePropertiesPage`
- Protect route (require authentication)
- Add to tenant routes section

**Acceptance Criteria:**
- [ ] Route added and working
- [ ] Navigation to /compare works
- [ ] Protected route (guests see login prompt)

**Files:**
- `src/app/router/routes.jsx` (update)

---

## Task 10: Integrate Floating Button in FindRentalsPage
**Priority:** High  
**Estimated Time:** 15 minutes  
**Dependencies:** Task 2

**Description:**
Add floating compare button to FindRentalsPage.

**Subtasks:**
- Update `src/features/rentals/FindRentalsPage.jsx`
- Import and render CompareFloatingButton
- Position at bottom of page
- Ensure no layout conflicts

**Acceptance Criteria:**
- [ ] Floating button visible on FindRentalsPage
- [ ] Button positioned correctly
- [ ] No layout issues

**Files:**
- `src/features/rentals/FindRentalsPage.jsx` (update)

---

## Task 11: Add Compare Button to RentalDetailPage
**Priority:** Medium  
**Estimated Time:** 30 minutes  
**Dependencies:** Task 1

**Description:**
Add "Add to Compare" button to property detail page.

**Subtasks:**
- Update `src/features/rentals/RentalDetailPage.jsx`
- Add compare button in action buttons section
- Show "Added to Compare" state
- Toggle property in/out on click
- Toast notifications
- Responsive placement

**Acceptance Criteria:**
- [ ] Compare button visible on detail page
- [ ] Button state reflects comparison status
- [ ] Click toggles property in/out
- [ ] Toast notifications work
- [ ] Responsive design

**Files:**
- `src/features/rentals/RentalDetailPage.jsx` (update)

---

## Task 12: Build and Test
**Priority:** High  
**Estimated Time:** 30 minutes  
**Dependencies:** All previous tasks

**Description:**
Build application and test all comparison features.

**Subtasks:**
- Run `npm run build`
- Fix any build errors
- Test add to compare flow
- Test comparison page (desktop and mobile)
- Test remove from compare
- Test clear all
- Test empty state
- Test maximum limit
- Test persistence (refresh page)
- Test responsive design
- Test accessibility (keyboard navigation)

**Acceptance Criteria:**
- [ ] Build successful with 0 errors
- [ ] All features working correctly
- [ ] No console errors
- [ ] Responsive on all screen sizes
- [ ] Accessible

**Files:**
- All created/updated files

---

## Task 13: Create Documentation
**Priority:** Medium  
**Estimated Time:** 1 hour  
**Dependencies:** Task 12

**Description:**
Create comprehensive documentation for the compare feature.

**Subtasks:**
- Create `WEEK_12_COMPARE_PROPERTIES_COMPLETE.md`
- Document all features implemented
- Document store API
- Document component props
- Add usage examples
- Add screenshots/descriptions
- Update `PROJECT_STATUS_SUMMARY.md`
- Update progress to 71% (10/14 weeks)

**Acceptance Criteria:**
- [ ] Complete documentation created
- [ ] PROJECT_STATUS_SUMMARY.md updated
- [ ] All features documented
- [ ] Code examples included

**Files:**
- `WEEK_12_COMPARE_PROPERTIES_COMPLETE.md` (new)
- `PROJECT_STATUS_SUMMARY.md` (update)

---

## Task Summary

**Total Tasks:** 13  
**Estimated Time:** ~12 hours  
**Priority Breakdown:**
- High: 9 tasks
- Medium: 3 tasks
- Low: 1 task

**Dependency Chain:**
1. Task 1 (Store) → Tasks 2, 3, 4, 5, 11
2. Tasks 2, 4, 5, 6 → Task 7
3. Task 7 → Task 9
4. Task 2 → Task 10
5. All tasks → Task 12 → Task 13

**Parallel Work Opportunities:**
- Tasks 2, 3, 6 can be done in parallel after Task 1
- Tasks 4, 5 can be done in parallel after Task 1
- Tasks 10, 11 can be done in parallel after their dependencies

---

**Status:** Ready for Implementation  
**Next Step:** Begin Task 1 - Create Compare Store
