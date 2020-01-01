import React from 'react'
import _ from 'lodash'
import './index.css'
import { CTInput } from './CTInput'
import { CTSelect, getOptions } from './CTSelect'
import { CTSearch } from './CTSearch'
import { CTTextarea } from './CTTextarea'
import { CTCheckbox } from './CTCheckbox'

export function CTForm({
  id='',
  label='',
  value,
  defaultValue,
  placeholder='Input Here...',
  required=false,
  description,
  onChange,

  color='primary',
  classNames='',

  checkbox=false,
  textarea=false,
  row,
  select=false,
  search=false,
  options=[],
  ...others
}) {

  if (!Boolean(id)) id = `ct-input-${Math.random()}`

  if (checkbox) {
    return (
      <CTCheckbox
        id={id}
        color={color}
        label={label}
        required={required}
        classNames={classNames}
        description={description}
        defaultValue={defaultValue}
        onChange={onChange}
        {...others}
      />
    )
  }

  if (search) {
    return (
      <CTSearch
        id={id}
        value={value}
        color={color}
        label={label}
        search={search}
        options={options}
        required={required}
        classNames={classNames}
        description={description}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        {...others}
      />
    )
  }

  if (select) {
    return (
      <CTSelect
        id={id}
        value={value}
        color={color}
        label={label}
        search={search}
        options={options}
        required={required}
        classNames={classNames}
        description={description}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        {...others}
      />
    )
  }

  if (textarea) {
    return (
      <CTTextarea
        id={id}
        row={row}
        value={value}
        color={color}
        label={label}
        required={required}
        classNames={classNames}
        description={description}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        {...others}
      />
    )
  }

  return (
    <CTInput
      id={id}
      value={value}
      color={color}
      label={label}
      required={required}
      classNames={classNames}
      description={description}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      {...others}
    />
  )
}

CTForm.getOptions = getOptions