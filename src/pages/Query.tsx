/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useEffect } from 'react';

const Query = () => {
    return (
        <div className="flex flex-col gap-6">
            <HeaderCard title="Query" />
        </div>
    )
}

export default Query;