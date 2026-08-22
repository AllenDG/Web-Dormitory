import { useRef, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  IconButton,
  Icon,
  Text,
  Badge,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FiUpload, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MAX_IMAGES = 6;
const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.7;

// Downscales an image file client-side (canvas) before converting to a
// base64 data URL. Without this, a handful of full-resolution phone photos
// would blow past localStorage's ~5-10MB quota and break persistence for
// every store in the app, not just this one property.
function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Multi-image picker with reordering, storing compressed images as base64
 * data URLs directly in `value` (the property's imageUrl array). Images ARE
 * persisted (via the parent form's normal save), just compressed to stay
 * within localStorage's size limits — this is a real client-side gallery,
 * not a demo that discards what you upload.
 */
const ImageUploadField = ({ value = [], onChange }) => {
  const inputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).slice(0, MAX_IMAGES - value.length);
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const compressed = await Promise.all(files.map(compressImageFile));
      onChange([...value, ...compressed]);
    } catch {
      toast({
        title: 'Image Upload Failed',
        description: 'One or more images could not be processed.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveTo = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const next = [...value];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <Box>
      {value.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
          {value.map((src, index) => (
            <Box key={index} position="relative">
              <Image
                src={src}
                alt={`Property photo ${index + 1}`}
                borderRadius="lg"
                objectFit="cover"
                h="120px"
                w="full"
              />
              {index === 0 && (
                <Badge position="absolute" bottom={2} left={2} colorScheme="primary">
                  Cover
                </Badge>
              )}
              <IconButton
                icon={<Icon as={FiX} />}
                size="xs"
                colorScheme="red"
                position="absolute"
                top={2}
                right={2}
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => removeAt(index)}
              />
              <Box position="absolute" bottom={2} right={2} display="flex" gap={1}>
                <IconButton
                  icon={<Icon as={FiChevronLeft} />}
                  size="xs"
                  aria-label="Move photo earlier"
                  isDisabled={index === 0}
                  onClick={() => moveTo(index, -1)}
                />
                <IconButton
                  icon={<Icon as={FiChevronRight} />}
                  size="xs"
                  aria-label="Move photo later"
                  isDisabled={index === value.length - 1}
                  onClick={() => moveTo(index, 1)}
                />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Button
        leftIcon={<Icon as={FiUpload} />}
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        isLoading={isProcessing}
        loadingText="Processing..."
        isDisabled={value.length >= MAX_IMAGES}
      >
        {value.length >= MAX_IMAGES ? 'Maximum photos reached' : 'Upload Photos'}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Text fontSize="xs" color="gray.500" mt={2}>
        Up to {MAX_IMAGES} photos, compressed and stored in your browser (this app has no file
        server). First photo is the cover.
      </Text>
    </Box>
  );
};

export default ImageUploadField;
