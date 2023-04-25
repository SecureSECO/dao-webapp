/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @file CategoryList.tsx
 * Component that displays a list of the specified catgories, separated by horizontal lines.
 */

export type Category = {
  title: string;
  items: CategoryItem[];
};

type CategoryItem = {
  label: string;
  value: string;
};

/**
 *
 * @param props.categories - The categories to be displayed.
 * @returns Component that displays a list of the specified catgories, separated by horizontal lines, with the values of the items getting a highlighted color.
 */
const CategoryList = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.title}>
          <div className="flex flex-row items-center gap-x-2">
            <p className="font-medium opacity-90">{category.title}</p>
            <div className="mt-1 h-0.5 grow rounded-full bg-accent" />
          </div>
          {category.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-row justify-between gap-x-2"
            >
              <p className="text-popover-foreground/80">{item.label}</p>
              <p className="text-primary-highlight">{item.value}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
