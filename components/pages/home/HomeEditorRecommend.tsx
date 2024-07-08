import Image from 'next/image';
import { IconLogo } from 'public/icons';

const HomeEditorRecommend = () => {
  return (
    <div className='flex w-full justify-center bg-gray-100 py-124'>
      <div className='flex max-w-412 flex-col gap-36 '>
        <IconLogo />
        <div className='flex flex-col gap-8'>
          <h1 className='text-32 font-800'>
            2024 상반기 결산 <br />
            공간이음 에디터 추천
          </h1>
          <span className='text-16 font-400'>
            공간이음 에디터가 선별한 인기 건무을 확인해 보세요!
          </span>
        </div>
        <div className='flex justify-center'>
          <Image
            src={'/images/home-editor-recommend-image.png'}
            alt='공간이음 에디터 추천 이미지'
            width={296}
            height={296}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeEditorRecommend;