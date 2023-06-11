import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { MainCard } from '@/src/components/ui/MainCard';
import { HiArrowsRightLeft } from 'react-icons/hi2';

const Swap = () => {
  return (
    <div className="w-full min-h-full flex items-center justify-center">
      <MainCard
        header="Swap"
        icon={HiArrowsRightLeft}
        className="max-w-[40rem]"
      >
        <form>
          <Input type="number" />
          <Button type="submit" className="w-full">
            Swap
          </Button>
        </form>
      </MainCard>
    </div>
  );
};
export default Swap;
