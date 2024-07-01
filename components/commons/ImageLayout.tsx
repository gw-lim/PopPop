import Image from 'next/image';

// TODO:
// - 클릭했을 때 프리뷰 창 표시

const STYLE = {
  map: 'h-176 text-24',
  description: 'h-480 text-32',
};

type PageType = 'map' | 'description';

const ImageLayout = (props: { imageUrls: string[]; page: PageType }) => {
  const { imageUrls, page } = props;

  return (
    <>
      {imageUrls.length >= 5 && (
        <FiveLayout imageUrls={imageUrls} page={page} />
      )}
      {imageUrls.length === 2 && (
        <TwoLayout imageUrls={imageUrls} page={page} />
      )}
      {imageUrls.length === 1 && (
        <OneLayout imageUrl={imageUrls[0]} page={page} />
      )}
    </>
  );
};

export default ImageLayout;

const FiveLayout = (props: { imageUrls: string[]; page: PageType }) => {
  const { imageUrls, page } = props;

  return (
    <div
      className={`grid w-full flex-shrink-0 grid-cols-4 grid-rows-2 gap-4 ${STYLE[page]}`}
    >
      <div className='relative col-span-2 col-start-1 row-span-2 row-start-1 overflow-hidden rounded-l-16'>
        <Image
          src={imageUrls[0]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
      </div>
      <div className='relative col-start-3 row-start-1 overflow-hidden'>
        <Image
          src={imageUrls[1]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
      </div>
      <div className='relative col-start-4 row-start-1 overflow-hidden rounded-tr-16'>
        <Image
          src={imageUrls[2]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
      </div>
      <div className='relative col-start-3 row-start-2 overflow-hidden'>
        <Image
          src={imageUrls[3]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
      </div>
      <div className='relative col-start-4 row-start-2 overflow-hidden rounded-br-16'>
        <Image
          src={imageUrls[4]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
        {imageUrls.length > 5 && (
          <div className='absolute flex h-full w-full items-center justify-center bg-[rgb(0,0,0)]/50 font-700 text-white'>
            +{imageUrls.length - 4}
          </div>
        )}
      </div>
    </div>
  );
};

const TwoLayout = (props: { imageUrls: string[]; page: PageType }) => {
  const { imageUrls, page } = props;

  return (
    <div
      className={`grid w-full flex-shrink-0 grid-cols-2 gap-4 ${STYLE[page]}`}
    >
      <div className='relative overflow-hidden rounded-l-16'>
        <Image
          src={imageUrls[0]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
      </div>
      <div className='relative overflow-hidden rounded-r-16'>
        <Image
          src={imageUrls[1]}
          fill
          className='object-cover'
          alt='빌딩 사진'
        />
      </div>
    </div>
  );
};

const OneLayout = (props: { imageUrl: string; page: PageType }) => {
  const { imageUrl, page } = props;

  return (
    <div
      style={{ backgroundImage: `url(${imageUrl})` }}
      className={`relative w-full flex-shrink-0 gap-4 overflow-hidden rounded-16 bg-cover bg-center ${STYLE[page]}`}
    >
      <div className='h-full w-full backdrop-blur-md'>
        <div className='relative mx-auto h-full w-852 overflow-hidden'>
          <Image src={imageUrl} fill className='object-cover' alt='빌딩 사진' />
        </div>
      </div>
    </div>
  );
};
