import React from 'react'
import ControlInput from '../../ControlInput'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'
import { DialogActions } from '@mui/material'
import { useCreatePostMutation } from '../../../generated/graphql'

interface PostFormData {
   title: string,
   text: string
}

interface PostFormProps {
   onCancel: () => void
}

const PostForm: React.FC<PostFormProps> = ({ onCancel }) => {
   const [_, fetchCreatePost] = useCreatePostMutation()

   const schema = Yup.object().shape({
      title: Yup.string()
         .max(100)
         .trim()
         .required('Required field'),
      text: Yup.string()
         .max(750)
         .trim()
         .required('Required field'),
   })

   const {
      control, handleSubmit, formState: { errors, isDirty, isSubmitting }, reset
   } = useForm<PostFormData>({
      resolver: yupResolver(schema)
   })

   const onSubmit: SubmitHandler<PostFormData> = async (data) => {
      try {
         const res = await fetchCreatePost({
            input: data
         })
         if (!res.error) reset({
            text: ''
         })
         onCancel()
      } catch (err) {
         console.log(err);
      }
   }

   return (
      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
         <div className="flex flex-col gap-4">
            <ControlInput
               control={control as any}
               type='text'
               label='Title'
               name='title'
               error={!!errors.title}
               errorText={errors.title?.message}
            />
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
         </div>
         <DialogActions className="pt-4 flex gap-4">
            <LoadingButton
               variant="contained"
               color='primary'
               type='submit'
               className='bg-btn_primary'
               disabled={!isDirty}
               loading={isSubmitting}
            >
               Create
            </LoadingButton>
            <LoadingButton
               onClick={onCancel}
               type='button'
               variant="outlined"
               color='primary'
               className=''
            >
               Cancel
            </LoadingButton>
         </DialogActions>
      </form>
   )
}

export default PostForm