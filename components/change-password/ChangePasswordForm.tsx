import React from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { useChangePasswordMutation } from '../../generated/graphql'
import { useRouter } from 'next/router'

interface FormFields {
   newPassword: string,
   confirm: string
}

const ChangePasswordForm: React.FC<{ token: string }> = ({ token }) => {
   const router = useRouter()
   const [fetchChangePassword] = useChangePasswordMutation()
   const schema = Yup.object().shape({
      newPassword: Yup.string().min(5).max(20),
      confirm: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must be equal')
   })

   const { control, formState: { errors }, handleSubmit, setError } = useForm<FormFields>({
      resolver: yupResolver(schema)
   })

   const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
         const res = await fetchChangePassword({
            variables: {
               newPassword: data.newPassword,
               secret: token
            }
         })

         if (res.errors?.[0]?.message) {
            setError('newPassword', { message: res.errors[0].message })
         }

         if (!!res?.data?.changePassword) router.push('/login')

      } catch (err) {
         console.log(err)
      }
   }

   return (
      <form action="" className="w-full" onSubmit={handleSubmit(onSubmit)}>
         <div className="flex flex-col gap-5 py-5">
            <Controller
               render={({ field: { ref, ...fields } }) => {
                  return <TextField
                     type='password'
                     error={!!errors.newPassword}
                     helperText={errors.newPassword?.message}
                     label='New password'
                     {...fields}
                  />
               }}
               name='newPassword'
               control={control}
               defaultValue=""
            />
            <Controller
               render={({ field: { ref, ...fields } }) => {
                  return <TextField
                     type='password'
                     error={!!errors.confirm}
                     helperText={errors.confirm?.message}
                     label='Confirm password'
                     {...fields}
                  />
               }}
               name='confirm'
               control={control}
               defaultValue=""
            />
         </div>
         <Button
            type='submit'
            className='bg-btn_primary'
            variant='contained'
         >
            Save
         </Button>
      </form>
   )
}

export default ChangePasswordForm