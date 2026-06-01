# Requirements: Compare Properties Feature

## Functional Requirements

### FR1: Add to Compare
**Priority:** High  
**Description:** Users can add properties to a comparison list from multiple entry points

**Acceptance Criteria:**
- [ ] "Add to Compare" button visible on PropertyCard component
- [ ] Button shows "Added" state when property is in comparison
- [ ] Click toggles property in/out of comparison list
- [ ] Maximum 4 properties can be added
- [ ] Toast notification when limit reached
- [ ] Button disabled when limit reached (for properties not in list)
- [ ] Icon changes based on state (plus icon → checkmark)

**User Stories:**
- As a tenant, I want to add properties to compare so I can evaluate multiple options
- As a tenant, I want visual feedback when I add a property so I know it was successful
- As a tenant, I want to know when I've reached the comparison limit

---

### FR2: Comparison State Management
**Priority:** High  
**Description:** Comparison list persists across sessions and pages

**Acceptance Criteria:**
- [ ] Comparison list stored in Zustand store
- [ ] State persists to localStorage
- [ ] State syncs across browser tabs
- [ ] Maximum 4 properties enforced
- [ ] Can add/remove properties
- [ ] Can clear all properties
- [ ] Property data fetched from rental store

**Technical Details:**
- Store name: `useCompareStore`
- Persistence key: `compare-storage`
- State shape:
  ```javascript
  {
    compareList: [], // Array of property IDs (max 4)
    maxCompare: 4
  }
  ```

---

### FR3: Floating Compare Button
**Priority:** High  
**Description:** Persistent floating button shows comparison count and navigates to comparison page

**Acceptance Criteria:**
- [ ] Button visible when 1+ properties in comparison
- [ ] Shows count badge (e.g., "Compare (3)")
- [ ] Fixed position at bottom of screen
- [ ] Navigates to /compare page on click
- [ ] Smooth fade-in/out animation
- [ ] Mobile-responsive positioning
- [ ] Z-index above other content
- [ ] Accessible (keyboard navigation, ARIA labels)

