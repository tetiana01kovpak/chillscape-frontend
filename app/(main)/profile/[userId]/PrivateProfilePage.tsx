'use client';

import { useAuthStore } from '@/store/authStore';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PrivateProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PrivateProfilePlaceholder';
import css from './PrivateProfilePage.module.css';

export default function PrivateProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className={css.page}>
      <ProfileInfo
        name={user?.name || ''}
        avatar={user?.avatar}
        articleCount={0}
      />

      <section className={`${css.locations} section`}>
        <div className="container">
          <PrivateProfilePlaceholder />
        </div>
      </section>
    </div>
  );
}
