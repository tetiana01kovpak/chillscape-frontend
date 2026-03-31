'use client';

import { useEffect, useState } from 'react';
import { getUserById } from '@/lib/clientApi';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PublicProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PublicProfilePlaceholder';
import type { User } from '@/types/user';
import css from './PublicProfilePage.module.css';

interface PublicProfilePageProps {
  userId: string;
}

export default function PublicProfilePage({ userId }: PublicProfilePageProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    getUserById(userId)
      .then(setProfileUser)
      .catch(() => setProfileUser(null));
  }, [userId]);

  return (
    <div className={css.page}>
      <ProfileInfo
        name={profileUser?.name || ''}
        avatar={profileUser?.avatar}
        articleCount={0}
      />

      <section className={`${css.locations} section`}>
        <div className="container">
          <h2 className={css.heading}>Локації</h2>
          <PublicProfilePlaceholder />
        </div>
      </section>
    </div>
  );
}
