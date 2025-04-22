import React, { useState } from 'react';
import Button from '@mui/material/Button';

const styles = {
  carouselContainer: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  carouselImage: {
    width: '100%',
    height : '600px',
    transition: 'transform 0.5s ease',
  },
  prevButton: {
    position: 'absolute',
    top: '50%',
    left: "3%",
    transform: 'translateY(-50%)',
    fontSize : '20px',
    fontWeight : 'bold',
    borderRadius : "80%"
  },
  nextButton: {
    position: 'absolute',
    top: '50%',
    right: "3%",
    transform: 'translateY(-50%)',
    fontSize : '20px',
    fontWeight : 'bold',
    borderRadius : "80%"
  },
}

const Carousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div style={styles.carouselContainer} className="dflex jc-around">
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        style={styles.carouselImage}
      />
      <Button
        style={styles.prevButton}
        variant="contained"
        onClick={goToPrevSlide}
      >
        &#8592;
      </Button>
      <Button
        style={styles.nextButton}
        variant="contained"
        onClick={goToNextSlide}
      >
        &#8594;
      </Button>
    </div>
  );
};

export default Carousel;