**Design Specs:**
- Position: Fixed bottom-right (desktop), bottom-center (mobile)
- Color: Primary blue (#2563EB)
- Border radius: 8px
- Shadow: lg
- Animation: 0.3s ease

---

### FR4: Comparison Page - Desktop Layout
**Priority:** High  
**Description:** Desktop view displays properties in a side-by-side table

**Acceptance Criteria:**
- [ ] Table layout with properties as columns
- [ ] Sticky header with property images
- [ ] Comparison rows for each attribute
- [ ] Remove button on each property column
- [ ] "Clear All" button
- [ ] Empty state when no properties
- [ ] Smooth scroll for long tables
- [ ] Responsive to window resize

**Comparison Attributes:**
1. **Property Image** (header)
2. **Title & Location**
3. **Price** (monthly rate)
4. **Bed Type**
5. **Capacity** (available persons)
6. **Amenities** (list with icons)
7. **Description**
8. **Distance** (if available)
9. **Rating** (if reviews exist)
10. **Action Buttons** (View Details, Chat, Schedule Visit)

**Visual Design:**
- Alternating row colors for readability
- Highlight differences (e.g., lowest price in green)
- Icons for amenities
- Star ratings for reviews
- Badges for bed types

---

### FR5: Comparison Page - Mobile Layout
**Priority:** High  
**Description:** Mobile view displays properties as swipeable cards

**Acceptance Criteria:**
- [ ] Card-based layout (one property per card)
- [ ] Swipeable carousel
- [ ] Dots indicator showing position
- [ ] Each card shows all attributes
- [ ] Remove button on each card
- [ ] "Clear All" button at top
- [ ] Empty state when no properties
- [ ] Touch-friendly interactions

**Design Specs:**
- Card width: 90% of screen
- Spacing: 16px between cards
- Swipe gesture: horizontal
- Snap to card on release

---

### FR6: Empty State
**Priority:** Medium  
**Description:** Clear guidance when comparison list is empty

**Acceptance Criteria:**
- [ ] Illustration or icon
- [ ] Heading: "No Properties to Compare"
- [ ] Description: "Add properties from search results to compare them side-by-side"
- [ ] CTA button: "Browse Properties" → navigates to /find-rentals
- [ ] Centered layout
- [ ] Responsive design

---

### FR7: Property Removal
**Priority:** High  
**Description:** Users can remove properties from comparison

**Acceptance Criteria:**
- [ ] Remove button on each property (X icon)
- [ ] Confirmation not required (can re-add easily)
- [ ] Smooth removal animation
- [ ] Table/cards re-layout after removal
- [ ] Toast notification: "Property removed from comparison"
- [ ] Updates floating button count

---

### FR8: Clear All
**Priority:** Medium  
**Description:** Users can clear entire comparison list at once

**Acceptance Criteria:**
- [ ] "Clear All" button visible when 2+ properties
- [ ] Confirmation modal: "Remove all properties from comparison?"
- [ ] Modal has Cancel and Confirm buttons
- [ ] Clears all properties on confirm
- [ ] Toast notification: "Comparison cleared"
- [ ] Hides floating button after clear

---

### FR9: Integration with Property Browsing
**Priority:** High  
**Description:** Compare feature integrates seamlessly with existing pages

**Acceptance Criteria:**
- [ ] PropertyCard component updated with compare button
- [ ] FindRentalsPage shows floating compare button
- [ ] RentalDetailPage has "Add to Compare" button
- [ ] Compare button state syncs across all pages
- [ ] No layout shifts when adding compare button
- [ ] Maintains existing PropertyCard functionality

---

### FR10: Comparison Analytics (Future)
**Priority:** Low  
**Description:** Track comparison usage for insights

**Acceptance Criteria:**
- [ ] Track properties added to comparison
- [ ] Track comparison page views
- [ ] Track properties removed
- [ ] Track "View Details" clicks from comparison
- [ ] Store analytics in localStorage (mock)
- [ ] Backend-ready structure

---

## Non-Functional Requirements

### NFR1: Performance
- Comparison page loads in <500ms
- Smooth animations (60fps)
- No layout shifts during interactions
- Efficient re-renders (React.memo where needed)

### NFR2: Accessibility
- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- Focus indicators visible
- ARIA labels on interactive elements
- Color contrast ratios meet standards

### NFR3: Responsive Design
- Desktop: 1024px+ (table layout)
- Tablet: 768px-1023px (table layout, smaller columns)
- Mobile: <768px (card layout)
- Touch-friendly tap targets (44px minimum)

### NFR4: Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### NFR5: Data Persistence
- Comparison list persists across sessions
- Survives page refreshes
- Syncs across browser tabs
- Graceful handling of localStorage errors

### NFR6: Error Handling
- Handle missing property data gracefully
- Handle localStorage quota exceeded
- Handle network errors (future API integration)
- User-friendly error messages

---

## User Flows

### Flow 1: Add Properties and Compare
1. User browses properties on FindRentalsPage
2. User clicks "Add to Compare" on PropertyCard
3. Toast notification: "Added to comparison"
4. Floating button appears with count badge
5. User adds 2-3 more properties
6. User clicks floating "Compare" button
7. Navigates to /compare page
8. Views side-by-side comparison table
9. Clicks "View Details" on preferred property

### Flow 2: Remove Property from Comparison
1. User on comparison page with 3 properties
2. User clicks X button on one property
3. Property removed with animation
4. Table re-layouts to 2 columns
5. Toast notification: "Property removed"
6. Floating button updates count

### Flow 3: Clear All and Browse
1. User on comparison page with 4 properties
2. User clicks "Clear All" button
3. Confirmation modal appears
4. User clicks "Confirm"
5. All properties removed
6. Empty state displayed
7. User clicks "Browse Properties"
8. Navigates to FindRentalsPage

### Flow 4: Mobile Comparison
1. User on mobile device
2. Adds 3 properties to comparison
3. Taps floating "Compare" button
4. Views first property card
5. Swipes left to view second property
6. Swipes left to view third property
7. Dots indicator shows position (3/3)
8. Taps "View Details" on preferred property

---

## Edge Cases

### EC1: Maximum Limit Reached
- **Scenario:** User tries to add 5th property
- **Expected:** Toast notification "Maximum 4 properties can be compared", button disabled
- **Handling:** Disable "Add to Compare" buttons on properties not in list

### EC2: Property Deleted from System
- **Scenario:** Property in comparison list is deleted by owner
- **Expected:** Property removed from comparison, user notified
- **Handling:** Filter out missing properties on page load, show toast

### EC3: localStorage Full
- **Scenario:** localStorage quota exceeded
- **Expected:** Graceful degradation, in-memory storage only
- **Handling:** Try-catch around localStorage operations, fallback to session storage

### EC4: No Properties in Comparison
- **Scenario:** User navigates directly to /compare with empty list
- **Expected:** Empty state displayed with CTA
- **Handling:** Check comparison list length, render empty state component

### EC5: Single Property in Comparison
- **Scenario:** User has only 1 property in comparison
- **Expected:** Comparison page shows single property with message
- **Handling:** Display message "Add more properties to compare" with CTA

### EC6: Duplicate Property
- **Scenario:** User tries to add same property twice
- **Expected:** No action, property already in list
- **Handling:** Check if property ID exists before adding

---

## Data Models

### CompareStore State
```javascript
{
  // State
  compareList: string[], // Array of property IDs (max 4)
  maxCompare: number, // 4
  
  // Computed
  compareCount: number, // compareList.length
  canAddMore: boolean, // compareCount < maxCompare
  hasProperties: boolean, // compareCount > 0
  
  // Actions
  addToCompare: (propertyId: string) => void,
  removeFromCompare: (propertyId: string) => void,
  clearCompare: () => void,
  isInCompare: (propertyId: string) => boolean,
  getCompareProperties: () => Property[], // Fetches from rental store
}
```

### Property Data (from useRentalStore)
```javascript
{
  id: string,
  title: string,
  city: string,
  address: string,
  price: number,
  bedType: string,
  availablePerson: number,
  amenities: string[],
  description: string,
  imageUrl: string[],
  distance?: string,
  rating?: number,
  reviewCount?: number,
  tags?: string[],
}
```

---

## API Endpoints (Future Backend Integration)

### GET /api/compare
**Description:** Get comparison list for user  
**Response:**
```json
{
  "compareList": ["prop-1", "prop-2", "prop-3"],
  "properties": [...]
}
```

### POST /api/compare
**Description:** Add property to comparison  
**Request:**
```json
{
  "propertyId": "prop-1"
}
```

### DELETE /api/compare/:propertyId
**Description:** Remove property from comparison

### DELETE /api/compare
**Description:** Clear all properties from comparison

---

## Testing Checklist

### Unit Tests
- [ ] useCompareStore actions
- [ ] Add/remove/clear operations
- [ ] Maximum limit enforcement
- [ ] Duplicate prevention
- [ ] localStorage persistence

### Integration Tests
- [ ] PropertyCard compare button
- [ ] Floating button visibility
- [ ] Navigation to comparison page
- [ ] Property removal from comparison
- [ ] Clear all functionality

### E2E Tests
- [ ] Complete comparison flow
- [ ] Mobile swipe interaction
- [ ] Desktop table interaction
- [ ] Empty state handling
- [ ] Maximum limit handling

### Accessibility Tests
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] ARIA labels
- [ ] Color contrast

