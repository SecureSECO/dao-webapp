import { AragonSDKWrapper } from '@/src/context/AragonSDK';

export const addAragonSDKDecorator = (Story: any) => {
  return (
    <AragonSDKWrapper>
      <Story />
    </AragonSDKWrapper>
  );
};
