import { TextField, TextareaAutosize, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, Control } from 'react-hook-form'

interface ControlInputProps {
   control: Control,
   error?: boolean,
   errorText?: string,
   name: string,
   label: string,
   type?: string,
   textarea?: boolean,
   limit?: number,
   counter?: boolean,
   defaultValue?: string
}

const ControlInput: React.FC<ControlInputProps> = ({
   control, error, errorText, name, label, type, textarea, limit, counter, ...props
}) => {
   const [length, setLength] = useState<number>(0)

   const handleProgress = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      onChange: (e: any) => void
   ) => {
      if (limit == undefined) return;
      if (e.target.value.length >= limit) return
      onChange(e)
      setLength((e.target.value.length * 100) / limit)
   }

   useEffect(() => {
      if (counter && !control.getFieldState(name).isDirty && length > 0) setLength(0)
   }, [length, counter, control.getFieldState(name)])

   return (
      <Controller
         render={({ field: { ref, onChange, ...fields } }) => {
            return <>
               {!textarea
                  ? <TextField
                     {...props}
                     {...fields}
                     onChange={onChange}
                     error={error}
                     helperText={errorText}
                     label={label}
                     type={type || 'text'}
                  />
                  : <div className='relative'>
                     <TextareaAutosize
                        {...props}
                        {...fields}
                        placeholder={label}
                        className='rounded-md border border-solid p-4 border-gray-300 w-full resize-none leading-5'
                        minRows={3}
                        maxRows={10}
                        onChange={(e) => handleProgress(e, onChange)}
                     />
                     {length > 0 && counter
                        && <div className='absolute right-2 bottom-2'>
                           <CircularProgress
                              color={(limit as any) * (length / 100) >= (limit as any) - 10
                                 ? 'error'
                                 : 'primary'}
                              size={25}
                              thickness={4}
                              variant="determinate"
                              value={length}
                           />
                        </div>}
                  </div>}
            </>
         }}
         name={name}
         control={control}
         defaultValue=""
      />
   )
}

export default ControlInput