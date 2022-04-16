import type { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import HomeOptions from '../components/Home/HomeOptions'
import PostsList from '../components/Home/PostsList'
import Wrapper from '../components/Wrapper'
import { useMeQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Home: NextPage = () => {
   const [{ data }] = useMeQuery()

   return (
      <Wrapper>
         <div className="">
            {data?.me
               ? <HomeOptions pageProps={''} />
               : null}
            <PostsList />
         </div>
      </Wrapper>
   )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home)
