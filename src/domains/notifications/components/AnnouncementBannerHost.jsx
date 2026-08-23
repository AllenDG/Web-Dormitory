import useAnnouncementStore from '../../../shared/stores/useAnnouncementStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import AnnouncementBanner from './AnnouncementBanner';

/**
 * Wires the previously-orphaned AnnouncementBanner to the announcement
 * store — renders the single most recent, unexpired, undismissed
 * warning/error broadcast targeted at the logged-in user's role. Mounted
 * in OwnerLayout and TenantLayout (Admin sends broadcasts, never receives
 * its own).
 */
const AnnouncementBannerHost = () => {
  const { user } = useAuth();
  const announcement = useAnnouncementStore((state) =>
    user ? state.getActiveBannerAnnouncement(user.email, user.role) : null
  );
  const dismissAnnouncement = useAnnouncementStore((state) => state.dismissAnnouncement);

  if (!announcement || !user) return null;

  return (
    <AnnouncementBanner
      type={announcement.severity}
      message={announcement.message}
      onClose={() => dismissAnnouncement(announcement.id, user.email)}
    />
  );
};

export default AnnouncementBannerHost;
