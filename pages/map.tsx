import { GUNGU, GUNGU_COORD, GunguType } from 'constants/regions';
import { BUILDINGS_MOCK_DATA } from 'mock/popup';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useKakaoMap from 'hooks/useKakaoMap';
import { BuildingType } from 'types/client.types';
import Tab from 'components/pages/map/Tab';

export const getServerSideProps = async () => {
  const buildings = BUILDINGS_MOCK_DATA;

  // const res = await instance.get('/building/infos');
  // const buildings = res.data;

  return {
    props: {
      buildings,
    },
  };
};

const HOT_PLACE_COLOR = [
  'bg-[#fffae1]',
  'bg-[#ffea75]',
  'bg-[#ffa53d]',
  'bg-[#ff6338]',
  'bg-[#ff370f]',
];

interface Props {
  buildings: BuildingType[];
}

const MapPage = ({ buildings }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const initMap = () => {
    window.kakao?.maps?.load(() => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.545, 126.91),
        level: 8,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      const buildingMarkers: any[] = [];

      buildings.forEach((building) => {
        const coord = building.coord.split(', ');
        const position = new window.kakao.maps.LatLng(coord[0], coord[1]);
        const marker = new window.kakao.maps.Marker({
          map,
          position,
          clickable: true,
        });
        window.kakao.maps.event.addListener(marker, 'click', () => {
          router.push({ query: { building: building._id } });
        });
        buildingMarkers.push(marker);
        marker.setMap(null);
      });

      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const zoomLevel = map.getLevel();

        if (zoomLevel <= 6) {
          buildingMarkers.forEach((marker) => {
            marker.setMap(map);
          });
        } else {
          buildingMarkers.forEach((marker) => {
            marker.setMap(null);
          });
        }
      });

      const hotRate = getHotRate(buildings);

      const gunguMarkers: any[] = [];
      const gunguOverlays: any[] = [];

      GUNGU.forEach((gungu) => {
        const popupCnt = hotRate[gungu];
        if (popupCnt === 0) {
          return;
        }

        const coord = new window.kakao.maps.LatLng(
          GUNGU_COORD[gungu][0],
          GUNGU_COORD[gungu][1],
        );

        const marker = new window.kakao.maps.Marker({
          map,
          position: coord,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          map.setLevel(6);
          map.setCenter(coord);
          router.push({
            query: {
              as: '지역명',
              q: gungu,
            },
          });
        });

        gunguMarkers.push(marker);
        marker.setMap(map);

        const hotColor =
          popupCnt <= 10
            ? HOT_PLACE_COLOR[0]
            : popupCnt <= 20
              ? HOT_PLACE_COLOR[1]
              : popupCnt <= 40
                ? HOT_PLACE_COLOR[2]
                : popupCnt <= 60
                  ? HOT_PLACE_COLOR[3]
                  : HOT_PLACE_COLOR[4];

        const content =
          `<div class="p-4 border border-black rounded-md ${hotColor}">` +
          gungu +
          ' ' +
          popupCnt +
          '</div>';

        const customOverlay = new window.kakao.maps.CustomOverlay({
          map: map,
          position: coord,
          content: content,
          yAnchor: 2,
        });
        gunguOverlays.push(customOverlay);
        customOverlay.setMap(map);
      });

      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const zoomLevel = map.getLevel();

        if (zoomLevel <= 6) {
          gunguMarkers.forEach((marker) => {
            marker.setMap(null);
          });
          gunguOverlays.forEach((overlay) => {
            overlay.setMap(null);
          });
        } else {
          gunguMarkers.forEach((marker) => {
            marker.setMap(map);
          });
          gunguOverlays.forEach((overlay) => {
            overlay.setMap(map);
          });
        }
      });

      setIsLoading(false);
    });
  };
  useKakaoMap({ callbackFn: initMap });

  // const [address, setAddress] = useState('');

  // const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setAddress(e.target.value);
  // };

  // const handleClick = (e: SyntheticEvent) => {
  //   e.preventDefault();

  //   if (!map) {
  //     return;
  //   }

  //   const placeService = new window.kakao.maps.services.Places();

  //   placeService.keywordSearch(address, (popups: any, status: any) => {
  //     if (status === window.kakao.maps.services.Status.OK) {
  //       const bounds = new window.kakao.maps.LatLngBounds();

  //       for (let i = 0; i < popups.length; i++) {
  //         bounds.extend(new window.kakao.maps.LatLng(popups[i].y, popups[i].x));
  //       }

  //       map.setBounds(bounds);
  //     }
  //   });
  // };

  return (
    <div className='relative flex h-screen w-screen justify-end'>
      <Tab />
      <div id='map' className='h-full w-full' />
    </div>
  );
};

export default MapPage;

const getHotRate = (buildings: BuildingType[]) => {
  const popupsInRegion = {
    강남구: 0,
    강동구: 0,
    강북구: 0,
    강서구: 0,
    관악구: 0,
    광진구: 0,
    구로구: 0,
    금천구: 0,
    노원구: 0,
    도봉구: 0,
    동대문구: 0,
    동작구: 0,
    마포구: 0,
    서대문구: 0,
    서초구: 0,
    성동구: 0,
    성북구: 0,
    송파구: 0,
    양천구: 0,
    영등포구: 0,
    용산구: 0,
    은평구: 0,
    종로구: 0,
    중구: 0,
    중랑구: 0,
  };

  buildings.forEach((building) => {
    const gungu = building.address.split(' ')[1] as GunguType;
    if (!building.popups) {
      return;
    }
    popupsInRegion[gungu] += building.popups.length;
  });

  return popupsInRegion;
};
