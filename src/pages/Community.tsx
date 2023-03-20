import { Button } from '@/src/components/ui/Button';
import { HeaderCard } from '@/src/components/ui/HeaderCard';

const Community = () => {
  return (
    <div className="flex flex-col gap-6">
      <HeaderCard
        title="Community"
        aside={
          <Button
            label="New members"
            onClick={() => console.log('New members Clicked')}
          />
        }
      >
        <div>8 members</div>
      </HeaderCard>
    </div>
  );
};

export default Community;
