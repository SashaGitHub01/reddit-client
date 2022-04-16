import React from 'react'
import TextField from '@mui/material/TextField'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLoginMutation } from '../../generated/graphql'
import Link from 'next/link';
import ControlInput from '../ControlInput';

interface LoginFormData {
   emailOrUsername: string,
   password: string
}

const LoginForm: React.FC = () => {
   const [_result, fetchLogin] = useLoginMutation()

   const schema = Yup.object().shape({
      emailOrUsername: Yup.string()
         .required('Username is required field'),
      password: Yup.string()
         .min(5, 'Password must have atleast 5 characters')
         .required('Password is Required field'),
   })

   const { control, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
      resolver: yupResolver(schema)
   })

   const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
      try {
         const res = await fetchLogin({ input: data })
         if (res.error?.graphQLErrors[0]?.message) {
            setError('emailOrUsername', { message: res.error?.graphQLErrors[0].message })
         }
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
               label='Username'
               name='emailOrUsername'
               error={!!errors.emailOrUsername}
               errorText={errors.emailOrUsername?.message}
            />
            <ControlInput
               control={control as any}
               type='password'
               label='Password'
               name='password'
               error={!!errors.password}
               errorText={errors.password?.message}
            />
            <div className="">
               <Link href='/forgot-password'>
                  <span className="text-blue-400 text-sm cursor-pointer">
                     Forgot password?
                  </span>
               </Link>
            </div>
         </div>
         <div className="flex justify-center py-5">
            <LoadingButton
               variant="contained"
               color='primary'
               type='submit'
               className='bg-btn_primary'
            >
               LOGIN
            </LoadingButton>
         </div>
      </form>
   )
}

export default LoginForm