import {
  Box,
  useColorModeValue,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import SearchFilter from "../components/ui/SearchFilter";
import TenantsTable from "../components/tables/TenantsTable";
import tenantsData from "../data/tenants.json";

export default function OwnerTenantsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState(tenantsData);
  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 2;

  const handleStatusChange = (index, newStatus) => {
    const updatedTenants = tenants.map((tenant, i) =>
      i === index ? { ...tenant, status: newStatus } : tenant
    );
    setTenants(updatedTenants);
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(
    indexOfFirstTenant,
    indexOfLastTenant
  );

  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  return (
    <Box direction="column" minH="100vh" bgColor={bgColor} p={8}>
      {/* Page Heading and Add Rentals Button */}
      <Flex justify="space-between" mb={6} align="center">
        <Heading size="lg" fontWeight="bold">
          Manage Tenants
        </Heading>
      </Flex>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <TenantsTable
        currentTenants={currentTenants}
        handleStatusChange={handleStatusChange}
        cardBgColor={bgColor}
      />
    </Box>
  );
}
