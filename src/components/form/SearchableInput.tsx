import React from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

interface IProp {
  searchTerm: React.InputHTMLAttributes<HTMLInputElement>["value"];
  handleChange: (data: string) => void;
}

const SearchableInput = ({ searchTerm, handleChange }: IProp) => {
  return (
    <Input
      className="h-11"
      icon={<FiSearch size={22} className="text-neutral-200" />}
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};

export default SearchableInput;
