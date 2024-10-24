import { useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import governmentIdTypes from "../../data/governmentId.json"; // Adjust the path as needed

export default function CustomForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthdate: "",
    address: "",
    governmentIdType: "", // New field for government ID type
    governmentIdImage: null, // To store the uploaded government ID image
    profileImage: null, // To store the uploaded profile image
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value, // Handle file upload
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      gender,
      birthdate,
      address,
      governmentIdType,
      governmentIdImage,
      profileImage,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !gender ||
      !birthdate ||
      !address ||
      !governmentIdType ||
      !governmentIdImage ||
      !profileImage
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    // Handle form submission logic here
    console.log("Submitted:", formData);
  };

  return (
    <Flex
      as="form"
      direction="column"
      width="100%"
      maxWidth="600px"
      margin="auto"
      spacing={4}
      onSubmit={handleSubmit}
    >
      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstName"
          placeholder="First name"
          size="lg"
          variant="outline"
          value={formData.firstName}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastName"
          placeholder="Last name"
          size="lg"
          variant="outline"
          value={formData.lastName}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          placeholder="Email"
          size="lg"
          variant="outline"
          value={formData.email}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Gender</FormLabel>
        <Select
          name="gender"
          placeholder="Select gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Birthdate</FormLabel>
        <Input
          name="birthdate"
          type="date"
          size="lg"
          variant="outline"
          value={formData.birthdate}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Address</FormLabel>
        <Input
          name="address"
          placeholder="Address"
          size="lg"
          variant="outline"
          value={formData.address}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Government ID Type</FormLabel>
        <Select
          name="governmentIdType"
          placeholder="Select government ID type"
          value={formData.governmentIdType}
          onChange={handleChange}
        >
          {governmentIdTypes.map((id) => (
            <option key={id.value} value={id.value}>
              {id.label}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Upload Government ID Image</FormLabel>
        <Input
          name="governmentIdImage"
          type="file"
          accept="image/*" // Accept image files only
          size="lg"
          variant="outline"
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!error}>
        <FormLabel>Upload Profile Verification Image</FormLabel>
        <Input
          name="profileImage"
          type="file"
          accept="image/*" // Accept image files only
          size="lg"
          variant="outline"
          onChange={handleChange}
        />
      </FormControl>

      {/* Updated Button with custom color palette */}
      <Button
        type="submit"
        bg="#0084FF"
        color="white"
        size="lg"
        _hover={{ bg: "#005FCC" }} // Darker blue for hover effect
      >
        Submit
      </Button>
    </Flex>
  );
}
