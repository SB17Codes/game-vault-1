"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export default function ScreenshotGallery({
  screenshots,
}: ScreenshotGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {screenshots.map((screenshot, index) => (
          <img
            key={index}
            src={screenshot}
            alt={`Screenshot ${index + 1}`}
            className="rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-200"
            onClick={() => openModal(index)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        screenshots={screenshots}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
