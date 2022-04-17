import { useRouter } from "next/router"
import { useEffect, useState } from "react"

interface EditModeData {
   status: boolean,
   close: () => void,
   open: () => void,
}

export const useEditMode = (): EditModeData => {
   const router = useRouter()
   const [isEdit, setIsEdit] = useState(false)
   useEffect(() => {
      if (router.query?.edit === 'false') {
         setIsEdit(false)
      } else if (router.query?.edit === 'true') {
         setIsEdit(true)
      }
   }, [router.query?.edit])

   const open = () => {
      router.replace({
         query: { ...router.query, edit: 'true' }
      })
   }

   const close = () => {
      router.replace({
         query: { ...router.query, edit: 'false' }
      })
   }

   return { status: isEdit, close, open }
}