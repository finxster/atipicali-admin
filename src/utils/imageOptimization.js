/**
 * Image optimization utility
 * Provides functions to optimize images for web display
 */

/**
 * Get optimized image URL with size constraints
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width in pixels (default: 400)
 * @param {number} height - Desired height in pixels (default: null for auto)
 * @returns {string} - Optimized image URL or original if not applicable
 */
export const getOptimizedImageUrl = (imageUrl, width = 400, height = null) => {
  if (!imageUrl) return null

  try {
    const url = new URL(imageUrl)
    
    // For external images, return original URL with CSS-based sizing
    // In the future, when storing images on backend, we can use sharp/imagemin
    return imageUrl
  } catch (e) {
    // If URL parsing fails, return original
    return imageUrl
  }
}

/**
 * Get responsive image srcset for different screen sizes
 * Returns image URLs for 1x, 2x pixel densities and different breakpoints
 * @param {string} imageUrl - Original image URL
 * @returns {object} - Object with srcset and sizes for responsive images
 */
export const getResponsiveImageSet = (imageUrl) => {
  if (!imageUrl) return { src: null, srcSet: '', sizes: '' }

  return {
    src: imageUrl,
    srcSet: `${imageUrl} 1x, ${imageUrl} 2x`,
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
  }
}

/**
 * Estimate image file size from URL by making a HEAD request
 * @param {string} imageUrl - Image URL to check
 * @returns {Promise<number>} - File size in bytes, or null if unable to determine
 */
export const getImageFileSize = async (imageUrl) => {
  if (!imageUrl) return null

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    const contentLength = response.headers.get('content-length')
    return contentLength ? parseInt(contentLength, 10) : null
  } catch (e) {
    console.warn('Could not determine image size:', e)
    return null
  }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) return 'Unknown'
  
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

/**
 * Check if image size is acceptable
 * @param {number} bytes - File size in bytes
 * @param {number} maxSizeMB - Maximum allowed size in MB (default: 5)
 * @returns {object} - { isAcceptable: boolean, size: string, maxSize: string }
 */
export const checkImageSize = (bytes, maxSizeMB = 5) => {
  const maxBytes = maxSizeMB * 1024 * 1024
  const isAcceptable = bytes <= maxBytes
  
  return {
    isAcceptable,
    size: formatFileSize(bytes),
    maxSize: formatFileSize(maxBytes),
    percentage: Math.round((bytes / maxBytes) * 100)
  }
}
