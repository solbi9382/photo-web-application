import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';
import { Button, InputGroup, Intent } from '@blueprintjs/core';
import store from '../store';
import { rgbDataURL } from '../utils/color';
import DetailDialog from '../components/detail-dialog';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const { photoStore } = store;
  const [item, setItem] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    photoList();
  }, [page]);

  useEffect(() => {
    if (loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            viewMore();
          }
        },
        { threshold: 1 },
      );
      observer.observe(pageEnd.current);
    }
  }, [loading]);

  const photoList = async (): Promise<void> => {
    const result = await photoStore.getPhotoList(page);
    setItem([...item, ...result]);
    setLoading(true);
  };

  const searchPhoto = async (): Promise<void> => {
    if (keyword) {
      const result = await photoStore.searchPhoto(keyword);
      setItem(result.results);
    } else {
      photoList();
    }
  };
  const pageEnd = useRef<any>();
  const viewMore = (): void => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Photo Web Application</title>
        <meta name="description" content="Photo Web Application" />
      </Head>
      <header className={styles.search_section}>
        <InputGroup
          className={styles.keyword}
          placeholder="사진 검색"
          onKeyUp={(e: any) => {
            setKeyword(e.target.value);
          }}
        />
        <Button
          className={styles.search_btn}
          onClick={(): void => {
            searchPhoto();
          }}
        >
          검색
        </Button>
      </header>
      <main className={styles.main}>
        <div className={styles.image_area}>
          {item?.map((i: any, index: number) => {
            return (
              <div key={index} className={styles.image_list}>
                <Image
                  className={styles.image_item}
                  width={500}
                  height={500}
                  src={i.urls?.regular}
                  alt={i.user.username}
                  layout={'intrinsic'}
                  placeholder="blur"
                  blurDataURL={rgbDataURL(1, 1, 1)}
                />
                <div
                  className={styles.user_area}
                  onClick={(): void => {
                    window.open(`${i.user.links.html}`);
                  }}
                >
                  <Image
                    width={32}
                    height={32}
                    src={i.user.profile_image.small}
                    alt={i.user.username}
                  />
                  <p>{i.user.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <footer className={styles.footer}>
        <button onClick={viewMore} ref={pageEnd}>
          more
        </button>
      </footer>
      {showDetailDialog && (
        <DetailDialog
          setShowDialog={(value: boolean): void => {
            setShowDetailDialog(value);
          }}
        ></DetailDialog>
      )}
    </div>
  );
};

export default Home;
