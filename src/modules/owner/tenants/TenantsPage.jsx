import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import TenantRosterTab from './components/TenantRosterTab';
import InquiriesTab from './components/InquiriesTab';

/**
 * Tenants — a real tenant roster (derived from confirmed/completed
 * bookings) with the inquiry inbox folded in as a secondary tab, so
 * nothing from the old inquiry-only page is lost.
 */
const TenantsPage = () => {
  return (
    <Box>
      <PageBanner title="Tenants" subtitle="Manage your tenants and incoming inquiries" />

      <Tabs colorScheme="primary">
        <TabList>
          <Tab>Tenants</Tab>
          <Tab>Inquiries</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} pt={6}>
            <TenantRosterTab />
          </TabPanel>
          <TabPanel px={0} pt={6}>
            <InquiriesTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TenantsPage;
