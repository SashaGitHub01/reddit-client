import React from 'react'
import TextField from '@mui/material/TextField'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { Button } from '@mui/material'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterMutation } from '../../generated/graphql'

interface RegFormData {
   password2: string,
   password: string,
   email: string,
   username: string
}

const RegForm: React.FC = () => {
   const [result, fetchReg] = useRegisterMutation()
   const schema = Yup.object().shape({
      username: Yup.string()
         .trim()
         .required('Username is required field'),
      email: Yup.string()
         .email('Invalid email')
         .required('Email is required field'),
      password: Yup.string()
         .min(5, 'Password must have atleast 5 characters')
         .trim()
         .required('Password is Required field'),
      password2: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
   })

   const { control, handleSubmit, formState: { errors }, setError } = useForm<RegFormData>({
      resolver: yupResolver(schema)
   })

   const onSubmit: SubmitHandler<RegFormData> = async (data) => {
      try {
         const { password2, ...input } = data;
         const res = await fetchReg({ input })
         if (res.error?.graphQLErrors[0].message) {
            setError('username', { message: res.error.graphQLErrors[0].message })
         }
      } catch (err: any) {
         console.log(err);
      }
   }

   return (
      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
         <div className="flex flex-col gap-4">
            <Controller
               render={({ field: { ref, ...fields } }) => {
                  return <TextField
                     helperText={errors.email?.message}
                     error={!!errors.email}
                     label='Email'
                     {...fields}
                  />
               }}
               name='email'
               control={control}
               defaultValue=""
            />
            <Controller
               render={({ field: { ref, ...fields } }) => {
                  return <TextField
                     helperText={errors.username?.message}
                     error={!!errors.username}
                     label='Username'
                     {...fields}
                  />
               }}
               name='username'
               control={control}
               defaultValue=""
            />
            <Controller
               render={({ field: { ref, ...fields } }) => {
                  return <TextField
                     helperText={errors.password?.message}
                     error={!!errors.password}
                     label='Password'
                     type={'password'}
                     {...fields}
                  />
               }}
               name='password'
               control={control}
               defaultValue=""
            />
            <Controller
               render={({ field: { ref, ...fields } }) => {
                  return <TextField
                     error={!!errors.password2}
                     helperText={errors.password2?.message}
                     label='Confirm password'
                     type={'password'}
                     {...fields}
                  />
               }}
               name='password2'
               control={control}
               defaultValue=""
            />
         </div>
         <div className="flex justify-center py-5">
            <Button
               variant="contained"
               color='primary'
               type='submit'
               className='bg-btn_primary'
            >
               REGISTER
            </Button>
         </div>
      </form>
   )
}

export default RegForm