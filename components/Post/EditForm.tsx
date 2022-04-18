import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PostDocument, PostQuery, useUpdatePostMutation } from '../../generated/graphql'
import ControlInput from '../ControlInput'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';

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
   const [fetchUpdate, { error },] = useUpdatePostMutation()
   const { control, formState: { errors, isDirty, isSubmitting }, handleSubmit, setError } = useForm<UpdateForm>({
      resolver: yupResolver(schema),
      defaultValues: {
         text: defaultValue
      }
   })

   const onSubmit: SubmitHandler<UpdateForm> = async (data) => {
      await fetchUpdate({
         variables: {
            text: data.text,
            id
         },

         update: (cache, { data }) => {
            const post = cache.readQuery<PostQuery>({
               query: PostDocument,
               variables: {
                  id
               }
            })

            cache.writeQuery({
               query: PostDocument,
               data: {
                  _typename: 'Query',
                  post: {
                     ...post?.post,
                     text: data?.updatePost.text
                  },
               },
               variables: {
                  id
               }
            })
         }
      })

      if (error) {
         setError('text', { message: error.message })
      } else {
         onCancel()
      }
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
            <LoadingButton
               loading={isSubmitting}
               disabled={!isDirty}
               variant='contained'
               color={'primary'}
               type={'submit'}
            >
               Save
            </LoadingButton>
         </div>
      </form>
   )
}

export default EditForm