### Responsive Tests
- [ ] Desktop layout (1920px, 1440px, 1024px)
- [ ] Tablet layout (768px, 1023px)
- [ ] Mobile layout (375px, 414px, 390px)
- [ ] Orientation changes

---

## Dependencies

### Internal
- `useRentalStore` - Property data source
- `PropertyCard` - Component to enhance
- `FindRentalsPage` - Integration point
- `RentalDetailPage` - Integration point
- `routes.jsx` - Add /compare route

### External
- `zustand` - State management
- `zustand/middleware` - Persistence
- `@chakra-ui/react` - UI components
- `react-router-dom` - Navigation
- `react-icons` - Icons
- `framer-motion` - Animations (optional)

---

## Risks & Mitigations

### Risk 1: Performance with Large Property Data
**Mitigation:** Memoize comparison table, lazy load images, virtualize long lists

### Risk 2: localStorage Quota
**Mitigation:** Store only property IDs, not full objects; implement fallback to session storage

### Risk 3: Mobile Swipe Conflicts
**Mitigation:** Use established swipe library (react-swipeable), test on real devices

### Risk 4: Layout Shifts on Add/Remove
**Mitigation:** Use CSS Grid with fixed columns, smooth transitions

---

## Future Enhancements

1. **Save Comparisons** - Allow users to save comparison sets
2. **Share Comparisons** - Generate shareable link
3. **Export to PDF** - Download comparison as PDF
4. **Email Comparison** - Send comparison to email
5. **Comparison History** - Track past comparisons
6. **Smart Recommendations** - Suggest properties to compare
7. **Custom Attributes** - Let users choose what to compare
8. **Side-by-Side Images** - Image comparison slider

---

## Documentation Requirements

- [ ] Update PROJECT_STATUS_SUMMARY.md
- [ ] Create WEEK_12_COMPARE_PROPERTIES_COMPLETE.md
- [ ] Document compare store API
- [ ] Add code comments
- [ ] Update README with compare feature
- [ ] Create user guide for comparison

---

## Acceptance Criteria Summary

**Feature is complete when:**
1. ✅ Users can add up to 4 properties to comparison
2. ✅ Floating button shows count and navigates to comparison page
3. ✅ Desktop shows table layout with all attributes
4. ✅ Mobile shows swipeable card layout
5. ✅ Users can remove properties and clear all
6. ✅ Empty state guides users to browse properties
7. ✅ State persists across sessions
8. ✅ Zero build errors
9. ✅ Responsive on all screen sizes
10. ✅ Accessible (WCAG AA)
11. ✅ Consistent with design system
12. ✅ Documentation complete

---

**Status:** Ready for Design Phase  
**Next Step:** Create design specifications and component architecture
