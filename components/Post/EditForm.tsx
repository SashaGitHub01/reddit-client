import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useUpdatePostMutation } from '../../generated/graphql'
import ControlInput from '../ControlInput'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@mui/material'

interface UpdateForm {
   text: string
}

interface EditFormProps {
   id: number,
   defaultValue: string,
   onCancel: () => void
}

const EditForm: React.FC<EditFormProps> = ({ id, defaultValue, onCancel }) => {
   const schema = Yup.object().shape({
      text: Yup.string()
         .max(750)
         .trim()
         .required('Required field'),
   })
   const [{ fetching }, fetchUpdate] = useUpdatePostMutation()
   const { control, formState: { errors, isDirty, isSubmitting }, handleSubmit } = useForm<UpdateForm>({
      resolver: yupResolver(schema),
      defaultValues: {
         text: defaultValue
      }
   })

   const onSubmit: SubmitHandler<UpdateForm> = async (data) => {
      await fetchUpdate({
         text: data.text,
         id
      })
   }

   return (
      <form
         className='flex flex-col'
         onSubmit={handleSubmit(onSubmit)}
      >
         <ControlInput
            control={control as any}
            type='text'
            label='Content'
            name='text'
            error={!!errors.text}
            errorText={errors.text?.message}
            textarea={true}
            counter={true}
            limit={750}
         />
         <div className="flex gap-3 py-2 self-end">
            <Button
               onClick={onCancel}
               variant='outlined'
               color={'error'}
               type={"button"}
            >
               Cancel
            </Button>
            <Button
               variant='contained'
               color={'primary'}
               type={'submit'}
            >
               Save
            </Button>
         </div>
      </form>
   )
}

export default EditForm