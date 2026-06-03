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
  Badge,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import {
  FiUpload,
  FiTrash2,
  FiEye,
  FiStar,
  FiImage,
  FiVideo,
  FiDownload,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Media Library Component
 * Upload, manage, and organize property photos and videos
 */

const MediaItem = ({ media, isSelected, onSelect, onDelete, onSetPrimary, onPreview }) => {
  return (
    <Box
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      border="2px"
      borderColor={isSelected ? 'primary.500' : 'gray.200'}
      bg="white"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
    >
      {/* Selection Checkbox */}
      <Checkbox
        position="absolute"
        top={2}
        left={2}
        zIndex={2}
        isChecked={isSelected}
        onChange={onSelect}
        bg="white"
        borderRadius="md"
      />

      {/* Primary Badge */}
      {media.isPrimary && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          colorScheme="yellow"
          fontSize="xs"
        >
          <HStack spacing={1}>
            <Icon as={FiStar} boxSize={3} />
            <Text>Primary</Text>
          </HStack>
        </Badge>
      )}

      {/* Media Preview */}
      <Box
        position="relative"
        h="200px"
        bg="gray.100"
        cursor="pointer"
        onClick={onPreview}
      >
        {media.type === 'image' ? (
          <Image
            src={media.url}
            alt={media.name}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : (
          <VStack justify="center" h="full">
            <Icon as={FiVideo} boxSize={12} color="gray.400" />
            <Text fontSize="sm" color="gray.600">Video</Text>
          </VStack>
        )}
      </Box>

      {/* Actions Overlay */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="blackAlpha.700"
        p={2}
        opacity={0}
        transition="opacity 0.2s"
        _groupHover={{ opacity: 1 }}
        role="group"
      >
        <HStack justify="space-between">
          <HStack spacing={1}>
            <IconButton
              icon={<Icon as={FiEye} />}
              size="sm"
              colorScheme="whiteAlpha"
              onClick={onPreview}
              aria-label="Preview"
            />
            {!media.isPrimary && (
              <IconButton
                icon={<Icon as={FiStar} />}
                size="sm"
                colorScheme="whiteAlpha"
                onClick={onSetPrimary}
                aria-label="Set as primary"
              />
            )}
          </HStack>
          <IconButton
            icon={<Icon as={FiTrash2} />}
            size="sm"
            colorScheme="red"
            onClick={onDelete}
            aria-label="Delete"
          />
        </HStack>
      </Box>

      {/* Info */}
      <Box p={3} bg="white">
        <Text fontSize="xs" fontWeight="semibold" noOfLines={1}>
          {media.name}
        </Text>
        <Text fontSize="xs" color="gray.600">
          {media.size} • {media.uploadDate}
        </Text>
      </Box>
    </Box>
  );
};

const MediaLibrary = ({ propertyId }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Mock data - replace with actual API
  const [mediaItems, setMediaItems] = useState({
    images: [
      {
        id: 1,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        name: 'bedroom_1.jpg',
        size: '2.4 MB',
        uploadDate: 'Jun 1, 2026',
        isPrimary: true,
      },
      {
        id: 2,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        name: 'living_room.jpg',
        size: '1.8 MB',
        uploadDate: 'Jun 1, 2026',
        isPrimary: false,
      },
      {
        id: 3,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
        name: 'kitchen.jpg',
        size: '2.1 MB',
        uploadDate: 'Jun 2, 2026',
        isPrimary: false,
      },
      {
        id: 4,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=800',
        name: 'bathroom.jpg',
        size: '1.5 MB',
        uploadDate: 'Jun 2, 2026',
        isPrimary: false,
      },
    ],
    videos: [
      {
        id: 5,
        type: 'video',
        url: '/videos/property_tour.mp4',
        name: 'property_tour.mp4',
        size: '45.2 MB',
        uploadDate: 'Jun 3, 2026',
        isPrimary: false,
      },
    ],
  });

  const handleSelect = (id, type) => {
    const key = `${type}-${id}`;
    if (selectedMedia.includes(key)) {
      setSelectedMedia(selectedMedia.filter((item) => item !== key));
    } else {
      setSelectedMedia([...selectedMedia, key]);
    }
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Delete this media item?')) {
      const category = type === 'image' ? 'images' : 'videos';
      setMediaItems({
        ...mediaItems,
        [category]: mediaItems[category].filter((item) => item.id !== id),
      });
      toast({
        title: 'Media Deleted',
        description: 'Media item has been removed.',
        status: 'success',
        duration: 3000,
      });
    }
  };

  const handleSetPrimary = (id, type) => {
    const category = type === 'image' ? 'images' : 'videos';
    setMediaItems({
      ...mediaItems,
      [category]: mediaItems[category].map((item) => ({
        ...item,
        isPrimary: item.id === id,
      })),
    });
    toast({
      title: 'Primary Photo Updated',
      description: 'This photo will be shown first in listings.',
      status: 'success',
      duration: 3000,
    });
  };

  const handleBulkDelete = () => {
    if (selectedMedia.length === 0) return;
    if (window.confirm(`Delete ${selectedMedia.length} selected items?`)) {
      // Implement bulk delete logic
      setSelectedMedia([]);
      toast({
        title: 'Media Deleted',
        description: `${selectedMedia.length} items removed.`,
        status: 'success',
        duration: 3000,
      });
    }
  };

  const handlePreview = (media) => {
    setPreviewMedia(media);
    onOpen();
  };

  const totalImages = mediaItems.images.length;
  const totalVideos = mediaItems.videos.length;
  const totalSize = '52.0 MB'; // Mock calculation

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Media Library
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Manage photos and videos for your property
          </Text>
        </Box>
        <HStack spacing={3}>
          {selectedMedia.length > 0 && (
            <Button
              leftIcon={<Icon as={FiTrash2} />}
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
            >
              Delete ({selectedMedia.length})
            </Button>
          )}
          <Button
            leftIcon={<Icon as={FiUpload} />}
            colorScheme="primary"
            size="sm"
          >
            Upload Media
          </Button>
        </HStack>
      </HStack>

      {/* Stats */}
      <SimpleGrid columns={{ base: 3 }} spacing={4} mb={6}>
        <Box bg="primary.50" p={4} borderRadius="lg" textAlign="center">
          <HStack justify="center" mb={1}>
            <Icon as={FiImage} color="primary.600" />
            <Text fontSize="2xl" fontWeight="bold" color="primary.600">
              {totalImages}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.600">Photos</Text>
        </Box>
        <Box bg="purple.50" p={4} borderRadius="lg" textAlign="center">
          <HStack justify="center" mb={1}>
            <Icon as={FiVideo} color="purple.600" />
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {totalVideos}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.600">Videos</Text>
        </Box>
        <Box bg="gray.50" p={4} borderRadius="lg" textAlign="center">
          <HStack justify="center" mb={1}>
            <Icon as={FiDownload} color="gray.600" />
            <Text fontSize="2xl" fontWeight="bold" color="gray.600">
              {totalSize}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.600">Total Size</Text>
        </Box>
      </SimpleGrid>

      {/* Tabs */}
      <Tabs colorScheme="primary">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FiImage} />
              <Text>Photos ({totalImages})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FiVideo} />
              <Text>Videos ({totalVideos})</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Photos Tab */}
          <TabPanel px={0} py={6}>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              {mediaItems.images.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  isSelected={selectedMedia.includes(`image-${media.id}`)}
                  onSelect={() => handleSelect(media.id, 'image')}
                  onDelete={() => handleDelete(media.id, 'image')}
                  onSetPrimary={() => handleSetPrimary(media.id, 'image')}
                  onPreview={() => handlePreview(media)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Videos Tab */}
          <TabPanel px={0} py={6}>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              {mediaItems.videos.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  isSelected={selectedMedia.includes(`video-${media.id}`)}
                  onSelect={() => handleSelect(media.id, 'video')}
                  onDelete={() => handleDelete(media.id, 'video')}
                  onSetPrimary={() => handleSetPrimary(media.id, 'video')}
                  onPreview={() => handlePreview(media)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{previewMedia?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewMedia?.type === 'image' ? (
              <Image
                src={previewMedia.url}
                alt={previewMedia.name}
                w="full"
                borderRadius="lg"
              />
            ) : (
              <video
                src={previewMedia?.url}
                controls
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Text fontSize="sm" color="gray.600">
                {previewMedia?.size} • {previewMedia?.uploadDate}
              </Text>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MediaLibrary;
