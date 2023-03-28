import { Member } from '@/src/hooks/useMembers';
import React from 'react';

const MembersList = ({
  members,
  loading,
  error,
}: {
  members: Member[];
  loading: boolean;
  error: string | null;
}) => {
  return <div>...</div>;
};

export default MembersList;
