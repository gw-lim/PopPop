import { useQuery } from '@tanstack/react-query';
import { NO_IMAGE_URL, ROOT_IMAGE_URL } from 'constants/common';
import Image from 'next/image';
import Link from 'next/link';
import { getBuildingInfo, getUserContact } from 'apis/api';
import { UserContactType } from 'types/client.types';
import { IconArrowRight } from 'public/icons';

const ContactTab = () => {
  const { data: contacts } = useQuery({
    queryKey: ['user', 'contact'],
    queryFn: getUserContact,
  });

  return (
    <div className='grid min-h-400 w-full grid-cols-2 gap-12'>
      {contacts?.map((contact) => (
        <MyContact key={contact._id} contact={contact} />
      ))}
    </div>
  );
};

const MyContact = (props: { contact: UserContactType }) => {
  const { contact } = props;
  const { data: buildingInfo } = useQuery({
    queryKey: ['user', 'contact-building', contact._id],
    queryFn: () => getBuildingInfo(contact.buildingId),
    enabled: !!contact.buildingId,
  });

  const imageUrls = buildingInfo?.img
    ?.split(', ')
    ?.map((url) => ROOT_IMAGE_URL + url);

  return (
    <div className='flex h-180 w-full items-center gap-16 rounded-12 border border-gray-200 p-16'>
      <Link href={`/list/${contact.buildingId}`} legacyBehavior passHref>
        <a
          target='_blank'
          className='relative aspect-square h-full overflow-hidden rounded-8'
        >
          <Image
            src={imageUrls?.[0] ?? NO_IMAGE_URL}
            alt='빌딩 사진'
            fill
            className='object-cover'
          />
        </a>
      </Link>
      <div className='flex flex-col gap-8'>
        <div className='h-20 text-14 text-gray-300'>
          접수일: {contact.addedDate.split(' ')?.[0]}
        </div>

        <Link href={`/list/${contact.buildingId}`} legacyBehavior passHref>
          <a
            target='_blank'
            className='h-32 text-20 font-500 underline underline-offset-2'
          >
            {buildingInfo?.name}
          </a>
        </Link>
        <div className='h-20 text-gray-400'>{buildingInfo?.address}</div>
      </div>
      <button className='ml-auto flex items-center text-[#7799ff]'>
        상세보기
        <IconArrowRight stroke={'#7799ff'} width={16} stroke-width={2} />
      </button>
    </div>
  );
};

export default ContactTab;