"use client";

import { useState } from "react";

const statusOptions = [
  { value: "to-do", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const SelectBox = ({ options = statusOptions, value }:any) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const onChange = (event:any) => {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
  };

  return (
    <select value={selectedValue} onChange={onChange} name="status" id="status" className="ml-0 pl-0 ring-0 outline-none">
      {options.map((option:any, index:number) => (
        <option key={index} value={option.value} >
        {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;
