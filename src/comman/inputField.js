import { TextField } from "@mui/material";
import React  from "react";

const InputField = ({ value, label, name,placeholder,style,checked, defaultValue,htmlFor, className, required, id, variant, helperText, autoComplete, inputprops, inputlabelprops, select, type, onChange, disabled }) => (
  <div className="form-group">
    {label && <label htmlFor={htmlFor}>{label}</label>}
  
    <TextField
    type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      className={className}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled = {disabled}
      required = {required}
      id = {id}
      variant = {variant}
      helperText ={helperText}
      autoComplete={autoComplete}
      select = {select}
      checked = {checked}
      style={style}
    />
    
  </div>
);

export default InputField;