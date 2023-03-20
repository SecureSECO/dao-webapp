import { HeaderCard } from '@/src/components/ui/HeaderCard';

const Community = () => {
  return (
    <div className="flex flex-col gap-6">
      <HeaderCard
        title="Community"
        btnLabel="New members"
        btnOnClick={() => console.log('New members Clicked')}
      >
        <div>8 members</div>
      </HeaderCard>
    </div>
  );
};

export default Community;
