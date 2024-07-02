import Image from 'next/image';
import { Dispatch, SetStateAction, SyntheticEvent, useEffect } from 'react';
import { IconArrowLeft, IconArrowRight, IconClose } from 'public/icons';
import PortalModal from './PortalModal';

const ImagePreview = (props: {
  urls: string[];
  index: number;
  setIndex: Dispatch<SetStateAction<number | null>>;
}) => {
  const { urls, index, setIndex } = props;

  const closeImagePreview = () => {
    setIndex(null);
  };

  const hasNext = index < urls.length - 1;
  const hasPrevious = index > 0;

  const handleNext = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (!hasNext) {
      return;
    }
    setIndex((prev) => prev! + 1);
  };
  const handlePrevious = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (!hasPrevious) {
      return;
    }
    setIndex((prev) => prev! - 1);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <PortalModal>
      <div
        onClick={closeImagePreview}
        className='fixed bottom-0 left-0 right-0 top-0 z-popup overflow-hidden bg-[rgba(0,0,0,0.7)]'
      >
        <button className='fixed right-16 top-16'>
          <IconClose />
        </button>
        <button
          onClick={handleNext}
          className={`fixed right-32 top-1/2 -translate-y-1/2 ${hasNext ? '' : 'opacity-25'}`}
        >
          <IconArrowRight />
        </button>
        <button
          onClick={handlePrevious}
          className={`fixed left-32 top-1/2 -translate-y-1/2 ${hasPrevious ? '' : 'opacity-25'}`}
        >
          <IconArrowLeft />
        </button>
        <div className='fixed bottom-32 left-1/2 -translate-x-1/2 text-16 text-white'>
          ( {index + 1} / {urls.length} )
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className='fixed left-1/2 top-1/2 h-700 w-1000 -translate-x-1/2 -translate-y-1/2'
        >
          <Image
            src={urls[index]}
            alt='건물 사진'
            fill
            className='object-contain'
          />
        </div>
      </div>
    </PortalModal>
  );
};

export default ImagePreview;