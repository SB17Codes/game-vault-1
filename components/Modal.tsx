import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshots: string[];
  initialIndex: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  screenshots,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen || !screenshots.length) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : screenshots.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((nextIndex) =>
      nextIndex < screenshots.length - 1 ? nextIndex + 1 : 0
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg overflow-hidden max-w-4xl max-h-screen relative">
        <img
          src={screenshots[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          className="w-full object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={handlePrev}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-white text-sm">
            {currentIndex + 1} / {screenshots.length}
          </span>
          <button
            onClick={handleNext}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
