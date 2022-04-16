import React, { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { useForgotPasswordMutation } from '../../generated/graphql'
import { useRouter } from 'next/router'

interface FormFields {
   email: string,
}

const ForgotPasswordForm: React.FC = () => {
   const [complete, setComplete] = useState(false)
   const [_, fetchForgotPassword] = useForgotPasswordMutation()
   const schema = Yup.object().shape({
      email: Yup.string().email().required(),
   })

   const { control, formState: { errors }, handleSubmit, setError } = useForm<FormFields>({
      resolver: yupResolver(schema)
   })

   const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
         const res = await fetchForgotPassword({
            email: data.email
         })
         if (res.error?.graphQLErrors[0].message) {
            setError('email', { message: res.error?.graphQLErrors[0].message })
         } else if (res.data) {
            setComplete(true)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <form action="" className="w-full" onSubmit={handleSubmit(onSubmit)}>
         {!complete
            ? <>
               <div className="flex flex-col gap-5 py-5">
                  <Controller
                     render={({ field: { ref, ...fields } }) => {
                        return <TextField
                           error={!!errors.email}
                           helperText={errors.email?.message}
                           label='Your email'
                           {...fields}
                        />
                     }}
                     name='email'
                     control={control}
                     defaultValue=""
                  />
               </div>
               <Button
                  type='submit'
                  className='bg-btn_primary'
                  variant='contained'
               >
                  Confirm
               </Button>
            </>
            : <div className='text-center py-7'>
               <span className="text-lg text-green-300">
                  We sent instructions how to change the password to your email.
               </span>
            </div>}
      </form>
   )
}

export default ForgotPasswordForm