import ReactSelect from "react-select";
import type { GroupBase, Props } from "react-select";

type SelectProps<T> = {
  options?: T[];
};

export const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: Props<Option, IsMulti, Group>,
) => {
  return (
    <div className="rselect rselect--white">
      <ReactSelect
        hideSelectedOptions
        isSearchable={false}
        {...props}
        classNamePrefix="rselect"
      />
    </div>
  );
};
