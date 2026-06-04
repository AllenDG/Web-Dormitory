# Daily Migration Checklist ✅

## Day 0: Foundation ✅ COMPLETE

- [x] Create folder structure
- [x] Create app/config/
- [x] Add documentation
- [x] Commit & push
- [x] **Status**: DONE (June 3, 2026)

---

## Day 1: Config & Shared Utils (1 hour)

**When to do**: Tomorrow or whenever you're ready

### Tasks:
- [ ] Update imports to use new `app/config/constants`
- [ ] Move `src/utils/` → `src/shared/utils/`
- [ ] Update utils imports
- [ ] Test build: `npm run build`
- [ ] Test in browser: `npm run dev`
- [ ] Commit & push

### Files to Move (~10):
- [ ] src/utils/amenityIcon.js → src/shared/utils/
- [ ] src/utils/formHelper.js → src/shared/utils/
- [ ] src/utils/parsePriceRange.js → src/shared/utils/
- [ ] src/utils/paymentMethodSchema.js → src/shared/utils/
- [ ] src/utils/priceFormatter.js → src/shared/utils/
- [ ] src/utils/validationSchema.js → src/shared/utils/

### Success Criteria:
- [ ] Build passes
- [ ] No console errors
- [ ] Homepage loads
- [ ] Login works

---

## Day 2: Auth Domain (1 hour)

### Tasks:
- [ ] Create domains/auth/pages/
- [ ] Move auth pages
- [ ] Create domains/auth/components/
- [ ] Move auth components
- [ ] Update auth imports
- [ ] Test login/signup
- [ ] Commit & push

### Files to Move (~5):
- [ ] LoginPage.jsx → domains/auth/pages/
- [ ] SignUpPage.jsx → domains/auth/pages/
- [ ] GoogleAuthButton.jsx → domains/auth/components/
- [ ] LoginPromptModal.jsx → domains/auth/components/

---

## Day 3: Properties Domain (1.5 hours)

### Tasks:
- [ ] Move rentals to domains/properties/
- [ ] Move compare to domains/properties/
- [ ] Move components
- [ ] Update imports
- [ ] Test property browsing
- [ ] Commit & push

### Files to Move (~15):
- [ ] FindRentalsPage.jsx
- [ ] RentalDetailPage.jsx
- [ ] ComparePropertiesPage.jsx
- [ ] Property components

---

## Day 4: Bookings & Payments (1.5 hours)

### Tasks:
- [ ] Move booking features
- [ ] Move payment features
- [ ] Update imports
- [ ] Test booking flow
- [ ] Commit & push

### Files to Move (~12):
- [ ] Booking pages & components
- [ ] Payment pages & components

---

## Day 5: Remaining Domains (1 hour)

### Tasks:
- [ ] Move notifications
- [ ] Move chat
- [ ] Move reviews
- [ ] Move favorites
- [ ] Update imports
- [ ] Commit & push

### Files to Move (~10):
- [ ] Notifications pages & components
- [ ] Chat pages & components
- [ ] Reviews components
- [ ] Favorites pages

---

## Day 6: Create Modules (1 hour)

### Tasks:
- [ ] Move guest pages → modules/guest/
- [ ] Move owner pages → modules/owner/
- [ ] Move admin pages → modules/admin/
- [ ] Update router
- [ ] Test all portals
- [ ] Commit & push

### Files to Move (~20):
- [ ] Home, About, Contact, How It Works
- [ ] Owner dashboard & pages
- [ ] Admin dashboard & pages

---

## Day 7: Cleanup & Finish (1 hour)

### Tasks:
- [ ] Move services → infrastructure/
- [ ] Set up infrastructure/api/
- [ ] Remove old folders
- [ ] Update remaining imports
- [ ] Final build test
- [ ] Final browser test
- [ ] Commit & push
- [ ] Merge to main
- [ ] Celebrate! 🎉

---

## 🎯 QUICK COMMANDS

### Start Work:
```bash
git checkout enterprise-refactoring
git pull origin enterprise-refactoring
```

### Test:
```bash
npm run build
npm run dev
```

### Commit:
```bash
git add .
git commit -m "Day X: [description]"
git push origin enterprise-refactoring
```

### If Something Breaks:
```bash
# See what changed
git diff

# Undo unstaged changes
git checkout .

# Go back to main (safe version)
git checkout main
```

---

## 📊 PROGRESS

```
Day 0: ████░░░░░░░░░░░░░░░░  10% ✅ DONE
Day 1: ░░░░░░░░░░░░░░░░░░░░  10% → 20%
Day 2: ░░░░░░░░░░░░░░░░░░░░  20% → 35%
Day 3: ░░░░░░░░░░░░░░░░░░░░  35% → 55%
Day 4: ░░░░░░░░░░░░░░░░░░░░  55% → 70%
Day 5: ░░░░░░░░░░░░░░░░░░░░  70% → 80%
Day 6: ░░░░░░░░░░░░░░░░░░░░  80% → 95%
Day 7: ░░░░░░░░░░░░░░░░░░░░  95% → 100% 🎉
```

---

## 💡 TIPS

- Work when you're fresh
- One day at a time
- Test frequently
- Commit working states
- Take breaks
- Ask for help if stuck

---

**Last Updated**: June 3, 2026  
**Current Day**: Day 0 Complete ✅  
**Next Day**: Day 1 (whenever you're ready)

