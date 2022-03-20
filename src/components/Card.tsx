import { CSSProperties, FC, useState } from 'react';
import useStore from '../hooks/useStore'
import { MECollection } from '../global'
import { THUMB_SIZE } from "../constants"
import Image from 'next/image';

export const Card: FC<{ collection: MECollection; }> = ({ collection }) => {
  const imageBaseUrl = useStore.getState().imageBaseUrl;
  const [loaded, setLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const loadingBg: CSSProperties = loaded
    ? {
      width: `${THUMB_SIZE}px`,
      height: `${THUMB_SIZE}px`,
      backgroundColor: '#fff',
    }
    : {
      width: `${THUMB_SIZE}px`,
      height: `${THUMB_SIZE}px`,
      backgroundImage: 'url(/loading.webp)',
      backgroundSize: `${THUMB_SIZE}px ${THUMB_SIZE}px`,
    }
  let url = collection.image ?? ``;
  if (!/^https:\/\/pbs\.twimg\.com\//.test(url)) {
    if (url?.indexOf('?') < 0) {
      url = `${imageBaseUrl}/${url}?tx=w_${THUMB_SIZE},h_${THUMB_SIZE}`;
    } else {
      url = `${imageBaseUrl}/${url}&tx=w_${THUMB_SIZE},h_${THUMB_SIZE}`;
    }
  }
  return (
    <div className='flex' style={loadingBg}>
      {isError ? (
        <Image
          src={collection.image ?? ``}
          alt={collection.name ?? ``}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
          unoptimized />
      ) : (
        <Image
          src={`${url}`}
          alt={collection.name ?? ``}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)} />
      )}
    </div>
  );
};
