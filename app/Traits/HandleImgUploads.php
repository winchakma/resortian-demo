<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

trait HandleImgUploads
{
    /**
     * Upload multiple images
     *
     * @param array|null $images Array of UploadedFile objects
     * @param string $folder Folder name (hotels, rooms, users, etc.)
     * @param string $disk Storage disk (default: 'public')
     * @return array Array of stored image paths
     */
    public function uploadMultipleImages(?array $images, string $folder, string $disk = 'public'): array
    {
        if (empty($images)) {
            return [];
        }

        $imagePaths = [];

        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $imagePaths[] = $this->uploadSingleImage($image, $folder, $disk);
            }
        }

        return $imagePaths;
    }

    /**
     * Upload single image
     *
     * @param UploadedFile $image
     * @param string $folder
     * @param string $disk
     * @return string
     */
    public function uploadSingleImage(UploadedFile $image, string $folder, string $disk = 'public'): string
    {
        // Generate unique filename
        $filename = Str::random(50) . '.' . $image->getClientOriginalExtension();
        
        // Store image in folder: {disk}/{folder}/{filename}
        return $image->storeAs($folder, $filename, $disk);
    }

    /**
     * Delete multiple images from storage
     *
     * @param array|null $imagePaths Array of image paths to delete
     * @param string $disk Storage disk (default: 'public')
     * @return int Number of successfully deleted images
     */
    public function deleteMultipleImages(?array $imagePaths, string $disk = 'public'): int
    {
        if (empty($imagePaths)) {
            return 0;
        }

        $deletedCount = 0;

        foreach ($imagePaths as $imagePath) {
            if ($this->deleteSingleImage($imagePath, $disk)) {
                $deletedCount++;
            }
        }

        return $deletedCount;
    }

    /**
     * Delete single image from storage
     *
     * @param string|null $imagePath
     * @param string $disk
     * @return bool
     */
    public function deleteSingleImage(?string $imagePath, string $disk = 'public'): bool
    {
        if (empty($imagePath)) {
            return false;
        }

        if (Storage::disk($disk)->exists($imagePath)) {
            return Storage::disk($disk)->delete($imagePath);
        }

        return false;
    }

    /**
     * Sync images - add new ones, remove deleted ones
     *
     * @param array|null $currentImages Current stored images (from database)
     * @param array|null $newImages New uploaded images
     * @param array|null $imagesToDelete Image paths to delete
     * @param string $folder Folder name
     * @param string $disk Storage disk
     * @return array Updated image paths array
     */
    public function syncImages(?array $currentImages, ?array $newImages, ?array $imagesToDelete, string $folder, string $disk = 'public'): array
    {
        // Start with current images
        $imagePaths = $currentImages ?? [];

        // Delete requested images
        if (!empty($imagesToDelete)) {
            $this->deleteMultipleImages($imagesToDelete, $disk);
            
            // Remove from array
            foreach ($imagesToDelete as $imageToDelete) {
                if (($key = array_search($imageToDelete, $imagePaths)) !== false) {
                    unset($imagePaths[$key]);
                }
            }
            $imagePaths = array_values($imagePaths); // Reindex
        }

        // Upload new images
        if (!empty($newImages)) {
            $newImagePaths = $this->uploadMultipleImages($newImages, $folder, $disk);
            $imagePaths = array_merge($imagePaths, $newImagePaths);
        }

        return $imagePaths;
    }

    /**
     * Remove all images from a folder (use with caution!)
     *
     * @param string $folder
     * @param string $disk
     * @return bool
     */
    public function deleteAllImagesInFolder(string $folder, string $disk = 'public'): bool
    {
        return Storage::disk($disk)->deleteDirectory($folder);
    }

    /**
     * Get full URL for an image path
     *
     * @param string|null $imagePath
     * @param string $disk
     * @return string|null
     */
    public function getImageUrl(?string $imagePath, string $disk = 'public'): ?string
    {
        if (empty($imagePath)) {
            return null;
        }

        return Storage::url($imagePath);
    }

    /**
     * Get full URLs for multiple image paths
     *
     * @param array|null $imagePaths
     * @param string $disk
     * @return array
     */
    public function getImageUrls(?array $imagePaths, string $disk = 'public'): array
    {
        if (empty($imagePaths)) {
            return [];
        }

        return array_map(function($imagePath) use ($disk) {
            return $this->getImageUrl($imagePath, $disk);
        }, $imagePaths);
    }
}