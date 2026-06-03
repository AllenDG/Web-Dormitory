import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  SimpleGrid,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Badge,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import {
  FiUpload,
  FiTrash2,
  FiDownload,
  FiEdit,
  FiMoreVertical,
  FiImage,
  FiVideo,
  FiStar,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Media Library Component
 * Manage property photos and videos
 */

const MediaItem = ({ media, onDelete, onSetPrimary, onEdit, isPrimary }) => {
  return (
    <Box
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      border="2px"
      borderColor={isPrimary ? 'primary.600' : 'gray.200'}
      transition="all 0.2s"
      _hover={{ borderColor: 'primary.400', transform: 'scale(1.02)' }}
    >
      {/* Primary Badge */}
      {isPrimary && (
        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme="yellow"
          zIndex={2}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Icon as={FiStar} boxSize={3} />
          <Text>Primary</Text>
        </Badge>
      )}

      {/* Media Preview */}
      {media.type === 'image' ? (
        <Image
          src={media.url}
          alt={media.caption}
          w="full"
          h="200px"
          objectFit="cover"
        />
      ) : (
        <Box
          w="full"
          h="200px"
          bg="gray.900"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FiVideo} boxSize={12} color="white" />
        </Box>
      )}

      {/* Actions Overlay */}
      <Box
        position="absolute"
        top={0}
        right={0}
        p={2}
      >
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={FiMoreVertical} />}
            size="sm"
            bg="whiteAlpha.900"
            _hover={{ bg: 'white' }}
          />
          <MenuList>
            {!isPrimary && (
              <MenuItem
                icon={<Icon as={FiStar} />}
                onClick={() => onSetPrimary(media)}
              >
                Set as Primary
              </MenuItem>
            )}
            <MenuItem icon={<Icon as={FiEdit} />} onClick={() => onEdit(media)}>
              Edit Details
            </MenuItem>
            <MenuItem icon={<Icon as={FiDownload} />}>
              Download
            </MenuItem>
            <MenuItem
              icon={<Icon as={FiTrash2} />}
              color="error.500"
              onClick={() => onDelete(media)}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* Caption */}
      {media.caption && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={3}
          bg="blackAlpha.700"
        >
          <Text color="white" fontSize="sm" noOfLines={1}>
            {media.caption}
          </Text>
        </Box>
      )}
    </Box>
  );
};

const MediaLibrary = ({ propertyId }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - replace with actual API
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      caption: 'Main entrance',
      isPrimary: true,
      uploadDate: '2026-06-01',
    },
    {
      id: 2,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      caption: 'Living room',
      isPrimary: false,
      uploadDate: '2026-06-01',
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400',
      caption: 'Bedroom',
      isPrimary: false,
      uploadDate: '2026-06-01',
    },
    {
      id: 4,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
      caption: 'Kitchen',
      isPrimary: false,
      uploadDate: '2026-06-02',
    },
    {
      id: 5,
      type: 'video',
      url: '/videos/property-tour.mp4',
      caption: 'Property walkthrough',
      isPrimary: false,
      uploadDate: '2026-06-02',
    },
    {
      id: 6,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      caption: 'Bathroom',
      isPrimary: false,
      uploadDate: '2026-06-03',
    },
  ]);

  const [editForm, setEditForm] = useState({ caption: '' });

  const handleDelete = (media) => {
    if (media.isPrimary) {
      toast({
        title: 'Cannot Delete',
        description: 'Cannot delete the primary image. Set another image as primary first.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (window.confirm(`Delete "${media.caption}"?`)) {
      setMediaItems(mediaItems.filter((m) => m.id !== media.id));
      toast({
        title: 'Media Deleted',
        status: 'success',
        duration: 2000,
      });
    }
  };

  const handleSetPrimary = (media) => {
    setMediaItems(
      mediaItems.map((m) => ({
        ...m,
        isPrimary: m.id === media.id,
      }))
    );
    toast({
      title: 'Primary Image Updated',
      description: `"${media.caption}" is now the primary image.`,
      status: 'success',
      duration: 2000,
    });
  };

  const handleEdit = (media) => {
    setSelectedMedia(media);
    setEditForm({ caption: media.caption });
    onOpen();
  };

  const handleSaveEdit = () => {
    setMediaItems(
      mediaItems.map((m) =>
        m.id === selectedMedia.id ? { ...m, caption: editForm.caption } : m
      )
    );
    toast({
      title: 'Caption Updated',
      status: 'success',
      duration: 2000,
    });
    onClose();
  };

  const handleUpload = () => {
    toast({
      title: 'Upload Feature',
      description: 'File upload will be integrated with backend.',
      status: 'info',
      duration: 3000,
    });
  };

  const images = mediaItems.filter((m) => m.type === 'image');
  const videos = mediaItems.filter((m) => m.type === 'video');

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Media Library
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Manage property photos and videos
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={FiUpload} />}
          colorScheme="primary"
          size="sm"
          onClick={handleUpload}
        >
          Upload Media
        </Button>
      </HStack>

      {/* Stats */}
      <HStack spacing={4} mb={6}>
        <Box bg="blue.50" px={4} py={2} borderRadius="lg">
          <HStack spacing={2}>
            <Icon as={FiImage} color="blue.600" />
            <Text fontSize="sm" fontWeight="semibold">
              {images.length} Photos
            </Text>
          </HStack>
        </Box>
        <Box bg="purple.50" px={4} py={2} borderRadius="lg">
          <HStack spacing={2}>
            <Icon as={FiVideo} color="purple.600" />
            <Text fontSize="sm" fontWeight="semibold">
              {videos.length} Videos
            </Text>
          </HStack>
        </Box>
      </HStack>

      {/* Tabs */}
      <Tabs
        colorScheme="primary"
        index={activeTab}
        onChange={setActiveTab}
      >
        <TabList>
          <Tab>All Media ({mediaItems.length})</Tab>
          <Tab>Photos ({images.length})</Tab>
          <Tab>Videos ({videos.length})</Tab>
        </TabList>

        <TabPanels>
          {/* All Media */}
          <TabPanel px={0} pt={6}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {mediaItems.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  isPrimary={media.isPrimary}
                  onDelete={handleDelete}
                  onSetPrimary={handleSetPrimary}
                  onEdit={handleEdit}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Photos Only */}
          <TabPanel px={0} pt={6}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {images.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  isPrimary={media.isPrimary}
                  onDelete={handleDelete}
                  onSetPrimary={handleSetPrimary}
                  onEdit={handleEdit}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Videos Only */}
          <TabPanel px={0} pt={6}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {videos.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  isPrimary={media.isPrimary}
                  onDelete={handleDelete}
                  onSetPrimary={handleSetPrimary}
                  onEdit={handleEdit}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Media Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {selectedMedia && (
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.caption}
                  w="full"
                  h="200px"
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <FormControl>
                <FormLabel fontSize="sm">Caption</FormLabel>
                <Input
                  value={editForm.caption}
                  onChange={(e) =>
                    setEditForm({ ...editForm, caption: e.target.value })
                  }
                  placeholder="Enter caption"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MediaLibrary;
