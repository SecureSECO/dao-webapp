/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useForm } from 'react-hook-form';

type DepositAssetsData = {
  name: string;
};

export const DepositAssets = ({}) => {
  const { register, handleSubmit } = useForm<DepositAssetsData>({});

  const onSubmit = (data: DepositAssetsData) => {
    console.log(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}></form>;
};
