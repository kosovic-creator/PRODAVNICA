import Baner from './Baner';
import { Suspense } from 'react';
import BannerSkeleton from './components/BannerSkeleton';

export default async function BannerPage() {
  return (
    <Suspense fallback={<BannerSkeleton />}>
      <Baner />
    </Suspense>
  );
}